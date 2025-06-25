"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const productRepository_1 = require("../repositories/productRepository");
class ProductService {
    constructor() {
        this.productRepo = new productRepository_1.ProductRepository();
    }
    async getProducts(category, page, limit) {
        const filter = category ? { category } : {};
        const skip = (page - 1) * limit;
        // Получаем данные от репозитория
        const products = await this.productRepo.findProducts(filter, skip, limit);
        const total = await this.productRepo.countProducts(filter);
        return {
            products,
            total,
            page,
            limit,
        };
    }
}
exports.ProductService = ProductService;
