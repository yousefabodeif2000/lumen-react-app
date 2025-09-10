import request from 'supertest';
import { app, server } from '../index';
import { randomInt } from 'crypto';
jest.setTimeout(30000);
let token: string;

beforeAll(async () => {
  const randomSuffix = randomInt(1000, 9999);

  const regRes = await request(app).post('/api/register').send({
    name: 'Tester' + randomSuffix,
    email: 'test' + randomSuffix + '@test.com',
    password: 'secret',
  });

  const res = await request(app).post('/api/login').send({
    email: 'test' + randomSuffix + '@test.com',
    password: 'secret',
  });

  token = res.body.token;
});

it('should fetch all posts', async () => {
  const res = await request(app)
    .get('/cache/posts')
    .set('Authorization', `Bearer ${token}`)
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

afterAll(async () => {
  server.close();
});
