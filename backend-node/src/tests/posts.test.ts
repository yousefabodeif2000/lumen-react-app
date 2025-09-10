// src/tests/nodeApi.test.ts
import request from 'supertest';
import { app, server } from '../index';
import { randomInt } from 'crypto';

// Mock the services and cacheLayer
jest.mock('../services/lumenAPI', () => ({
  createPost: jest.fn(async (payload, token) => ({
    id: Date.now(),
    ...payload,
    user: { name: 'Tester' },
    created_at: new Date().toISOString(),
  })),
  deletePost: jest.fn(async (id, token) => ({ success: true, id })),
  login: jest.fn(async ({ email }) => ({ data: { token: 'mock-token', user: { name: 'Tester', email } } })),
  register: jest.fn(async ({ name, email }) => ({ data: { id: Date.now(), name, email } })),
  getPosts: jest.fn(async (token) => ({
    data: [
      { id: 1, title: 'Post 1', content: 'Hello', user: { name: 'Tester' }, created_at: new Date().toISOString() },
    ],
  })),
  getPostsByID: jest.fn(async (id, token) => ({
    id,
    title: `Post ${id}`,
    content: 'Sample content',
    user: { name: 'Tester' },
    created_at: new Date().toISOString(),
  })),
  pingLumen: jest.fn(async () => ({ data: { message: 'pong from Lumen' } })),
}));

jest.mock('../cacheLayer', () => ({
  getCached: jest.fn(async (key, apiCall) => apiCall()),
  setCached: jest.fn(async (key, data) => data),
}));

jest.setTimeout(20000);

let token: string;

beforeAll(async () => {
  const randomSuffix = randomInt(1000, 9999);

  // Register
  await request(app)
    .post('/api/register')
    .send({
      name: 'Tester' + randomSuffix,
      email: 'test' + randomSuffix + '@test.com',
      password: 'secret',
    })
    .expect(201);

  // Login
  const res = await request(app)
    .post('/api/login')
    .send({
      email: 'test' + randomSuffix + '@test.com',
      password: 'secret',
    })
    .expect(200);

  token = res.body.token;
});

describe('API Routes', () => {
  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Post', content: 'Hello World' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Post');
  });

  it('should delete a post', async () => {
    const postId = 123;
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({ success: true, id: postId });
  });
});

describe('Cache Routes', () => {
  it('should fetch all posts', async () => {
    const res = await request(app)
      .get('/cache/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  it('should fetch a single post by ID', async () => {
    const res = await request(app)
      .get('/cache/posts/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'Post 1');
  });

  it('should ping Lumen', async () => {
    const res = await request(app)
      .get('/cache/ping-lumen')
      .expect(200);

    expect(res.body).toEqual({ message: 'pong from Lumen' });
  });
});

afterAll(async () => {
  server.close();
});
