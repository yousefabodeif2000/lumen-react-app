import axios from 'axios';
import { PostPayload } from '../interfaces';
const lumenAPI = axios.create({
  baseURL: process.env.LUMEN_API_URL || "http://localhost:9000/api",
  timeout: 10000,
});


export const pingLumen = () => axios.get('http://localhost:9000/ping');

export const getPosts = (token: string) => lumenAPI.get('/posts', {headers: {Authorization: `Bearer ${token}`}});
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
