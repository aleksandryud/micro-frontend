import { ObjectId } from "mongodb";
import { getDatabase } from "../lib/mongo";

export class ProductRepository {
  private readonly productCollection = "products";

  async findProductById(productId: ObjectId) {
    const db = await getDatabase("ecommerce");
    return db.collection(this.productCollection).findOne({ _id: productId });
  }

  async findProducts(
    filter: Record<string, unknown>,
    skip: number,
    limit: number
  ) {
    const db = await getDatabase("ecommerce");
    return db
      .collection(this.productCollection)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async countProducts(filter: Record<string, unknown>) {
    const db = await getDatabase("ecommerce");
    return db.collection(this.productCollection).countDocuments(filter);
  }
}
