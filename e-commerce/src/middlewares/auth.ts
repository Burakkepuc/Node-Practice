import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "../exceptions/root";
import { JWT_SECRET } from "../secret";
import jwt from 'jsonwebtoken'
import { prisma } from "../index";
import { User } from "@prisma/client";

declare module 'express' {
  interface Request {
    user?: User
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const tokenSplit = req.headers.authorization as any
  // const token = tokenSplit.split(' ')[1]
  const token = tokenSplit;
  console.log(token);
  if (!token) {
    next(new HttpException('Unauthorized', ErrorCode.UNAUTHORIZED, 403))
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findFirst({ where: { id: payload.userId } })

    req.user = user as User;
    console.log(req.user);
    next();
  } catch (error) {

  }

}