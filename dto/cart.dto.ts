import { ObjectId } from "mongodb";

export interface CartItem {
  _id?: ObjectId;
  userId: string;
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  addedAt: Date;
}
