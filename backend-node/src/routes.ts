import { Router } from 'express';
import { getPosts, getPostsByID, pingLumen, setAuthToken } from './services/lumenAPI';
import { redis } from './redisClient';
const router = Router();

router.get('/ping-lumen', async (req, res) => {
  try {
    const result = await pingLumen();
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts', async (req, res) => {
  try {
    const cacheKey = 'posts_cache';
    const cachedPosts = await redis.get(cacheKey);
    const token = req.headers['authorization']; 
    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }
    const result = await getPosts();
    await redis.set(cacheKey, JSON.stringify(result.data), 'EX', 60);

    res.json(result.data);

  } 
  catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {

    const postId = Number(req.params.id);
    const cacheKey = `post_${postId}_cache`;
    const token = req.headers['authorization']; 
    const cachedPost = await redis.get(cacheKey);

    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }
    if(cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }
    
    const result = await getPostsByID(postId);
    await redis.set(cacheKey, JSON.stringify(result.data), 'EX', 60);
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
