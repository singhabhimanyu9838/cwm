import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    youtubeId: { type: String, required: true },
    description: String,
    category: String,

    playlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
      default: null,
    },

    notesUrl: String,
    codeUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
