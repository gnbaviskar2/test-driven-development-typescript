import request from 'supertest';
import { encode } from 'base-64';

import serverInit from '../src/server_inits';

const testApp = serverInit();

describe('User Registration', () => {
  it('returns 200 OK when signup request is valid', (done) => {
    request(testApp)
      .post('/api/v1/users')
      .send({
        username: 'testUser1',
        email: 'testUser1@mail.com',
        password: encode('AwesomePassword@2123'),
      })
      .then((response) => {
        expect(response.status).toBe(200);
        done();
      });
  });
});
