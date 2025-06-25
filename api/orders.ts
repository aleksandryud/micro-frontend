import { authenticateToken } from "../middleware/authenticateToken";
import { OrderService } from "../services/orderService";

const orderService = new OrderService();

export default async function handler(req, res) {
  await authenticateToken(req, res, async () => {
    try {
      const userId = req.user.userId;

      if (req.method === "GET") {
        const orders = await orderService.getOrdersByUser(userId); // Fetch orders for the user
        return res.status(200).json({
          success: true,
          message: "Orders fetched successfully",
          orders,
        });
      }

      if (req.method === "POST") {
        const result = await orderService.placeOrder(userId);
        return res.status(200).json(result);
      }

      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} Not Allowed`,
      });
    } catch (error) {
      console.error(`Error in ${req.method} request to /api/orders:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  });
}
