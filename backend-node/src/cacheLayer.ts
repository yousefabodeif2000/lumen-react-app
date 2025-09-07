import { redis } from './redisClient';

export const getCached = async <T>(key: string, apiCall: () => Promise<T>, ttl = 60): Promise<T> => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const data = await apiCall(); // getPosts() returns array of posts
  await redis.set(key, JSON.stringify(data), 'EX', ttl); // store only array
  return data;
};

export const setCached = async (key: string, data: any, ttl = 60) => {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
};

