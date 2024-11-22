import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/root';
import { ErrorCode } from '../exceptions/root';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new HttpException(
    `Route ${req.originalUrl} not found`,
    ErrorCode.INTERNAL_EXCEPTION,
    404,
    null
  );

  res.status(error.statusCode).json({
    message: error.message,
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    errors: error.errors
  })
};

