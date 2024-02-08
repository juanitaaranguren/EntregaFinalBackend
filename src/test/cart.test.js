import CartService from "../services/cart.service.js";

describe("Testeo de carrito", () => {
  it("mostrar carrto por id", async () => {
    const cartId = "some_cart_id";
    const cart = await CartService.getCartById(cartId);
    expect(cart).toBeDefined();
    expect(cart._id).toBe(cartId); 
  });

  it("crear un nuevo carrito", async () => {
    const cartData = { userId: "user_id", products: [], total: 0 };
    const newCart = await CartService.createCart(cartData);
    expect(newCart).toBeDefined();
    expect(newCart.userId).toBe(cartData.userId); 
    expect(newCart.products).toEqual(cartData.products); 
    expect(newCart.total).toBe(cartData.total); 
  });
});
