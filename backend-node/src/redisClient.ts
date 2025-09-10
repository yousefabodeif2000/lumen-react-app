import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || (process.env.DOCKER_ENV ? 'redis' : '127.0.0.1'),   
  port: 6379,
});
 