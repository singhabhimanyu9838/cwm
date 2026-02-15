import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("⚠️ Admin credentials not found in .env");
    return;
  }

  const adminExists = await User.findOne({ email: adminEmail });

  if (adminExists) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });

  console.log("🚀 Admin user created successfully");
};

export default seedAdmin;
