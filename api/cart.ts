import { ObjectId } from "mongodb";
import { getDatabase } from "../lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await getDatabase("ecommerce");

    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const existingCartItem = await db
      .collection("cart")
      .findOne({ productId: product._id });
    if (existingCartItem) {
      await db
        .collection("cart")
        .updateOne({ productId: product._id }, { $inc: { quantity: 1 } });
      return res
        .status(200)
        .json({ success: true, message: "Product quantity updated in cart" });
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      addedAt: new Date(),
    };

    await db.collection("cart").insertOne(cartItem);

    return res
      .status(201)
      .json({ success: true, message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}
