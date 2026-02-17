import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/authController.js";

const router = express.Router();

// Register Admin (One-Time Use)
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginAdmin);

export default router;
