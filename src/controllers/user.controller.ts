import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import base64 from 'base-64';

import asyncHandler from '../core/handlers/async.handlers';
import { userSaveType } from '../interface';
import { userSignUpRepo } from '../repos/users.repo';
import { apiResponseHandler } from '../core/handlers/response.handlers';
import httpCodes from '../core/constants/http.constant';
import userConstants from '../core/constants/user.constants';

export const getUserController = (req: Request, res: Response) => {
  res.status(200).json({
    received: 'received',
  });
};

export const saveUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userSignUpPayload = req.body as userSaveType;

    // decode password
    userSignUpPayload.password = base64.decode(userSignUpPayload.password);

    // hash password
    userSignUpPayload.password = await bcrypt.hash(
      userSignUpPayload.password,
      10
    );

    const user = await userSignUpRepo(userSignUpPayload);
    return apiResponseHandler(
      res,
      httpCodes.CREATED,
      {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      userConstants.userSignUpSuccessful
    );
  }
);
