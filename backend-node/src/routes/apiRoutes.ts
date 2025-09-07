import { Router } from 'express';
import { createPost, login, register} from '../services/lumenAPI';

const apiRouter = Router();

apiRouter.post('/posts', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1] || '';
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
    const result = await createPost({ title, content }, token);
    res.status(201).json(result.data);
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