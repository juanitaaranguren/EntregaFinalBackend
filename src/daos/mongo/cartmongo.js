import CartModel from "./models/cartModel.js";
import ProductModel from "./models/productModel.js";

export default class Cart {
  async createCart() {
    const cart = await CartModel.create({ products: [] });
    return cart.save();
  }

  async getCarts(limit) {
    const carts = await CartModel.find().lean().limit(limit).exec();
    return carts;
  }

  async getCartById(id) {
    return CartModel.findOne({ _id: id });
  }

  async deleteCartById(id) {
    return CartModel.findByIdAndDelete(id);
  }

  async addProductCart(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new Error("producto no existe");
    }

    if (!cart) {
      const newCart = new CartModel({ products: [{ productId, quantity }] });
      await newCart.save();
      return newCart;
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async deleteProductCart(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      const productToRemove = cart.products[existingProductIndex];

      if (productToRemove.quantity > 1) {
        productToRemove.quantity -= 1;
      } else {
        cart.products.splice(existingProductIndex, 1);
      }
      await cart.save();
    } else {
      throw new Error("El producto no está rn carrito");
    }
    return cart;
  }

  async finishPurchase(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productsToRemove = [];
    const productosComprados = [];

    for (const cartProduct of cart.products) {
      const productInCart = await ProductModel.findById(cartProduct.productId);

      if (!productInCart) {
        throw new Error(`Producto no encontrado`);
      }

      if (productInCart.stock >= cartProduct.quantity) {
        productInCart.stock -= cartProduct.quantity;
        await productInCart.save();
        productosComprados.push(cartProduct);
      } else {
        productsToRemove.push(cartProduct.productId);
      }
    }

    const total = productosComprados.reduce((accumulator, product) => {
      const subtotal = product.price * product.quantity;
      return accumulator + subtotal;
    }, 0);

    cart.products = cart.products.filter((cartProduct) =>
      productsToRemove.includes(cartProduct.productId)
    );

    await cart.save();

    return {
      sinStock: productsToRemove,
      buyProducts: productosComprados,
      amountTotalBuy: total,
    };
  }
}
