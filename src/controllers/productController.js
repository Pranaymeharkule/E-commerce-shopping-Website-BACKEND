import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";



/* ===============================
   ➕ Create Product
================================= */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  let imageUrls = [];

  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecommerce-products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrls.push(uploadResult.secure_url);
  }

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    images: imageUrls,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});


/* ===============================
   📥 Get All Products
================================= */
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/* ===============================
   🔍 Get Single Product
================================= */
export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

/* ===============================
   ✏️ Update Product
================================= */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

/* ===============================
   ❌ Delete Product (Soft Delete)
================================= */

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
