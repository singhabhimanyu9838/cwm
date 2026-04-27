import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    thumbnail: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
