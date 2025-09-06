import { Router } from 'express';
import { getCached } from './cacheLayer';
import { getPosts, getPostsByID, pingLumen} from './services/lumenAPI';
import crypto from 'crypto';

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
    const token = req.headers['authorization']?.split(' ')[1] || '';
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const safeToken = crypto.createHash('sha256').update(token).digest('hex');
    const cacheKey = `posts_cache_${safeToken}`; 
    const data = await getCached(cacheKey, () => getPosts(token), 60);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || '';
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const safeToken = crypto.createHash('sha256').update(token).digest('hex');
    const postId = req.params.id;
    const data = await getCached(`post_${postId}_cache_${safeToken}`, () => getPostsByID(Number(postId), token), 60);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
