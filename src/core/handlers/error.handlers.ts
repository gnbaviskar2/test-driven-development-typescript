// eslint-disable-next-line no-shadow
export const enum HttpCodeEnum {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// eslint-disable-next-line no-shadow
export const enum ErrorTypes {
  AuthFailureError = 'AuthFailureError',
  InternalError = 'InternalError',
  BadRequestError = 'BadRequestError',
  NotFoundError = 'NotFoundError',
  ForbiddenError = 'ForbiddenError',
  NoEntryError = 'NoEntryError',
  BadTokenError = 'BadTokenError',
  TokenExpiredError = 'TokenExpiredError',
  NoDataError = 'NoDataError',
  AccessTokenError = 'AccessTokenError',
}

interface AppErrorArgs {
  name?: string;
  httpCode: HttpCodeEnum;
  message: string;
  isOperational?: boolean;
}

export default class AppError extends Error {
  public readonly name: string;

  public readonly httpCode: HttpCodeEnum;

  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name ? args.name : 'Failed';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
