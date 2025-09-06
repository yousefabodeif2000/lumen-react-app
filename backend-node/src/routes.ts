import { Router } from 'express';
import { getPosts, getPostsByID, pingLumen, setAuthToken } from './services/lumenAPI';

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
    const token = req.headers['authorization']; 
    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }
    const result = await getPosts();
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']; 
    if (token) {
      setAuthToken(token.replace('Bearer ', ''));
    }

    const postId = Number(req.params.id);
    const result = await getPostsByID(postId);
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
