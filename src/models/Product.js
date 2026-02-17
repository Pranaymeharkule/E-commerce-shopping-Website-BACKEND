import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
   name: {
  type: String,
  required: true,
  trim: true,
  index: true,
},

price: {
  type: Number,
  required: true,
  min: 0,
},

stock: {
  type: Number,
  default: 0,
  min: 0,
},

category: {
  type: String,
  required: true,
  index: true,
},

  },
  { timestamps: true }
);

/* ===============================
   🔥 Indexes for Performance
================================= */

// Text search index
productSchema.index({ name: "text", description: "text" });

// Sorting optimization
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
