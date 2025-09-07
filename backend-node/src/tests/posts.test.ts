import request from 'supertest';
import app from '../index';
import { randomInt } from 'crypto';

let token: string;

beforeAll(async () => {
    const randomSuffix = randomInt(1000, 9999);
  // Create a test user first (depending on your DB setup)
  await request(app).post('/api/register').send({
    name: 'Tester' + randomSuffix,
    email: 'test' + randomSuffix + '@test.com',
    password: 'secret',
  });

  // Login to get JWT token
  const res = await request(app).post('/api/login').send({
    email: 'test' + randomSuffix + '@test.com',
    password: 'secret',
  });

  token = res.body.token; // store token for use in tests
});

it('should fetch all posts', async () => {
  const res = await request(app)
    .get('/cache/posts')
    .set('Authorization', `Bearer ${token}`) // <-- token here
    .expect(200);

  expect(Array.isArray(res.body)).toBe(true);
});

it('should create a new post', async () => {
  const res = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'New Post', content: 'This is a test post' })
    .expect(201);

  expect(res.body).toHaveProperty('id');
});
