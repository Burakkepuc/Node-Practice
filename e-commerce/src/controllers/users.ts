import { Request, Response } from 'express';
import { AddressSchema, updateUserRoleSchema, updateUserSchema } from '../schema/users';
import { ErrorCode, HttpException } from '../exceptions/root';
import { Address, User } from '@prisma/client';
import { prisma } from '..';

class UsersController {
  static async addAddress(req: Request, res: Response) {
    AddressSchema.parse(req.body)
    let user: User;
    try {
      user = await prisma.user.findFirstOrThrow({
        where: {
          id: req.body.userId
        }
      })
    } catch (error) {
      throw new HttpException('User Not Found', ErrorCode.USER_NOT_FOUND, 404)
    }

    const address = await prisma.address.create({
      data: {
        ...req.body,
        userId: user.id
      }
    })
    res.json(address)
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      await prisma.address.delete({
        where: {
          id: +req.params.id
        }
      })
      res.json({ success: true })
    } catch (error) {
      throw new HttpException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND, 404)

    }
  }

  static async listAddress(req: Request, res: Response) {
    const addresses = await prisma.address.findMany({
      where: {
        userId: req.user?.id as number
      }
    })
    res.json(addresses)
  }

  static async updateUser(req: Request, res: Response) {
    const validateData = updateUserSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validateData.defaultShippingAddress) {
      try {
        shippingAddress = await prisma.address.findFirstOrThrow({
          where: {
            id: validateData.defaultShippingAddress as number
          }
        })

      } catch (error) {
        throw new HttpException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND, 404)

      }
      if (shippingAddress.userId !== req.user?.id) {
        throw new HttpException('Address is not belongs to user', ErrorCode.ADDRESS_NOT_BELONG, 400)
      }
    }

    if (validateData.defaultBillingAddress) {
      try {
        billingAddress = await prisma.address.findFirstOrThrow({
          where: {
            id: validateData.defaultBillingAddress as number
          }
        })

      } catch (error) {
        throw new HttpException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND, 404)
      }
      if (billingAddress.userId !== req.user?.id) {
        throw new HttpException('Address is not belongs to user', ErrorCode.ADDRESS_NOT_BELONG, 400)
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user?.id
      },
      data: validateData,


    });
    res.json(updatedUser);
  }

  static async listUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const take = 5;
    const skip = (page - 1) * take;

    const users = await prisma.user.findMany({
      skip,
      take
    })

    res.json(users)

  }
  static async getUserById(req: Request, res: Response) {
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: +req.params.id
        },
        include: {
          addresses: true
        }
      })
      res.json(user)
    } catch (error) {
      throw new HttpException('User not found', ErrorCode.USER_NOT_FOUND, 404)
    }
  }
  static async changeUserRole(req: Request, res: Response) {
    try {
      updateUserRoleSchema.parse(req.body)
      const user = await prisma.user.update({
        where: {
          id: +req.params.id
        },
        data: {
          role: req.body.role
        }
      })
      res.json(user)
    } catch (error) {
      throw new HttpException('User not found', ErrorCode.USER_NOT_FOUND, 404)
    }
  }


}

export default UsersController;