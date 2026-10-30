const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { getClient } = require("../util/redis"); 

const createLimiter = ({ windowMs, max, message }) => {
  const client = getClient;
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true, // returns `RateLimit-*` headers
    legacyHeaders: false,
    message: { success: false, message },
    store: client?.isReady
      ? new RedisStore({
          sendCommand: (...args) => client.sendCommand(args),
          prefix: "rl:",
        })
      : undefined, // falls back to in-memory if Redis is temporarily offline
  });
};

// 1. Auth limiter (Strict)
const authLimiter = createLimiter({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 5,
  message: "Too many login attempts. Please try again after 15 minutes.",
});

// 2. Email limiter (Very strict)
const emailLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many email requests. Please wait an hour before requesting again.",
});

// 3. Payment limiter (Per minute)
const paymentLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Transaction request limit reached. Please wait a moment.",
});

// 4. Global API limiter (General protection)
const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests from this network. Please slow down.",
});

module.exports = { authLimiter, emailLimiter, paymentLimiter, globalLimiter };