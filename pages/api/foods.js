
// pages/api/foods.js
import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session";
import dbConnect from "../../db/connection";
import Food from "../../db/models/foods";

async function handler(req, res) {
  await dbConnect();

  const user = req.session.user;

  // Require login for all operations
  if (!user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  if (req.method === "GET") {
    const { barcode, name } = req.query;
    let query = { userId: user.id || user._id }; // Only fetch foods for this user

    if (barcode) query.code = barcode;
    if (name) query.product_name = { $regex: name, $options: "i" };

    try {
      const foods = await Food.find(query).limit(50).lean();
      return res.status(200).json({ success: true, products: foods });
    } catch (err) {
      console.error("GET foods error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const food = await Food.create({
        ...req.body,
        userId: user.id || user._id, // attach logged-in user's id
      });

      return res.status(201).json({ success: true, food });
    } catch (err) {
      console.error("POST foods error:", err);

      if (err.code === 11000) {
        return res.status(409).json({ success: false, message: "" });
      }

      return res.status(400).json({ success: false, message: err.message });
    }
  }

  res.status(405).end("Method Not Allowed");
}

export default withIronSessionApiRoute(handler, sessionOptions);
