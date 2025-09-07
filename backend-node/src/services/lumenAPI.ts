import axios from 'axios';

const lumenAPI = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

export interface Post {
  id: number;
  title: string;
  content: string;
  username: string;
  createdAt: string;
}
export interface PostPayload {
  title: string;
  content: string;
}
export const pingLumen = () => axios.get('http://localhost:8000/ping');

export const getPosts = async (token: string): Promise<Post[]> => {
  const res = await lumenAPI.get('/posts', {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Normalize: handle res.data or res.data.data
  const postsArrayRaw = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : [];

  // Map to Post interface
  return postsArrayRaw.map((post: any) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    username: post.user?.name || 'Unknown',
    createdAt: post.created_at || post.createdAt || new Date().toISOString(),
  }));
};
export const getPostsByID = (id: number, token: string) => lumenAPI.get(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });



export const createPost = async (payload: PostPayload, token: string) => {
  const res = await lumenAPI.post('/posts', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // plain post object
};

export const login = (data: { email: string; password: string }) => lumenAPI.post('/login', data);
export const register = (data: { name: string; email: string; password: string }) => lumenAPI.post('/register', data);

export default lumenAPI;
