"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mongo_1 = require("../lib/mongo");
const mongodb_1 = require("mongodb");
class UserRepository {
    constructor() {
        this.collectionName = "users";
    }
    async findByUsername(username) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.collectionName).findOne({ username });
    }
    async createUser(user) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db.collection(this.collectionName).insertOne(user);
    }
    async getUserById(userId) {
        const db = await (0, mongo_1.getDatabase)("ecommerce");
        return db
            .collection(this.collectionName)
            .findOne({ _id: new mongodb_1.ObjectId(userId) });
    }
}
exports.UserRepository = UserRepository;
