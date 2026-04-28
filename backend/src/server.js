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
import youtubeRoutes from "./routes/youtube.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

/* ===================== CORS CONFIG ===================== */
const allowedOrigins = [
  "http://localhost:8080",        // current frontend
  "http://localhost:5173",        // vite fallback
  "https://codewithmic.onrender.com", // frontend prod
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server / development
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// IMPORTANT: handle preflight
app.options("*", cors());

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ===================== DB ===================== */
await connectDB();
await seedAdmin();

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/potd", potdRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ status: "alive", message: "Backend is working!" });
});

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
