import { Router } from 'express';
import { createPost, login, register} from '../services/lumenAPI';
import { getCached, setCached } from '../cacheLayer';
import crypto from 'crypto';

const apiRouter = Router();


apiRouter.get('/ping', (req, res) => {
  res.json({ message: 'pong from Node API' });
});



apiRouter.post('/posts', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || '';
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });

    // Create post
    const newPost = await createPost({ title, content }, token);

    const safeToken = crypto.createHash('sha256').update(token).digest('hex');
    const cacheKey = `posts_cache_${safeToken}`;

    // Get current cached posts safely
    const cachedPostsRaw = await getCached(cacheKey, async () => [], 60);
    const cachedPosts: any[] = Array.isArray(cachedPostsRaw) ? cachedPostsRaw : [];

    // Prepend new post
    const updatedPosts = [newPost, ...cachedPosts];

    // Sort newest-first safely
    updatedPosts.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    // Update cache
    await setCached(cacheKey, updatedPosts, 60);

    res.status(201).json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


apiRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const result = await login({ email, password });
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; 
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const result = await register({ name, email, password });
    res.status(201).json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default apiRouter;