import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await client.connect();
    const db = client.db("ecommerce");
    const productsCollection = db.collection("products");

    const { category, page = 1, limit = 10 } = req.query;

    const filter = category ? { category } : {};

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;

    const products = await productsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const total = await productsCollection.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: products,
      total,
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  } finally {
    await client.close();
  }
}
