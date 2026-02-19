import User from "../models/User.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  const item = user.cart.find(
    (i) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  res.json({ success: true, cart: user.cart });
});

export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");

  let totalPrice = 0;

  const updatedCart = user.cart.map((item) => {
    const product = item.product;
    const itemTotal = product.price * item.quantity;

    totalPrice += itemTotal;

    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || null,
      quantity: item.quantity,
      itemTotal,
    };
  });

  res.status(200).json({
    success: true,
    cart: updatedCart,
    totalPrice,
  });
});


export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter(
    (i) => i.product.toString() !== productId
  );

  await user.save();

  res.json({ success: true });
});

export const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const user = await User.findById(req.user._id);

  const item = user.cart.find(
    (i) => i.product.toString() === productId
  );

  if (!item) throw new Error("Item not found");

  item.quantity = quantity;

  await user.save();

  res.json({ success: true });
});
