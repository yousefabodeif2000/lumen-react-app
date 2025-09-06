import axios from 'axios';

const lumenAPI = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

export const setAuthToken = (token: string) => {
  lumenAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const pingLumen = () => axios.get('http://localhost:8000/ping');
export const getPosts = () => lumenAPI.get('/posts');
export const getPostsByID = (id: number) => lumenAPI.get(`/posts/${id}`);


export default lumenAPI;
