import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
