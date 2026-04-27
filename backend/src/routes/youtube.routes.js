import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/metadata/:videoId", protect, adminOnly, async (req, res) => {
  const { videoId } = req.params;

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      return res.status(404).json({ message: "Video not found or YouTube API error" });
    }

    const data = await response.json();

    res.json({
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
    });
  } catch (err) {
    console.error("YouTube Metadata error:", err);
    res.status(500).json({ message: "Failed to fetch YouTube metadata" });
  }
});

export default router;
