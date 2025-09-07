import { Router } from 'express';
import { getCached } from '../cacheLayer';
import { getPosts, getPostsByID, pingLumen} from '../services/lumenAPI';
import crypto from 'crypto';
import { Post, RawPost } from '../interfaces';

const cacheRouter = Router();

cacheRouter.get('/ping-lumen', async (req, res) => {
  try {
    const result = await pingLumen();
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

cacheRouter.get('/posts', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const safeToken = crypto.createHash('sha256').update(token).digest('hex');
    const cacheKey = `posts_cache_${safeToken}`;

    const cachedPostsRaw = await getCached(cacheKey, async () => {
      const response = await getPosts(token);
      return response.data; // <--- important
    }, 60);

    const cachedPosts: Post[] = Array.isArray(cachedPostsRaw) ? cachedPostsRaw : [];

    // Assume cachedPostsRaw is an array of RawPost
    const rawPosts = cachedPostsRaw as RawPost[];

    const posts: Post[] = rawPosts.map((p: RawPost) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      username: p.user?.name || 'Unknown',
      createdAt: p.created_at
    }));

    // Sort newest first
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());




    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


cacheRouter.get('/posts/:id', async (req, res) => {
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

export default cacheRouter;
