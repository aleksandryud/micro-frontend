import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI; // MongoDB connection string from environment variables
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Check if the global object is available (used for hot-reloading in development)
const globalForMongo = global as unknown as {
  mongo: { clientPromise: Promise<MongoClient> };
};

if (process.env.NODE_ENV === "development") {
  // Use a shared client in development to avoid creating a new connection on every API call
  if (!globalForMongo.mongo) {
    client = new MongoClient(uri);
    globalForMongo.mongo = { clientPromise: client.connect() };
  }
  clientPromise = globalForMongo.mongo.clientPromise;
} else {
  // In production, always create a new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Utility to get the database connection
 * @returns The connected MongoDB client promise
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Utility to get a specific database
 * @param dbName - Name of the database to connect to
 * @returns The connected MongoDB database
 */
export async function getDatabase(dbName: string): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
