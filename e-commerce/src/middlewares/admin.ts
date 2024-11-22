import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "../exceptions/root";
import { User } from "@prisma/client";

declare module 'express' {
  interface Request {
    user?: User
  }
}

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (user.role === 'ADMIN') {
    next()
  } else {
    next(new HttpException('Unauthorized', ErrorCode.UNAUTHORIZED, 403))
  }

}

export default adminMiddleware