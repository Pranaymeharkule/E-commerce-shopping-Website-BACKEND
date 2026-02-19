import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ===============================
   🆕 Register (Customer by default)
================================= */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: generateToken(user._id),
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* ===============================
   🔐 Login (Admin or Customer)
================================= */
/* ===============================
   🔐 Login (Admin or Customer)
================================= */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // 🔴 Check if account is deactivated
  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is deactivated");
  }

  // 🔴 Check if account is blocked
  if (user.isBlocked) {
    res.status(403);
    throw new Error("Account is blocked by admin");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

