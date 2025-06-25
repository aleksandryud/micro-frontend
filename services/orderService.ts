import { OrderDTO, OrderItem } from "../dto/order.dto";
import { CartRepository } from "../repositories/cartRepository";
import { OrderRepository } from "../repositories/orderRepository";
import { UserRepository } from "../repositories/userRepository";

export class OrderService {
  private cartRepo: CartRepository;
  private orderRepo: OrderRepository;
  private userRepo: UserRepository;

  constructor() {
    this.cartRepo = new CartRepository();
    this.orderRepo = new OrderRepository();
    this.userRepo = new UserRepository();
  }

  async getOrdersByUser(userId: string) {
    return await this.orderRepo.findOrdersByUserId(userId);
  }

  async placeOrder(
    userId: string
  ): Promise<{ success: boolean; message: string; orderId: string }> {
    const cartItems = await this.cartRepo.findCartItems(userId);

    if (cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot place an order.");
    }

    const customerInfo = await this.userRepo.getUserById(userId);
    if (!customerInfo || !customerInfo.username) {
      throw new Error("Customer information is incomplete or not found.");
    }

    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const formattedCartItems: OrderItem[] = cartItems.map(
      ({ productId, name, price, quantity }) => ({
        productId,
        name,
        price,
        quantity,
      })
    );

    const orderData: OrderDTO = {
      userId,
      customerInfo,
      items: formattedCartItems,
      totalPrice,
    };

    const order = await this.orderRepo.createOrder(orderData);

    await this.cartRepo.clearCart(userId);

    return {
      success: true,
      message: "Order placed successfully",
      orderId: order.insertedId.toString(),
    };
  }
}
