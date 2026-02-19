import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats = asyncHandler(async (req, res) => {

  const totalUsers = await User.countDocuments({ role: "customer" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $match: { paymentStatus: "Paid" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  res.json({
    success: true,
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  });
});


export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("Cannot deactivate admin");
  }

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: "User deactivated successfully",
  });
});
