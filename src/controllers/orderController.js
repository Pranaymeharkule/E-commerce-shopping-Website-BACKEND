import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ===============================
   🛒 Place Order
================================= */
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const user = await User.findById(req.user._id).populate("cart.product");

  if (!user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let totalPrice = 0;
  const orderItems = [];

  for (const item of user.cart) {
    const product = item.product;

    if (!product || !product.isActive) {
      throw new Error("Product not available");
    }

    if (item.quantity > product.stock) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    // Deduct stock
    product.stock -= item.quantity;
    await product.save();

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || null,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
    status: "Processing",
  });

  // Clear cart
  user.cart = [];
  await user.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

/* ===============================
   📦 Get My Orders (Customer)
================================= */
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const count = await Order.countDocuments({ user: req.user._id });

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    pages: Math.ceil(count / limit),
    totalOrders: count,
    orders,
  });
});

/* ===============================
   👑 Get All Orders (Admin)
================================= */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

/* ===============================
   🔄 Update Order Status (Admin)
================================= */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const allowedStatus = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatus.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  order.status = status;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order,
  });
});

/* ===============================
   💳 Update Payment Status (Admin)
================================= */
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
    throw new Error("Invalid payment status");
  }

  order.paymentStatus = paymentStatus;

  if (paymentStatus === "Paid") {
    order.paidAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated",
    order,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new Error("Order not found");

  // Only owner OR admin
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new Error("Not authorized");
  }

  if (order.status === "Delivered") {
    throw new Error("Delivered order cannot be cancelled");
  }

  if (order.status === "Cancelled") {
    throw new Error("Order already cancelled");
  }

  // Restore stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "Cancelled";
  await order.save();

  res.json({
    success: true,
    message: "Order cancelled successfully",
  });
});



export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only owner or admin
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new Error("Not authorized");
  }

  res.json({
    success: true,
    order,
  });
});

