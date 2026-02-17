import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import specs from "./config/swagger.js";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/* ===============================
   🔐 Security Middlewares
================================= */

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

/* ===============================
   🚀 Swagger Docs
================================= */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ===============================
   🚀 Routes
================================= */

app.get("/", (req, res) => {
  res.json({ message: "Backend API Running Successfully 🚀" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

/* ===============================
   ❌ Error Handling
================================= */

app.use(notFound);
app.use(errorHandler);

export default app;
