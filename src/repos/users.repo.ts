import { userSignUpType } from '../interface';
import prisma from '../database/prisma';

export const userSignUpRepo = (userSavePayload: userSignUpType) => {
  return prisma.user.create({
    data: {
      username: userSavePayload.username,
      email: userSavePayload.email,
      password: userSavePayload.password,
    },
  });
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
