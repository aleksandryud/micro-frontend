"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const SALT_ROUNDS = 10;
class UserService {
    constructor() {
        this.userRepo = new userRepository_1.UserRepository();
    }
    async signup(username, password) {
        const existingUser = await this.userRepo.findByUsername(username);
        if (existingUser) {
            throw new Error("Username already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const newUser = await this.userRepo.createUser({
            username,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.insertedId.toString() }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return {
            userId: newUser.insertedId.toString(),
            token,
        };
    }
    async signin(username, password) {
        const user = await this.userRepo.findByUsername(username);
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return {
            token,
        };
    }
}
exports.UserService = UserService;
