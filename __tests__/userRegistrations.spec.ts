import request from 'supertest';
import { encode } from 'base-64';

import serverInit from '../src/server_inits';
import { apiResType } from '../src/core/handlers/response.handlers';
import userConstants from '../src/core/constants/user.constants';

import { getUserByUsername } from '../src/repos/users.repo';

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
        expect(response.status).toBe(201);
        done();
      });
  });

  it('returns success message when signup request is valid', (done) => {
    request(testApp)
      .post('/api/v1/users')
      .send({
        username: 'testUser1',
        email: 'testUser1@mail.com',
        password: encode('AwesomePassword@2123'),
      })
      .then((response) => {
        const responseBody = response.body as apiResType;
        expect(responseBody.code).toBe(201);
        expect(responseBody.success).toBe(true);
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe(userConstants.userSignUpSuccessful);
        expect(responseBody).toHaveProperty('data');
        done();
      });
  });

  it('saves the user in database', (done) => {
    request(testApp)
      .post('/api/v1/users')
      .send({
        username: 'testUser1',
        email: 'testUser1@mail.com',
        password: encode('AwesomePassword@2123'),
      })
      .then(async (response) => {
        const user = await getUserByUsername('testUser1');
        expect(user).toBeDefined();
        expect(user?.username).toBe('testUser1');
        expect(user?.email).toBe('testUser1@mail.com');
        done();
      });
  });
});
