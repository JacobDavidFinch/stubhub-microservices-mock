import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password
    })
    .expect(200);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
