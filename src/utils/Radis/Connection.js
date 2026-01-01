import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = createClient({
  url: REDIS_URL,
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("ready", () => console.log("🚀 Redis ready"));
redis.on("reconnecting", () => console.log("🔄 Redis reconnecting..."));
redis.on("error", (err) => console.log("❌ Redis Client Error:", err.message));

export const redisConnection = async () => {
  if (!redis.isOpen) {
    console.log(redis.isOpen);

    await redis.connect();
  }
};
