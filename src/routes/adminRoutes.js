import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { deactivateUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.put("/users/:id/deactivate", protect, adminOnly, deactivateUser);

export default router;
