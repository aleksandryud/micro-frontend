import { ObjectId } from "mongodb";
import { getDatabase } from "../lib/mongo";

import { CartItem } from "../dto/cart.dto";

export class CartRepository {
  private readonly cartCollection = "cart";

  async findCartItemByUserAndProduct(userId: string, productId: string) {
    const db = await getDatabase("ecommerce");
    return db.collection<CartItem>(this.cartCollection).findOne({
      userId,
      productId: new ObjectId(productId),
    });
  }

  async incrementQuantity(userId: string, productId: string, quantity: number) {
    const db = await getDatabase("ecommerce");
    return db
      .collection<CartItem>(this.cartCollection)
      .updateOne(
        { userId, productId: new ObjectId(productId) },
        { $inc: { quantity } }
      );
  }

  async deleteCartItemByUserAndProduct(userId: string, productId: string) {
    const db = await getDatabase("ecommerce");
    return db
      .collection<CartItem>(this.cartCollection)
      .deleteOne({ userId, productId: new ObjectId(productId) });
  }

  async addCartItem(cartItem: CartItem) {
    const db = await getDatabase("ecommerce");
    return db.collection<CartItem>(this.cartCollection).insertOne(cartItem);
  }

  async findCartByUserId(userId: string) {
    const db = await getDatabase("ecommerce");
    return db
      .collection<CartItem>(this.cartCollection)
      .find({ userId })
      .toArray();
  }

  async findCartItems(userId: string) {
    const db = await getDatabase("ecommerce");
    return db
      .collection<CartItem>(this.cartCollection)
      .find({ userId })
      .toArray();
  }

  async clearCart(userId: string) {
    const db = await getDatabase("ecommerce");
    return db.collection<CartItem>(this.cartCollection).deleteMany({ userId });
  }
}
