import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestingApp } from './utils';

describe('app', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/');
    expect(response.statusCode).toBe(200);
  });
});
