"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
async function handler(req, res) {
    console.log("Connecting to MongoDB...", process.env.MONGODB_URI);
    try {
        // Подключаемся к базе
        await client.connect();
        // Получаем доступ к базе данных и коллекции
        const db = client.db("ecommerce"); // Имя вашей БД
        const productsCollection = db.collection("products");
        // Пытаемся извлечь данные коллекции "products"
        const products = await productsCollection.find({}).toArray();
        // Возвращаем данные в ответе
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        // Обрабатываем ошибку подключения
        console.error("Error connecting to MongoDB", error);
        res.status(500).json({
            success: false,
            message: "Unable to connect to database",
            error: error.message,
        });
    }
}
