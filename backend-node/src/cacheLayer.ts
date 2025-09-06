import { redis } from './redisClient';

export const getCached = async (key: string, apiCall: () => Promise<any>, ttl = 60) => {

    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    try {
        const response = await apiCall();
        await redis.set(key, JSON.stringify(response.data), 'EX', ttl);
        return response.data;
    } catch (err) {
        throw err; 
    }
};
