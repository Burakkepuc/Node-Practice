import { NextFunction, Request, RequestHandler, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { ZodError } from "zod"

export const errorHandler = (method: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next)
    } catch (error) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new HttpException('Unprocessable Entity', ErrorCode.UNPROECSSABLE_ENTITY, 400, error)
        } else {
          exception = new HttpException('Something went wrong!', ErrorCode.INTERNAL_EXCEPTION, 500, error)
        }
      }
      next(exception)
    }
  }
}
