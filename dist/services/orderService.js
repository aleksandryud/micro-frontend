"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const cartRepository_1 = require("../repositories/cartRepository");
const orderRepository_1 = require("../repositories/orderRepository");
const userRepository_1 = require("../repositories/userRepository");
class OrderService {
    constructor() {
        this.cartRepo = new cartRepository_1.CartRepository();
        this.orderRepo = new orderRepository_1.OrderRepository();
        this.userRepo = new userRepository_1.UserRepository();
    }
    async getOrdersByUser(userId) {
        return await this.orderRepo.findOrdersByUserId(userId);
    }
    async placeOrder(userId) {
        const cartItems = await this.cartRepo.findCartItems(userId);
        if (cartItems.length === 0) {
            throw new Error("Cart is empty. Cannot place an order.");
        }
        const customerInfo = await this.userRepo.getUserById(userId);
        if (!customerInfo || !customerInfo.username) {
            throw new Error("Customer information is incomplete or not found.");
        }
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const formattedCartItems = cartItems.map(({ productId, name, price, quantity }) => ({
            productId,
            name,
            price,
            quantity,
        }));
        const orderData = {
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
exports.OrderService = OrderService;
