import { Response } from 'express';
import httpCodes from '../constants/http.constant';

export interface apiResType {
  code: number;
  success: boolean;
  message: string;
  data: any;
}

export const apiResponseHandler = (
  res: Response,
  code: number,
  data?: any,
  msg?: string
) => {
  const statusCode = code || httpCodes.OK;
  const resMessage: apiResType = {
    code: code || 200,
    success: true,
    message: msg || '',
    data: data || {},
  };
  res.status(statusCode).json(resMessage);
};
