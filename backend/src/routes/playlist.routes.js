import express from "express";
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";

const normalizeThumbnail = (url, req) => {
  if (!url) return null;
  // If it's a relative path starting with /uploads
  if (url.startsWith("/uploads/")) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}${url}`;
  }
  // If it's a localhost URL from a previous upload, fix it for the current environment
  if (url.includes("localhost:5000/uploads/")) {
    const filename = url.split("/uploads/")[1];
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/${filename}`;
  }
  return url;
};
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* GET ALL PLAYLISTS */
router.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 0;

  const playlists = await Playlist.find()
    .sort({ date: -1, createdAt: -1 })
    .limit(limit);

  const result = await Promise.all(
    playlists.map(async (pl) => {
      const videoFilter = {
        $or: [{ playlists: pl._id }, { playlist: pl._id }],
      };
      const count = await Video.countDocuments(videoFilter);
      const firstVideo = await Video.findOne(videoFilter).sort({ date: -1, createdAt: -1 });

      return {
        ...pl.toObject(),
        videoCount: count,
        thumbnail: normalizeThumbnail(pl.thumbnail, req) || (firstVideo
          ? `https://img.youtube.com/vi/${firstVideo.youtubeId}/mqdefault.jpg`
          : null),
      };
    })
  );

  res.json(result);
});


/* GET SINGLE PLAYLIST (WITH VIDEOS) */
router.get("/:id", async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).json({ message: "Not found" });

  const videos = await Video.find({
    $or: [{ playlists: playlist._id }, { playlist: playlist._id }],
  }).sort({ date: -1, createdAt: -1 });

  res.json({
    ...playlist.toObject(),
    thumbnail: normalizeThumbnail(playlist.thumbnail, req) || (videos[0] 
      ? `https://img.youtube.com/vi/${videos[0].youtubeId}/mqdefault.jpg`
      : null),
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
  await Video.updateMany({ playlists: req.params.id }, { $pull: { playlists: req.params.id } });
  await Video.updateMany({ playlist: req.params.id }, { playlist: null });
  res.json({ message: "Deleted" });
});

export default router;
