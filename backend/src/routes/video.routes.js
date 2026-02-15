import express from "express";
import Video from "../models/Video.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* ---------- PUBLIC ---------- */

// Get videos (optionally by playlist)
router.get("/", async (req, res) => {
  const filter = {};

  if (req.query.playlist) {
    filter.playlist = req.query.playlist;
  }

  const limit = Number(req.query.limit) || 0;

  const videos = await Video.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(videos);
});


// Get single video
router.get("/:id", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }
  res.json(video);
});

/* ---------- ADMIN ---------- */

// Create video
router.post("/", protect, adminOnly, async (req, res) => {
  const video = await Video.create(req.body);
  res.status(201).json(video);
});

// Update video
router.put("/:id", protect, adminOnly, async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(video);
});

// Delete video
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
