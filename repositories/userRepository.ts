import { getDatabase } from "../lib/mongo";
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
}

export class UserRepository {
  private readonly collectionName = "users";

  async findByUsername(username: string): Promise<User | null> {
    const db = await getDatabase("ecommerce");
    return db.collection<User>(this.collectionName).findOne({ username });
  }

  async createUser(user: User): Promise<{ insertedId: ObjectId }> {
    const db = await getDatabase("ecommerce");
    return db.collection<User>(this.collectionName).insertOne(user);
  }

  async getUserById(userId: string): Promise<User | null> {
    const db = await getDatabase("ecommerce");
    return db
      .collection<User>(this.collectionName)
      .findOne({ _id: new ObjectId(userId) });
  }
}
