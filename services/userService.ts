import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/userRepository";

const SALT_ROUNDS = 10;

export interface SignupResult {
  userId: string;
  token: string;
}

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async signup(username: string, password: string): Promise<SignupResult> {
    const existingUser = await this.userRepo.findByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await this.userRepo.createUser({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser.insertedId.toString() },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return {
      userId: newUser.insertedId.toString(),
      token,
    };
  }

  async signin(username: string, password: string) {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return {
      token,
    };
  }
}
