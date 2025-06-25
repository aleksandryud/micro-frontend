import { ObjectId } from "mongodb";
import { CartRepository } from "../repositories/cartRepository";
import { ProductRepository } from "../repositories/productRepository";

export class CartService {
  private cartRepo: CartRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }

  async getCart(userId: string) {
    return await this.cartRepo.findCartByUserId(userId);
  }

  async handleAddToCart(userId: string, productId: string) {
    if (!ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const product = await this.productRepo.findProductById(
      new ObjectId(productId)
    );
    if (!product) {
      throw new Error("Product not found");
    }

    const existingCartItem = await this.cartRepo.findCartItemByUserAndProduct(
      userId,
      productId
    );

    if (existingCartItem) {
      // Increment quantity for the specific user's cart
      await this.cartRepo.incrementQuantity(userId, productId, 1);
      return { success: true, message: "Product quantity updated in cart" };
    }

    // Add item to the specific user's cart if it doesn't exist
    const cartItem = {
      userId,
      productId: new ObjectId(productId),
      name: product.name,
      price: product.price,
      quantity: 1,
      addedAt: new Date(),
    };

    await this.cartRepo.addCartItem(cartItem);
    return { success: true, message: "Product added to cart", cartItem };
  }

  async handleDeleteFromCart(userId: string, productId: string) {
    if (!ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const existingCartItem = await this.cartRepo.findCartItemByUserAndProduct(
      userId,
      productId
    );

    if (!existingCartItem) {
      throw new Error("Cart item not found");
    }

    await this.cartRepo.deleteCartItemByUserAndProduct(userId, productId);
    return {
      success: true,
      message: `Cart item with ID ${productId} deleted.`,
    };
  }
}
