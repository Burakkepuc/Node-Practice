import { Request, Response } from "express";
import { prisma } from '../index';
import { ErrorCode, HttpException } from "../exceptions/root";
import { changeQuantitySchema, createCartSchema } from "../schema/cart";
import { Product } from "@prisma/client";


class CartsController {
  static async addItemToCart(req: Request, res: Response) {
    const validatedData = createCartSchema.parse(req.body);
    let product: Product;


    try {
      // Check if product exist.
      product = await prisma.product.findFirstOrThrow({
        where: {
          id: validatedData.productId
        }
      });
      // find it in cartItem(basket)
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          productId: validatedData.productId,
          userId: req.user?.id!
        }
      });

      // If not exist,create one
      if (!cartItem) {
        const newCartItem = await prisma.cartItem.create({
          data: {
            userId: req.user?.id!,
            productId: product.id,
            quantity: validatedData.quantity
          }
        });

        res.json(newCartItem)
        // If exist,update existing
      } else {
        const updateCartItem = await prisma.cartItem.update({
          where: {
            id: cartItem.id
          },
          data: {
            quantity: cartItem.quantity + validatedData.quantity
          }
        })
        res.json(updateCartItem)
      }

    } catch (error) {
      console.log(error);
      throw new HttpException('Product not found!', ErrorCode.PRODUCT_NOT_FOUND, 404)
    }
  }


  static async deleteItemFromCart(req: Request, res: Response) {
    await prisma.cartItem.delete({
      where: {
        id: +req.params?.id
      }
    })
    res.json({ success: true })
  }
  static async changeQuantity(req: Request, res: Response) {
    const validatedData = changeQuantitySchema.parse(req.body);
    const updatedCart = await prisma.cartItem.update({
      where: {
        id: +req.params.id!
      },
      data: {
        quantity: validatedData.quantity
      }
    })
    res.json(updatedCart)

  }
  static async getCart(req: Request, res: Response) {
    const cart = await prisma.cartItem.findMany({
      where: {
        userId: +req.user?.id!
      },
      include: {
        product: true
      }
    })
    const cartWithTotal = cart.map(item => ({
      ...item,
      totalPrice: item.quantity * item.product.price.toNumber()
    }));

    const totalCartPrice = cartWithTotal.reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({ cartTotal: cartWithTotal, totalCartPrice });


  }

}

export default CartsController;