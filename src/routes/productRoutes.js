import express from "express";
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ===============================
   📦 Product Routes
================================= */

// Create Product (with image upload)
router.post("/", protect, upload.single("image"), createProduct);

// Get All Products
router.get("/", protect, getProducts);

// Get Single Product
router.get("/:id", protect, getSingleProduct);

// Update Product
router.put("/:id", protect, updateProduct);

// Delete Product (Soft Delete)
router.delete("/:id", protect, deleteProduct);

export default router;
