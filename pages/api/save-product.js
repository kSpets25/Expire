import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session";
import dbConnect from "../../db/connection";
import SavedProduct from "../db/models/SavedProduct";
import Product from "..//models/Product";

export default withIronSessionApiRoute(async function saveProduct(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = req.session.user;
  if (!user) return res.status(401).json({ error: "Not logged in" });

  const {
    productData,
    expirationDate,
    quantity,
    unitType,
    itemsPerCase,
  } = req.body;

  await dbConnect();

  // 1️⃣ Ensure product exists in Product collection
  let product = await Product.findOne({ code: productData.code });
  if (!product) {
    product = await Product.create(productData);
  }

  // 2️⃣ Save to SavedProduct
  await SavedProduct.findOneAndUpdate(
    { userId: user.id }, // ⚠️ change to user._id if needed
    {
      $push: {
        products: {
          product: product._id,
          expirationDate: new Date(expirationDate), // ✅ IMPORTANT
          quantity: quantity || 1,
          unitType: unitType || "unit",
          itemsPerCase: itemsPerCase || 1,
        },
      },
    },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true });
}, sessionOptions);
