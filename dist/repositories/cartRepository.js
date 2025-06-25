"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartRepository = void 0;
const mongodb_1 = require("mongodb");
const mongo_1 = require("../lib/mongo");
class CartRepository {
    constructor() {
        this.cartCollection = "cart";
    }
    async findCartItemByUserAndProduct(userId, productId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.cartCollection).findOne({
            userId,
            productId: new mongodb_1.ObjectId(productId),
        });
    }
    async incrementQuantity(userId, productId, quantity) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.cartCollection)
            .updateOne({ userId, productId: new mongodb_1.ObjectId(productId) }, { $inc: { quantity } });
    }
    async deleteCartItemByUserAndProduct(userId, productId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.cartCollection)
            .deleteOne({ userId, productId: new mongodb_1.ObjectId(productId) });
    }
    async addCartItem(cartItem) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.cartCollection).insertOne(cartItem);
    }
    async findCartByUserId(userId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.cartCollection)
            .find({ userId })
            .toArray();
    }
    async findCartItems(userId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.cartCollection)
            .find({ userId })
            .toArray();
    }
    async clearCart(userId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.cartCollection).deleteMany({ userId });
    }
}
exports.CartRepository = CartRepository;
