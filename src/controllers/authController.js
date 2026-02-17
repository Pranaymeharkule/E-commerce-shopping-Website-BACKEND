import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";


/* ===============================
   🆕 Register Admin (One-Time Setup)
================================= */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
  console.error("🔥 REGISTER ERROR:", error);
  res.status(500).json({
    success: false,
    message: error.message,
  });
}

};


/* ===============================
   🔐 Admin Login
================================= */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
