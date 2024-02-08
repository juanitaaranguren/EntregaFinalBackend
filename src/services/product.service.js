import { ProductDAO } from "../daos/product.daos.js";

class ProductService {
  constructor() {}

  async getAllProducts() {
    try {
      return await ProductDAO.getAll();
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async getProductById(productId) {
    try {
      return await ProductDAO.getById(productId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async createProduct(productData) {
    try {
      return await ProductDAO.create(productData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async updateProductById(productId, newData) {
    try {
      return await ProductDAO.updateById(productId, newData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async deleteProductById(productId) {
    try {
      return await ProductDAO.deleteById(productId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

export default new ProductService();
