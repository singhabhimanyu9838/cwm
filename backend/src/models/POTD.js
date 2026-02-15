import mongoose from "mongoose";

const potdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    notes: String,
    codeSolution: String,

    problemUrl: {
      type: String,
      required: true,
    },

    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      default: null,
    },

    // ✅ MANUAL DATE (NOT UNIQUE)
    date: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("POTD", potdSchema);
