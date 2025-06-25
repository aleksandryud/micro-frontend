import { UserService } from "../services/userService";

const userService = new UserService();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} Not Allowed`,
      });
      return;
    }

    const { username, password } = req.body;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        success: false,
        message: "Server misconfiguration: JWT_SECRET is missing",
      });
      return;
    }

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
      return;
    }

    if (username.length < 3 || username.length > 30) {
      res.status(400).json({
        success: false,
        message: "Username must be between 3 and 30 characters long",
      });
      return;
    }

    const result = await userService.signup(username, password);

    res.status(201).json({
      success: true,
      message: "User successfully registered",
      userId: result.userId,
      token: result.token,
    });
  } catch (error) {
    console.error("Error in signup handler:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
