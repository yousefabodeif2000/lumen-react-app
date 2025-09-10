import { redis } from './redisClient';

/**
 * Get cached data from Redis or fetch fresh data via a fallback API call.
 *
 * This function first checks Redis for a cached value using the given key.
 * If present, it parses and returns the cached data.
 * Otherwise, it calls the provided async `apiCall` function, caches the result,
 * and then returns it.
 *
 * @template T - The expected type of the cached data
 * @param key - Redis cache key
 * @param apiCall - Async function that fetches fresh data
 * @param ttl - Time-to-live in seconds (default: 60)
 * @returns Promise<T> - The cached or freshly fetched data
 */
export const getCached = async <T>(key: string, apiCall: () => Promise<T>, ttl = 60): Promise<T> => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await apiCall(); // getPosts() returns array of posts
  await redis.set(key, JSON.stringify(data), 'EX', ttl); // store only array
  return data;
};

/**
 * Store data in Redis cache.
 *
 * Converts the provided data to JSON and sets it in Redis under the given key,
 * with an optional TTL (time-to-live).
 *
 * @param key - Redis cache key
 * @param data - Data to cache
 * @param ttl - Time-to-live in seconds (default: 60)
 */
export const setCached = async (key: string, data: any, ttl = 60) => {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
};

