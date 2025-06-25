"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res
            .status(401)
            .json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Invalid token format" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res
            .status(403)
            .json({ success: false, message: "Invalid or expired token" });
    }
}
