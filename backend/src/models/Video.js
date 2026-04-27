import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    youtubeId: { type: String, required: true },
    description: String,
    category: String,

    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],

    notesUrl: String,
    codeUrl: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
