import { ObjectId } from "mongodb";

export interface OrderItem {
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDTO {
  userId: string;
  customerInfo: {
    username: string;
  };
  items: OrderItem[];
  totalPrice: number;
}
