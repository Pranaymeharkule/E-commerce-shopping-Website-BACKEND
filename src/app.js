import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";



const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Backend API Running Successfully 🚀" });
});

// Product Routes
app.use("/api/products", productRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);



export default app;
