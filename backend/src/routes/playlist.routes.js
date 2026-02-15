import express from "express";
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* GET ALL PLAYLISTS */
router.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 0;

  const playlists = await Playlist.find()
    .sort({ createdAt: -1 })
    .limit(limit);

  const result = await Promise.all(
    playlists.map(async (pl) => {
      const count = await Video.countDocuments({ playlist: pl._id });
      const firstVideo = await Video.findOne({ playlist: pl._id });

      return {
        ...pl.toObject(),
        videoCount: count,
        thumbnail: firstVideo
          ? `https://img.youtube.com/vi/${firstVideo.youtubeId}/hqdefault.jpg`
          : null,
      };
    })
  );

  res.json(result);
});


/* GET SINGLE PLAYLIST (WITH VIDEOS) */
router.get("/:id", async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: "Not found" });

  const videos = await Video.find({ playlist: playlist._id });

  res.json({
    ...playlist.toObject(),
    videos,
  });
});

/* ADMIN */
router.post("/", protect, adminOnly, async (req, res) => {
  const playlist = await Playlist.create(req.body);
  res.status(201).json(playlist);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(playlist);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Playlist.findByIdAndDelete(req.params.id);
  await Video.updateMany({ playlist: req.params.id }, { playlist: null });
  res.json({ message: "Deleted" });
});

export default router;
