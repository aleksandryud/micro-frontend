"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            res.setHeader("Allow", ["POST"]);
            return res.status(405).json({
                success: false,
                message: `Method ${req.method} Not Allowed`,
            });
        }
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                success: false,
                message: "Server misconfiguration: JWT_SECRET is missing",
            });
            return;
        }
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
            return;
        }
        const result = await userService.signin(username, password);
        res.status(200).json({
            success: true,
            message: "User successfully signed in",
            token: result.token,
        });
    }
    catch (error) {
        console.error("Error in signin handler:", error);
        res.status(401).json({
            success: false,
            message: error.message || "Invalid username or password",
        });
    }
}
