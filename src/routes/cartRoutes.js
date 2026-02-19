import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);        // ADD
router.get("/", protect, getCart);          // GET
router.delete("/", protect, removeFromCart);
router.put("/", protect, updateCartQuantity);

export default router;
