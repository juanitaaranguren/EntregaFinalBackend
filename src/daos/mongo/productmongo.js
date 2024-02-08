import ProductModel from "./models/productModel.js";

export default class Product {
  async getProducts(limit) {
    if (limit) {
      const products = await ProductModel.find().limit(limit);
      return products;
    } else {
      return ProductModel.find();
    }
  }

  async addProduct(data) {
    return ProductModel.create(data);
  }

  async getProductById(id) {
    return ProductModel.findById(id);
  }

  async updateProductById(id, updatedProduct) {
    const update = { $set: updatedProduct };
    return ProductModel.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteProduct(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}
