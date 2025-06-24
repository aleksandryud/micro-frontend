"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const mongo_1 = require("../lib/mongo");
async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res
            .status(405)
            .json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
    try {
        const db = await (0, mongo_1.getDatabase)("ecommerce"); // Use centralized database connection
        const productsCollection = db.collection("products");
        const { category, page = 1, limit = 10 } = req.query;
        const filter = category ? { category } : {};
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;
        const products = await productsCollection
            .find(filter)
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const total = await productsCollection.countDocuments(filter);
        return res.status(200).json({
            success: true,
            data: products,
            total,
            page: pageNumber,
            limit: pageSize,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
}
