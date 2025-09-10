import axios from 'axios';
import { PostPayload } from '../interfaces';


/**
 * Axios instance configured for the Lumen API.
 *
 * Base URL: process.env.LUMEN_API_URL || "http://localhost:9000/api"
 * Timeout: 10 seconds
 */
const lumenAPI = axios.create({
  baseURL: process.env.LUMEN_API_URL || "http://localhost:9000/api",
  timeout: 10000,
});

/**
 * Health check for the Lumen service.
 *
 * GET http://localhost:9000/ping
 *
 * @returns AxiosPromise<{ message: string }>
 */
export const pingLumen = () => axios.get('http://localhost:9000/ping');

/**
 * Fetch all posts (requires JWT).
 *
 * GET /posts
 * Headers: Authorization: Bearer <token>
 *
 * @param token - JWT access token
 * @returns AxiosPromise<Post[]>
 */
export const getPosts = (token: string) => lumenAPI.get('/posts', {headers: {Authorization: `Bearer ${token}`}});

/**
 * Fetch a single post by ID (requires JWT).
 *
 * GET /posts/:id
 * Headers: Authorization: Bearer <token>
 *
 * @param id - Post ID
 * @param token - JWT access token
 * @returns AxiosPromise<Post>
 */
export const getPostsByID = (id: number, token: string) => lumenAPI.get(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });

/**
 * Create a new post (requires JWT).
 *
 * POST /posts
 * Headers: Authorization: Bearer <token>
 * Body: { title: string, content: string }
 *
 * @param payload - New post data
 * @param token - JWT access token
 * @returns Promise<Post>
 */
export const createPost = async (payload: PostPayload, token: string) => {
  const res = await lumenAPI.post('/posts', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // plain post object
};

/**
 * Delete a post by ID (requires JWT).
 *
 * DELETE /posts/:id
 * Headers: Authorization: Bearer <token>
 *
 * @param id - Post ID
 * @param token - JWT access token
 * @returns Promise<any> // deletion response from Lumen
 */
export const deletePost = async (id: number, token: string) => {
  const res = await lumenAPI.delete(`/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

/**
 * Authenticate a user and retrieve a JWT.
 *
 * POST /login
 * Body: { email: string, password: string }
 *
 * @param data - Login credentials
 * @returns AxiosPromise<{ token: string }>
 */
export const login = (data: { email: string; password: string }) => lumenAPI.post('/login', data);

/**
 * Register a new user account.
 *
 * POST /register
 * Body: { name: string, email: string, password: string }
 *
 * @param data - Registration details
 * @returns AxiosPromise<{ user: object, token: string }>
 */

export const register = (data: { name: string; email: string; password: string }) => lumenAPI.post('/register', data);

export default lumenAPI;
