"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const mongodb_1 = require("mongodb");
const cartRepository_1 = require("../repositories/cartRepository");
const productRepository_1 = require("../repositories/productRepository");
class CartService {
    constructor() {
        this.cartRepo = new cartRepository_1.CartRepository();
        this.productRepo = new productRepository_1.ProductRepository();
    }
    async getCart(userId) {
        return await this.cartRepo.findCartByUserId(userId);
    }
    async handleAddToCart(userId, productId) {
        if (!mongodb_1.ObjectId.isValid(productId)) {
            throw new Error("Invalid Product ID");
        }
        const product = await this.productRepo.findProductById(new mongodb_1.ObjectId(productId));
        if (!product) {
            throw new Error("Product not found");
        }
        const existingCartItem = await this.cartRepo.findCartItemByUserAndProduct(userId, productId);
        if (existingCartItem) {
            // Increment quantity for the specific user's cart
            await this.cartRepo.incrementQuantity(userId, productId, 1);
            return { success: true, message: "Product quantity updated in cart" };
        }
        // Add item to the specific user's cart if it doesn't exist
        const cartItem = {
            userId,
            productId: new mongodb_1.ObjectId(productId),
            name: product.name,
            price: product.price,
            quantity: 1,
            addedAt: new Date(),
        };
        await this.cartRepo.addCartItem(cartItem);
        return { success: true, message: "Product added to cart", cartItem };
    }
    async handleDeleteFromCart(userId, productId) {
        if (!mongodb_1.ObjectId.isValid(productId)) {
            throw new Error("Invalid Product ID");
        }
        const existingCartItem = await this.cartRepo.findCartItemByUserAndProduct(userId, productId);
        if (!existingCartItem) {
            throw new Error("Cart item not found");
        }
        await this.cartRepo.deleteCartItemByUserAndProduct(userId, productId);
        return {
            success: true,
            message: `Cart item with ID ${productId} deleted.`,
        };
    }
}
exports.CartService = CartService;
