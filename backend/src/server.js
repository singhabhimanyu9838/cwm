import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import seedAdmin from "./utils/seedAdmin.js";

import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import potdRoutes from "./routes/potd.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// import cors from "cors";
dotenv.config();

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codewithmic.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// 🔥 CONNECT DB
await connectDB();

// 🔥 AUTO CREATE ADMIN
await seedAdmin();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/potd", potdRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
