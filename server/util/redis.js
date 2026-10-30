const { createClient } = require("redis");

let client;
let connectionPromise;
const REDIS_CONNECT_TIMEOUT_MS = 3000;

const getClient = () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!client) {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: { connectTimeout: REDIS_CONNECT_TIMEOUT_MS },
    });
    
    client = redisClient;
    redisClient.on("error", (error) => {
      console.error("Redis error:", error.message);
    });


    connectionPromise = redisClient.connect().catch((error) => {
      console.error("Redis connection failed:", error.message);
      if (client === redisClient) {
        client = null;
        connectionPromise = null;
      }
      return null;
    });
  }

  return client;
};

const waitForConnection = async (redis) => {
  if (!connectionPromise) return false;

  let timeoutId;
  try {
    await Promise.race([
      connectionPromise,
      new Promise((resolve) => {
        timeoutId = setTimeout(resolve, REDIS_CONNECT_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }

  return redis.isReady;
};

const getJson = async (key) => {
  const redis = getClient();
  if (!redis) return null;

  try {
    if (!(await waitForConnection(redis))) return null;

    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;

  } catch (error) {
    console.error("Redis read failed:", error.message);
    return null;
  }
};

const setJson = async (key, value, ttlSeconds = 120) => {
  const redis = getClient();
  if (!redis) return;

  try {
    if (!(await waitForConnection(redis))) return;

    await redis.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error("Redis write failed:", error.message);
  }
};

const deleteKey = async (key) => {
  const redis = getClient();
  if (!redis) return;

  try {
    if (!(await waitForConnection(redis))) return;

    await redis.del(key);
  } catch (error) {
    console.error("Redis delete failed:", error.message);
  }
};

const getManualCatalogVersion = async () => {
  const redis = getClient();
  if (!redis) return "0";

  try {
    if (!(await waitForConnection(redis))) return "0";

    return (await redis.get("manuals:catalog:version")) || "0";
  } catch (error) {
    console.error("Redis version read failed:", error.message);
    return "0";
  }
};

const getRepPortalVersion = async (repId) => {
  const redis = getClient();
  if (!redis) return "0";

  try {
    if (!(await waitForConnection(redis))) return "0";

    return (await redis.get(`rep:portal:version:${repId}`)) || "0";
  } catch (error) {
    console.error("Redis representative version read failed:", error.message);
    return "0";
  }
};

const invalidateRepPortal = async (repId) => {
  const redis = getClient();
  if (!redis) return;

  try {
    if (!(await waitForConnection(redis))) return;

    await redis.incr(`rep:portal:version:${repId}`);
  } catch (error) {
    console.error("Redis representative invalidation failed:", error.message);
  }
};

const invalidateManualCatalog = async () => {
  const redis = getClient();
  if (!redis) return;

  try {
    if (!(await waitForConnection(redis))) return;

    await redis.incr("manuals:catalog:version");
  } catch (error) {
    console.error("Redis invalidation failed:", error.message);
  }
};

const invalidateTransactionHistory = async (studentId) => {
  await deleteKey(`transactions:history:${studentId}`);
};

const invalidatePurchasedManuals = async (studentId) => {
    await deleteKey(`purchased:manual:${studentId}`);
};

module.exports = {
  getClient,
  getJson,
  setJson,
  getManualCatalogVersion,
  getRepPortalVersion,
  invalidateManualCatalog,
  invalidateRepPortal,
  invalidateTransactionHistory,
  invalidatePurchasedManuals,
};
