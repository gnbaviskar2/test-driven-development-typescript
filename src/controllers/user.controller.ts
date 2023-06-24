import { Request, Response } from 'express';

import asyncHandler from '../core/handlers/async.handler';

export const getUserController = (req: Request, res: Response) => {
  res.status(200).json({
    received: 'received',
  });
};

export const saveUserController = asyncHandler(
  async (_req: Request, res: Response) => {
    res.status(200).json({
      received: 'received',
    });
  }
);
