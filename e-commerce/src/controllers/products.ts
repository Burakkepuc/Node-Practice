import { Request, Response } from "express";
import { prisma } from '../index';
import { ErrorCode, HttpException } from "../exceptions/root";


class ProductsController {
  static async createProduct(req: Request, res: Response) {

    //Create validator for this request
    const product = await prisma.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(',')
      }
    })

    res.json(product)
  }
  static async updateProduct(req: Request, res: Response) {
    try {
      const product = req.body;
      if (product.tags) {
        product.tags = product.tags.join(',')
      }

      const updateProduct = await prisma.product.update({
        where: {
          id: +req.params.id
        },
        data: product
      })
      res.json(updateProduct)

    } catch (error) {
      throw new HttpException('Product not found', ErrorCode.PRODUCT_NOT_FOUND, 404)
    }
  }
  static async deleteProduct(req: Request, res: Response) {
    try {
      const deletedProduct = await prisma.product.delete({
        where: {
          id: +req.params.id
        }
      })
      res.json(deletedProduct)
    } catch (error) {
      throw new HttpException('Product not found', ErrorCode.PRODUCT_NOT_FOUND, 404)
    }
  }
  static async listProducts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const take = 5;
    const skip = (page - 1) * take;
    const count = await prisma.product.count();
    const products = await prisma.product.findMany({
      skip,
      take
    })

    const pageCount = Math.ceil(count / take);
    res.json({ count, data: products, pageCount, currentPage: page })
  }
  static async getProductById(req: Request, res: Response) {
    try {
      const product = await prisma.product.findFirstOrThrow({
        where: {
          id: +req.params.id!
        }
      })
      res.json(product)
    } catch (error) {
      throw new HttpException('Product not found', ErrorCode.PRODUCT_NOT_FOUND, 404)

    }
  }
  static async searchProducts(req: Request, res: Response) { }

}

export default ProductsController;