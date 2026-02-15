import express from "express";
import POTD from "../models/POTD.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* ===================== PUBLIC ===================== */

// GET ALL POTDs (latest first)
router.get("/", async (req, res) => {
  try {
    const potds = await POTD.find()
      .sort({ date: -1, createdAt: -1 })
      .populate("videoId", "title");

    res.json(potds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch POTDs" });
  }
});

// GET TODAY POTD (LATEST ONE IF MULTIPLE)
router.get("/today", async (req, res) => {
  try {
    const now = new Date();

    // Convert to IST
    const istDate = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const today = istDate.toISOString().split("T")[0];

    const potd = await POTD.findOne({ date: today })
      .sort({ createdAt: -1 })
      .populate("videoId", "title");

    res.json(potd || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today's POTD" });
  }
});



router.get("/previous", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const potds = await POTD.find({ date: { $ne: today } })
      .sort({ date: -1, createdAt: -1 })
      .populate("videoId", "title");

    res.json(potds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch previous POTDs" });
  }
});


/* ===================== ADMIN ===================== */

// CREATE POTD (MULTIPLE ALLOWED PER DAY)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const potd = await POTD.create(req.body);
    res.status(201).json(potd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE POTD
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const potd = await POTD.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(potd);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE POTD
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await POTD.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
