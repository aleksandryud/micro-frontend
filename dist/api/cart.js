"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const authenticateToken_1 = require("../middleware/authenticateToken");
const cartService_1 = require("../services/cartService");
const cartService = new cartService_1.CartService();
async function handler(req, res) {
    await (0, authenticateToken_1.authenticateToken)(req, res, async () => {
        try {
            const userId = req.user.userId;
            if (req.method === "GET") {
                const cart = await cartService.getCart(userId); // Fetch the user's cart
                return res.status(200).json({
                    success: true,
                    message: "Cart fetched successfully",
                    cart,
                });
            }
            if (req.method === "POST") {
                const { productId } = req.body;
                if (!productId) {
                    return res.status(400).json({
                        success: false,
                        message: "Product ID is required",
                    });
                }
                // Add to cart logic tied to userId
                const result = await cartService.handleAddToCart(userId, productId);
                return res.status(200).json(result);
            }
            if (req.method === "DELETE") {
                const { productId } = req.body;
                if (!productId) {
                    return res.status(400).json({
                        success: false,
                        message: "Product ID is required",
                    });
                }
                // Delete from cart logic tied to userId
                const result = await cartService.handleDeleteFromCart(userId, productId);
                return res.status(200).json(result);
            }
            res.setHeader("Allow", ["POST", "DELETE"]);
            return res.status(405).json({
                success: false,
                message: `Method ${req.method} Not Allowed`,
            });
        }
        catch (error) {
            console.error(`Error in ${req.method} request to /api/cart:`, error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    });
}
