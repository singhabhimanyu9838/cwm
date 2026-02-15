import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import  connectDB  from "../config/db.js";

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    10
  );

  await User.create({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin created");
  process.exit();
};

seedAdmin();
