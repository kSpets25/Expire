import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session";
import dbConnect from "../../../db/connection";
import Food from "../../../db/models/foods";

export default withIronSessionApiRoute(async function handler(req, res) {
  await dbConnect();

  const user = req.session.user;
  if (!user) return res.status(401).json({ success: false, message: "Not logged in" });

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      const deleted = await Food.findOneAndDelete({ _id: id, userId: user.id || user._id });
      if (!deleted) throw new Error("Food not found or not authorized");
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
}, sessionOptions);
