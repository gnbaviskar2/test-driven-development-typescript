import { userSignUpType } from '../interface';
import prisma from '../database/prisma';
import AppError, {
  HttpCodeEnum,
  ErrorTypes,
} from '../core/handlers/error.handlers';
import userConstants from '../core/constants/user.constants';
import { generateActivationToken } from '../core/helpers/token.helpers';

export const userSignUpRepo = async (userSavePayload: userSignUpType) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: userSavePayload.username,
        email: userSavePayload.email,
        password: userSavePayload.password,
        activationCode: generateActivationToken(16),
        isActive: false,
      },
    });
    return user;
  } catch (e: any) {
    if (e.code === 'P2002') {
      if (e.message.includes('username')) {
        throw new AppError({
          httpCode: HttpCodeEnum.BAD_REQUEST,
          message: userConstants.usernameAlreadyRegistered,
          name: ErrorTypes.BadRequestError,
        });
      } else if (e.message.includes('email')) {
        throw new AppError({
          httpCode: HttpCodeEnum.BAD_REQUEST,
          message: userConstants.emailAlreadyRegistered,
          name: ErrorTypes.BadRequestError,
        });
      }
    }
    throw new AppError({
      httpCode: HttpCodeEnum.INTERNAL_SERVER_ERROR,
      message: 'Could not create user',
      name: ErrorTypes.InternalError,
    });
  }
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

export const getUserByUsername = (username: string) => {
  return prisma.user.findFirst({
    where: {
      username,
    },
  });
};
