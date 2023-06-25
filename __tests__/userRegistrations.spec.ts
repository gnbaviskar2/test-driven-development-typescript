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

  const sendUserSignUpReqWithoutEncoding = (
    userSignUpPayload: userSignUpType
  ) => {
    return request(testApp).post('/api/v1/users').send({
      username: userSignUpPayload.username,
      email: userSignUpPayload.email,
      password: userSignUpPayload.password,
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

  it('returns success message when signup request is valid', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    const response = await sendUserSignUpReq(userSignUpPayload);
    const actualBody = response.body as apiResType;
    expect(actualBody.code).toBe(201);
    expect(actualBody.success).toBe(true);
    expect(actualBody).toHaveProperty('message');
    expect(actualBody.message).toBe(userConstants.userSignUpSuccessful);
    expect(actualBody).toHaveProperty('data');
  });

  it('saves the user in database', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    await sendUserSignUpReq(userSignUpPayload);
    const actualUser = await getUserByUsername(userSignUpPayload.username);
    expect(actualUser).toBeDefined();
  });

  it('saves the username and email in database', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    await sendUserSignUpReq(userSignUpPayload);
    const actualUser = await getUserByUsername(userSignUpPayload.username);
    expect(actualUser?.username).toBe(userSignUpPayload.username);
    expect(actualUser?.email).toBe(userSignUpPayload.email);
  });

  it('hashes the password in database', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    await sendUserSignUpReq(userSignUpPayload);
    const actualUser = await getUserByUsername(userSignUpPayload.username);
    expect(actualUser?.password).not.toBe(decode(userSignUpPayload.password));
    expect(actualUser?.password).not.toBe(encode(userSignUpPayload.password));
  });

  it('throws error when password is not encoded', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    userSignUpPayload.password = 'Admin@123';
    const response = await sendUserSignUpReqWithoutEncoding(userSignUpPayload);
    const actualBody = response.body;
    expect(actualBody.name).toBe('InvalidCharacterError');
    expect(actualBody).toHaveProperty('errors');
  });
});
