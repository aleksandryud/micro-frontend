"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoClient = getMongoClient;
exports.getDatabase = getDatabase;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI; // MongoDB connection string from environment variables
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
}
let client;
let clientPromise;
// Check if the global object is available (used for hot-reloading in development)
const globalForMongo = global;
if (process.env.NODE_ENV === "development") {
    // Use a shared client in development to avoid creating a new connection on every API call
    if (!globalForMongo.mongo) {
        client = new mongodb_1.MongoClient(uri);
        globalForMongo.mongo = { clientPromise: client.connect() };
    }
    clientPromise = globalForMongo.mongo.clientPromise;
}
else {
    // In production, always create a new client
    client = new mongodb_1.MongoClient(uri);
    clientPromise = client.connect();
}
/**
 * Utility to get the database connection
 * @returns The connected MongoDB client promise
 */
async function getMongoClient() {
    return clientPromise;
}
/**
 * Utility to get a specific database
 * @param dbName - Name of the database to connect to
 * @returns The connected MongoDB database
 */
async function getDatabase(dbName) {
    const client = await getMongoClient();
    return client.db(dbName);
}
