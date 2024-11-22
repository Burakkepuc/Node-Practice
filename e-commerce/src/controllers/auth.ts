import { NextFunction, Request, Response } from "express";
import { prisma } from '../index';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secret";
import { ErrorCode, HttpException } from "../exceptions/root";
import { loginSchema, signUpSchema } from "../schema/users";


class LoginController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    signUpSchema.parse(req.body)
    const { email, password, name } = req.body;

    let user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (user) {
      next(new HttpException('User already exist!', ErrorCode.USER_ALREADY_EXIST, 400))
    }

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    })
    res.json(user)
  }


  static async login(req: Request, res: Response) {
    loginSchema.parse(req.body)

    const { email, password } = req.body;

    let user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) {
      throw new HttpException('User does not exist!', ErrorCode.USER_NOT_FOUND, 404)
    }
    if (!compareSync(password, user.password)) {
      throw new HttpException('Incorrect password!', ErrorCode.INCORRECT_PASSWORD, 400)
    }

    const token = jwt.sign({
      userId: user.id
    }, JWT_SECRET)


    res.json({ user, token })
  }

  static async me(req: Request, res: Response) {
    res.json(req.user)
  }
}

export default LoginController;