import { Router } from 'express';
import { getCached } from '../cacheLayer';
import { getPosts, getPostsByID, pingLumen} from '../services/lumenAPI';
import crypto from 'crypto';
import { Post, RawPost } from '../interfaces';

const cacheRouter = Router();

/**
 * Pings the Lumen backend to debug and check connectivity.
 *
 * Route: GET /ping-lumen
 *
 * Responses:
 * 200 OK → Forwarded response from Lumen API
 * 500 Internal Server Error → { "error": string }
 */
cacheRouter.get('/ping-lumen', async (req, res) => {
  try {
    const result = await pingLumen();
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * Retrieves all posts for the authenticated user, with caching.
 *
 * Route: GET /posts
 *
 * Headers:
 *   Authorization: Bearer <JWT token>
 *
 * Cache:
 *   Key format: posts_cache_<hashedToken>
 *   TTL: 60 seconds
 *
 * Responses:
 * 200 OK → [
 *   {
 *     "id": number,
 *     "title": string,
 *     "content": string,
 *     "username": string,
 *     "createdAt": string (ISO date)
 *   },
 *   ...
 * ]
 * 401 Unauthorized → { "error": "Missing token" }
 * 500 Internal Server Error → { "error": string }
 */
cacheRouter.get('/posts', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const safeToken = crypto.createHash('sha256').update(token).digest('hex');
    const cacheKey = `posts_cache_${safeToken}`;

    const cachedPostsRaw = await getCached(cacheKey, async () => {
      const response = await getPosts(token);
      return response.data;
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

/**
 * Retrieves a single post by ID, with caching.
 *
 * Route: GET /posts/:id
 *
 * Headers:
 *   Authorization: Bearer <JWT token>
 *
 * Path params:
 *   id: number; // required
 *
 * Cache:
 *   Key format: post_<id>_cache_<hashedToken>
 *   TTL: 60 seconds
 *
 * Responses:
 * 200 OK → Post object (forwarded from Lumen API)
 * 401 Unauthorized → { "error": "Missing token" }
 * 500 Internal Server Error → { "error": string }
 */
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
