import { Router } from 'express';
import { createPost, deletePost, login, register} from '../services/lumenAPI';
import { getCached, setCached } from '../cacheLayer';
import crypto from 'crypto';

const apiRouter = Router();

/**
 * Health check endpoint for debugging.
 *
 * Route: GET /ping
 *
 * Responses:
 * 200 OK → { "message": "pong from Node API" }
 */
apiRouter.get('/ping', (req, res) => {
  res.json({ message: 'pong from Node API' });
});


/**
 * Creates a new post and updates the cache for the user.
 *
 * Route: POST /posts
 *
 * Headers:
 *   Authorization: Bearer <JWT token>
 *
 * Request body:
 * {
 *   "title": string;   // required
 *   "content": string; // required
 * }
 *
 * Responses:
 * 201 Created → The newly created post object.
 * 400 Bad Request → { "error": "Title and content are required" }
 * 401 Unauthorized → { "error": "Missing token" }
 * 500 Internal Server Error → { "error": string }
 */
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

/**
 * Authenticates a user with email and password.
 *
 * Route: POST /login
 *
 * Request body:
 * {
 *   "email": string;    // required
 *   "password": string; // required
 * }
 *
 * Responses:
 * 200 OK → { token: string, user: object }
 * 400 Bad Request → { "error": "Email and password are required" }
 * 500 Internal Server Error → { "error": string }
 */
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

/**
 * Registers a new user.
 *
 * Route: POST /register
 *
 * Request body:
 * {
 *   "name": string;     // required
 *   "email": string;    // required
 *   "password": string; // required
 * }
 *
 * Responses:
 * 201 Created → The registered user object
 * 400 Bad Request → { "error": "Name, email and password are required" }
 * 500 Internal Server Error → { "error": string }
 */
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

/**
 * Deletes a post by ID.
 *
 * Route: DELETE /posts/:id
 *
 * Headers:
 *   Authorization: Bearer <JWT token>
 *
 * Path params:
 *   id: number; // required, must be a valid integer
 *
 * Responses:
 * 200 OK → Confirmation object (from Lumen API)
 * 204 No Content → (alternative success response)
 * 400 Bad Request → { "error": "Invalid post id" }
 * 401 Unauthorized → { "error": "Missing token" }
 * 500 Internal Server Error → { "error": string }
 */
apiRouter.delete('/posts/:id', async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) return res.status(400).json({ error: 'Invalid post id' });

    const deleteAction = await deletePost(postId, token);
    res.status(200).json(deleteAction);  // or res.sendStatus(204)
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default apiRouter;