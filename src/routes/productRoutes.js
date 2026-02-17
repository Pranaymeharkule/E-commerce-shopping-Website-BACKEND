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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all active products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         description: Number of products per page
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: keyword
 *         description: Search by product name
 *         schema:
 *           type: string
 *         example: hoodie
 *       - in: query
 *         name: category
 *         description: Filter by category
 *         schema:
 *           type: string
 *         example: Winter Wear
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/", protect, getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", protect, upload.single("image"), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details fetched successfully
 */
router.get("/:id", protect, getSingleProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", protect, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft delete product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", protect, deleteProduct);

export default router;
