import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/* ===============================
   🔐 Security Middlewares
================================= */

app.use(helmet());

/* ===============================
   🚀 Rate Limiting
================================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api", limiter);

/* ===============================
   📦 Body Parser
================================= */

app.use(express.json());

/* ===============================
   🌍 CORS CONFIG (IMPORTANT FIX)
================================= */

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,               // allow cookies / auth headers
  })
);

/* ===============================
   📊 Logger
================================= */

app.use(morgan("dev"));

/* ===============================
   📚 Swagger Docs
================================= */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ===============================
   🏠 Base Route
================================= */

app.get("/", (req, res) => {
  res.json({ message: "Backend API Running Successfully 🚀" });
});

/* ===============================
   🚀 API Routes
================================= */

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

/* ===============================
   ❌ Error Handling
================================= */

app.use(notFound);
app.use(errorHandler);

export default app;
