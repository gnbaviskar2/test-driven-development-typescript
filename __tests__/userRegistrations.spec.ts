import request from 'supertest';
import { encode, decode } from 'base-64';
import { v4 as uuidv4 } from 'uuid';

import serverInit from '../src/server_inits';
import { apiResType } from '../src/core/handlers/response.handlers';
import userConstants from '../src/core/constants/user.constants';
import { getUserByUsername } from '../src/repos/users.repo';
import { userSignUpType } from '../src/interface';
import { ErrorTypes } from '../src/core/handlers/error.handlers';

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

  it('throws error when username is already registered', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    userSignUpPayload.password = 'Admin@123';
    await sendUserSignUpReq(userSignUpPayload);
    const response = await sendUserSignUpReq(userSignUpPayload);
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.usernameAlreadyRegistered);
    expect(actualBody).toHaveProperty('errors');
  });

  it('throws error when email is already registered', async () => {
    const userSignUpPayload: userSignUpType = generateUserDetails();
    userSignUpPayload.password = 'Admin@123';
    await sendUserSignUpReq(userSignUpPayload);
    userSignUpPayload.username = uuidv4();
    const response = await sendUserSignUpReq(userSignUpPayload);
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.emailAlreadyRegistered);
    expect(actualBody).toHaveProperty('errors');
  });

  it('throws error when email is not provided', async () => {
    // to over write email property undefined marked it as any
    const userSignUpPayload = generateUserDetails() as any;
    userSignUpPayload.email = undefined;
    userSignUpPayload.username = uuidv4();
    const response = await sendUserSignUpReq(userSignUpPayload);
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.emailRequired);
    expect(actualBody).toHaveProperty('errors');
  });

  it('throws error when username is not provided', async () => {
    // to over write email property undefined marked it as any
    const userSignUpPayload = generateUserDetails() as any;
    userSignUpPayload.username = undefined;
    userSignUpPayload.email = uuidv4();
    const response = await sendUserSignUpReq(userSignUpPayload);
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.usernameRequired);
    expect(actualBody).toHaveProperty('errors');
  });

  it('throws error when password is not provided', async () => {
    // to over write email property undefined marked it as any
    const uuid = uuidv4();
    const userSignUpPayload = {
      username: `johndoe${uuid}`,
      email: `johndoe${uuid}@yopmail.com`,
    };
    const response = await request(testApp).post('/api/v1/users').send({
      username: userSignUpPayload.username,
      email: userSignUpPayload.email,
    });
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.passwordRequired);
    expect(actualBody).toHaveProperty('errors');
  });

  it('throws error when password is null', async () => {
    // to over write email property undefined marked it as any
    const uuid = uuidv4();
    const userSignUpPayload = {
      username: `johndoe${uuid}`,
      email: `johndoe${uuid}@yopmail.com`,
      password: null,
    };
    const response = await request(testApp).post('/api/v1/users').send({
      username: userSignUpPayload.username,
      email: userSignUpPayload.email,
    });
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(userConstants.passwordRequired);
    expect(actualBody).toHaveProperty('errors');
  });

  // dynamic test cases
  it.each([
    ['username', '"username" must be a string'],
    ['password', '"password" must be a string'],
    ['email', '"email" must be a string'],
  ])('when %s is null %s is received', async (field, expectedMessage) => {
    const uuid = uuidv4();
    const userPayload: any = {
      username: `johndoe${uuid}`,
      email: `johndoe${uuid}@yopmail.com`,
      password: encode('samplePassword@123%$'),
    };
    if (field === 'username') {
      userPayload.username = null;
    }
    if (field === 'password') {
      userPayload.password = null;
    }
    if (field === 'email') {
      userPayload.email = null;
    }
    const response = await request(testApp).post('/api/v1/users').send({
      username: userPayload.username,
      email: userPayload.email,
      password: userPayload.password,
    });
    const actualBody = response.body;
    expect(actualBody.name).toBe(ErrorTypes.BadRequestError);
    expect(actualBody.message).toBe(expectedMessage);
    expect(actualBody).toHaveProperty('errors');
  });
});
