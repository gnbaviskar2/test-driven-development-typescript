import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import base64 from 'base-64';

import asyncHandler from '../core/handlers/async.handlers';
import { userSignUpType } from '../interface';
import { userSignUpRepo } from '../repos/users.repo';
import { apiResponseHandler } from '../core/handlers/response.handlers';
import httpCodes from '../core/constants/http.constant';
import userConstants from '../core/constants/user.constants';
import { validateUserSignUp } from '../validators/user.validators';
import AppError, {
  HttpCodeEnum,
  ErrorTypes,
} from '../core/handlers/error.handlers';

export const getUserController = (req: Request, res: Response) => {
  res.status(200).json({
    received: 'received',
  });
};

export const saveUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userSignUpPayload = req.body as userSignUpType;

    const isValidInput = validateUserSignUp(userSignUpPayload);
    if (isValidInput.error) {
      throw new AppError({
        httpCode: HttpCodeEnum.BAD_REQUEST,
        message: isValidInput.error.message,
        name: ErrorTypes.BadRequestError,
      });
    }

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
        id: user?.id,
        email: user?.email,
        username: user?.username,
        createdAt: user?.createdAt,
        isActive: user?.isActive,
      },
      userConstants.userSignUpSuccessful
    );
  }
);
