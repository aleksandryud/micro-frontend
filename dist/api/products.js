"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const productService_1 = require("../services/productService");
const productService = new productService_1.ProductService();
async function handler(req, res) {
    try {
        if (req.method !== "GET") {
            res.setHeader("Allow", ["GET"]);
            return res
                .status(405)
                .json({ success: false, message: `Method ${req.method} Not Allowed` });
        }
        const { category, page = "1", limit = "10" } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        if (isNaN(pageNumber) || isNaN(pageSize)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters",
            });
        }
        const result = await productService.getProducts(category, pageNumber, pageSize);
        return res.status(200).json({
            success: true,
            data: result.products,
            total: result.total,
            page: result.page,
            limit: result.limit,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server Error", error: error.message });
    }
}
