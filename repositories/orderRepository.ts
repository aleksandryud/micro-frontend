import { getDatabase } from "../lib/mongo";
import { OrderDTO } from "../dto/order.dto";

export class OrderRepository {
  private readonly orderCollection = "orders";

  async createOrder(orderData: OrderDTO) {
    const db = await getDatabase("ecommerce");
    return db.collection<OrderDTO>(this.orderCollection).insertOne(orderData);
  }

  async findOrdersByUserId(userId: string) {
    const db = await getDatabase("ecommerce");
    return db
      .collection<OrderDTO>(this.orderCollection)
      .find({ userId })
      .toArray();
  }
}
