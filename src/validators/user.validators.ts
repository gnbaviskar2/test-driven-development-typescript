import joi from 'joi';
import { userSignUpType } from '../interface';
import userConstants from '../core/constants/user.constants';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_])[A-Za-z\!@#$%^&*()-_]{8,}$/;

// eslint-disable-next-line import/prefer-default-export
export const validateUserSignUp = (userSignUpPayload: userSignUpType) => {
  const userSchema = joi.object({
    username: joi.string().required().messages({
      'any.required': userConstants.usernameRequired,
    }),
    password: joi
      .string()
      .required()
      .min(8)
      .max(50)
      .pattern(new RegExp(passwordRegex))
      .messages({
        'string.min': 'min',
        'string.max': 'max',
        'string.pattern.base': userConstants.inValidPassword,
        'any.required': userConstants.passwordRequired,
      }),
    email: joi
      .string()
      .required()
      .lowercase()
      .pattern(new RegExp(emailRegex))
      .messages({
        'string.pattern.base': userConstants.inValidEmail,
        'any.required': userConstants.emailRequired,
      }),
  });

  return userSchema.validate(userSignUpPayload);
};
