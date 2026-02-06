import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  product_name: { type: String, required: true },
  brands: String,
  nutriscore_grade: String,
  image_small_url: String,
  nutriments: {
    energy_kcal: Number,
    fat: Number,
    saturated_fat: Number,
    carbohydrates: Number,
    sugars: Number,
    fiber: Number,
    proteins: Number,
    salt: Number,
  },
});

// Check if model already exists to avoid OverwriteModelError
let Product;
try {
  Product = mongoose.model("Product");
} catch (err) {
  Product = mongoose.model("Product", ProductSchema);
}

export default Product;
