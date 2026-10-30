// middleware/idempotency.js
const { getClient } = require("../util/redis");

const idempotency = (ttlSeconds = 300) => {
    return async (req, res, next) => {
        if (req.method !== "POST") return next();

        const idempotencyKey = req.headers["idempotency-key"] || (req.user && req.body.manualId ? `manual-init:${req.user._id}:${req.body.manualId}` : null);

        if (!idempotencyKey) {
            return next();
        }

        const client = getClient();
        if (!client || !client.isReady) {
            return next(); // Fail-open to DB layer if Redis is down
        }

        const redisKey = `idempotency:${idempotencyKey}`;

        try {
            // 1. Check if we already processed this request
            const existing = await client.get(redisKey);

            if (existing) {
                if (existing === "IN_FLIGHT") {
                    // Another request with this key is currently contacting Paystack
                    return res.status(409).json({
                        success: false,
                        message: "A checkout request is already processing. Please wait.",
                    });
                }

                // Return the exact cached response from previous successful execution
                const cachedResponse = JSON.parse(existing);
                res.setHeader("X-Cache-Lookup", "HIT-IDEMPOTENT");
                return res.status(cachedResponse.status).json(cachedResponse.body);
            }

            // 2. Acquire atomic processing lock (NX = Only set if Not Exists)
            // Lock lasts 30 seconds to prevent hanging if the server crashes
            const acquired = await client.set(redisKey, "IN_FLIGHT", {
                NX: true,
                EX: 30,
            });

            if (!acquired) {
                return res.status(409).json({
                    success: false,
                    message: "A concurrent request is already running.",
                });
            }

            // 3. Intercept res.json to cache the final successful response
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // Cache successful response for 5 minutes (or longer)
                    client.setEx(
                        redisKey,
                        ttlSeconds,
                        JSON.stringify({ status: res.statusCode, body })
                    ).catch((err) => console.error("Idempotency cache save error:", err));
                } else {
                    // If transaction failed/errored, release the lock so the user can try again
                    client.del(redisKey).catch(() => { });
                }
                return originalJson(body);
            };

            next();
        } catch (err) {
            console.error("Idempotency middleware error:", err);
            next();
        }
    };
};

module.exports = idempotency;