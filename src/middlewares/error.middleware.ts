import { Request, Response, NextFunction } from 'express';

const errorFormatter = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error) {
    // // format the error
    res.status(error.httpCode || 500).json({
      name: error.name,
      success: false,
      code: error.httpCode,
      message: error.description || 'Something is wrong',
      isOperational: error.isOperational,
      errors: [
        {
          error: error.message,
          stack: error.stack,
        },
      ],
    });
  }
  next();
};

export default errorFormatter;
