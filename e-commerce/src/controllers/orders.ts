import { Request, Response } from "express";
import { prisma } from '../index';
import { ErrorCode, HttpException } from "../exceptions/root";
import { changeQuantitySchema, createCartSchema } from "../schema/cart";
import { Product } from "@prisma/client";


class OrdersController {
  static async createOrder(req: Request, res: Response) {
    return await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: {
          userId: req.user?.id
        },
        include: {
          product: true
        }
      });

      if (cartItems.length === 0) {
        res.json({ message: "Cart is empty" })
      }

      const price = cartItems.reduce((acc, item) => {
        return acc + (item.quantity * +item.product.price)
      }, 0)
      const address = await tx.address.findFirst({
        where: {
          id: +req.user?.defaultShippingAddress!
        }
      })

      const order = await tx.order.create({
        data: {
          userId: +req.user?.id!,
          netAmount: price,
          address: address?.formattedAddress!,
          products: {
            create: cartItems.map(cart => {
              return {
                productId: cart.productId,
                quantity: cart.quantity,
              }
            })
          }
        }
      })


      const orderEvent = await tx.orderEvent.create({
        data: {
          orderId: order.id
        }
      })
      await tx.cartItem.deleteMany({
        where: {
          userId: +req.user?.id!
        }
      })
      res.json(order)
    })
  }
  static async listOrders(req: Request, res: Response) {
    const orders = await prisma.order.findMany({
      where: {
        userId: +req.user?.id!
      }
    })
    res.json(orders)
  }
  static async cancelOrder(req: Request, res: Response) {
    try {
      return await prisma.$transaction(async (tx) => {

        const order = await tx.order.update({
          where: {
            userId: +req.user?.id!,
            id: +req.params.id
          },
          data: {
            status: 'CANCELED'
          }
        })

        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            status: 'CANCELED'
          }
        })

        res.json(order)
      })
    } catch (error) {
      throw new HttpException('Order not found', ErrorCode.ORDER_NOT_FOUND, 404)
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const order = await prisma.order.findFirstOrThrow({
        where: {
          id: +req.params.id
        },
        include: {
          products: {
            include: {
              product: true
            }
          },
          events: true
        }
      })

      res.json(order)
    } catch (error) {
      throw new HttpException('Order not found', ErrorCode.ORDER_NOT_FOUND, 404)
    }
  }

  static async listAllOrders(req: Request, res: Response) {
    let whereClause = {}
    const { status } = req.query
    if (status) {
      whereClause = {
        status
      }
    }

    const page = parseInt(req.query.page as string) || 1
    const take = 5
    const skip = (page - 1) * take;

    const orders = await prisma.order.findMany({
      where: whereClause,
      skip,
      take,
    })

    res.json(orders)
  }

  static async changeStatus(req: Request, res: Response) {
    return prisma.$transaction(async (tx) => {

      try {
        const order = await tx.order.update({
          where: {
            id: +req.params.id
          },
          data: {
            status: req.body.status
          }
        })
        await tx.orderEvent.create({
          data: {
            orderId: order.id,
            status: req.body.status
          }
        })
        res.json(order)
      } catch (error) {
        throw new HttpException('Order not found', ErrorCode.ORDER_NOT_FOUND, 404)
      }
    })
  }
  static async listUserOrders(req: Request, res: Response) {
    let whereClause: any = {
      userId: +req.params.id
    }
    const status = req.params.status
    if (status) {
      whereClause = {
        ...whereClause,
        status
      }
    }

    const page = parseInt(req.query.page as string) || 1
    const take = 5
    const skip = (page - 1) * take;

    const orders = await prisma.order.findMany({
      where: whereClause,
      skip,
      take,
    })

    res.json(orders)
  }
}

export default OrdersController;

