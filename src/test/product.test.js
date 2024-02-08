import ProductService from "../services/product.service.js";

describe("Testeo de producto", () => {
  it("mostrar producto por id", async () => {
    const productId = "some_product_id";
    const product = await ProductService.getProductById(productId);
    expect(product).toBeDefined();
    expect(product._id).toBe(productId);
  });

  it("crear un nuevo producto", async () => {
    const productData = { name: "Test Product", price: 10 };
    const newProduct = await ProductService.createProduct(productData);
    expect(newProduct).toBeDefined();
    expect(newProduct.name).toBe(productData.name);
    expect(newProduct.price).toBe(productData.price); 
  });


});
