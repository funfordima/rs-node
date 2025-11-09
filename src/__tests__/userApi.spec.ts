import request from 'supertest';

import server from '../index.js';

describe('User Api', () => {
  let userId: string;

  afterAll((done) => {
    server.close(done);
  });

  it('server should be defined', () => {
    expect(server).toBeDefined();
  });

  it('GET /api/users - should return an array with 2 items initially', async () => {
    const response = await request(server).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('POST /api/users - should create a new user', async () => {
    const newUser = { username: 'John', age: 30, hobbies: ['jogging'] };
    const response = await request(server).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('GET /api/users/:userId - should get the created user by ID', async () => {
    const response = await request(server).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      username: 'John',
      age: 30,
      hobbies: ['jogging']
    });
  });

  it('PUT /api/users/:userId - should update the user details', async () => {
    const updatedUser = { username: 'Jake', age: 31, hobbies: ['box'] };
    const response = await request(server).put(`/api/users/${userId}`).send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: userId,
      username: 'Jake',
      age: 31,
      hobbies: ['box']
    });
  });

  it('DELETE /api/users/:userId - should delete the user', async () => {
    const response = await request(server).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual("");
  });
});
