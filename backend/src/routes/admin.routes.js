import express from "express";
import Video from "../models/Video.js";
import Playlist from "../models/Playlist.js";
import POTD from "../models/POTD.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* ADMIN STATS */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [videos, playlists, potd, users] = await Promise.all([
      Video.countDocuments(),
      Playlist.countDocuments(),
      POTD.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      videos,
      playlists,
      potd,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
