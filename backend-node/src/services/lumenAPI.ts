import axios from 'axios';

const lumenAPI = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});


export const pingLumen = () => axios.get('http://localhost:8000/ping');
export const getPosts = (token: string) => lumenAPI.get('/posts', { headers: { Authorization: `Bearer ${token}` } });
export const getPostsByID = (id: number, token: string) => lumenAPI.get(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });


export default lumenAPI;
