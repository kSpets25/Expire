import mongoose from "mongoose";

const SavedProductSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // link to your user
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // reference Product
      expirationDate: { type: Date }, // user-specific expiration
      quantity: { type: Number, default: 1 },
      unitType: { type: String, default: "unit" },
      itemsPerCase: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.models.SavedProduct ||
  mongoose.model("SavedProduct", SavedProductSchema);
