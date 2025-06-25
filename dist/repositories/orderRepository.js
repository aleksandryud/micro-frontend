"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const mongo_1 = require("../lib/mongo");
class OrderRepository {
    constructor() {
        this.orderCollection = "orders";
    }
    async createOrder(orderData) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.orderCollection).insertOne(orderData);
    }
    async findOrdersByUserId(userId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.orderCollection)
            .find({ userId })
            .toArray();
    }
}
exports.OrderRepository = OrderRepository;
