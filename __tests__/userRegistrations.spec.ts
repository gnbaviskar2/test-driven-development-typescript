import request from 'supertest';
import { encode, decode } from 'base-64';
import { v4 as uuidv4 } from 'uuid';

import serverInit from '../src/server_inits';
import { apiResType } from '../src/core/handlers/response.handlers';
import userConstants from '../src/core/constants/user.constants';
import { getUserByUsername } from '../src/repos/users.repo';
import { userSignUpType } from '../src/interface';

const testApp = serverInit();

describe('User Registration', () => {
  const sendUserSignUpReq = (userSignUpPayload: userSignUpType) => {
    return request(testApp)
      .post('/api/v1/users')
      .send({
        username: userSignUpPayload.username,
        email: userSignUpPayload.email,
        password: encode(userSignUpPayload.password),
      });
  };

  const generateUserDetails = () => {
    const uuid = uuidv4();
    return {
      username: `johndoe${uuid}`,
      email: `johndoe${uuid}@yopmail.com`,
      password: encode('samplePassword@123%$'),
    } as userSignUpType;
  };

  it('returns 201 CREATED when signup request is valid', (done) => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    sendUserSignUpReq(userSignUpPayload).then((response) => {
      expect(response.status).toBe(201);
      done();
    });
  });

  it('returns success message when signup request is valid', (done) => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    sendUserSignUpReq(userSignUpPayload).then((response) => {
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
    const userSignUpPayload: userSignUpType = generateUserDetails();
    sendUserSignUpReq(userSignUpPayload).then(async (_response) => {
      const user = await getUserByUsername(userSignUpPayload.username);
      expect(user).toBeDefined();
      done();
    });
  });

  it('saves the username and email in database', (done) => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    sendUserSignUpReq(userSignUpPayload).then(async (_response) => {
      const user = await getUserByUsername(userSignUpPayload.username);
      expect(user?.username).toBe(userSignUpPayload.username);
      expect(user?.email).toBe(userSignUpPayload.email);
      done();
    });
  });

  it('hashes the password in database', (done) => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    sendUserSignUpReq(userSignUpPayload).then(async (response) => {
      const user = await getUserByUsername(userSignUpPayload.username);
      expect(user?.password).not.toBe(decode(userSignUpPayload.password));
      expect(user?.password).not.toBe(encode(userSignUpPayload.password));
      done();
    });
  });
});
