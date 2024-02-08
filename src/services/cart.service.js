import { CartDAO } from "../daos/cart.daos.js";

class CartService {
  constructor() {}

  async retrieveCart(cartId) {
    try {
      return await CartDAO.getById(cartId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async createNewCart(cartData) {
    try {
      return await CartDAO.create(cartData);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async addProductToCart(cartId, productData) {
    try {
      const { products, total } = await this.retrieveCart(cartId);
      const existingProduct = products.find((item) => item._id.equals(productData._id));
      const newTotal = total + productData.price;

      if (!existingProduct) {
        productData.quantity = 1;
      } else {
        productData.quantity = existingProduct.quantity + 1;
      }

      return await CartDAO.addProductToCart(cartId, productData, newTotal);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async removeCart(cartId) {
    try {
      return await CartDAO.deleteCartById(cartId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      return await CartDAO.deleteProductByCartId(cartId, productId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async removeAllProducts(productId) {
    try {
      return await CartDAO.deleteProductOfAllCartsById(productId);
    } catch (error) {
      throw new Error(error?.message);
    }
  }
}

export default new CartService();
