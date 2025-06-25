"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const mongo_1 = require("../lib/mongo");
class ProductRepository {
    constructor() {
        this.productCollection = "products";
    }
    async findProductById(productId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.productCollection).findOne({ _id: productId });
    }
    async findProducts(filter, skip, limit) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.productCollection)
            .find(filter)
            .skip(skip)
            .limit(limit)
            .toArray();
    }
    async countProducts(filter) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.productCollection).countDocuments(filter);
    }
}
exports.ProductRepository = ProductRepository;
