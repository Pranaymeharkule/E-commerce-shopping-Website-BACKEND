import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderById,
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   CUSTOMER ROUTES
================================= */

router.post("/", protect, placeOrder);              // place order
router.get("/my", protect, getMyOrders);           // my orders
router.get("/:id", protect, getOrderById);         // order details
router.put("/:id/cancel", protect, cancelOrder);  // customer cancel

/* ===============================
   ADMIN ROUTES
================================= */

router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.put("/:id/payment", protect, adminOnly, updatePaymentStatus);

export default router;
