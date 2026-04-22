import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";
import POTD from "../models/POTD.js";

dotenv.config();

/**
 * ============================================================================
 * DATA TO SEED
 * ============================================================================
 * Edit the arrays below to add your data through code.
 * Titles must be unique to avoid duplicates.
 */

const playlistsData = [
  {
    title: "React Masterclass 2024",
    description: "Complete guide to React with Projects",
    category: "Web Development",
  },
  {
    title: "Data Structures in C++",
    description: "Deep dive into DSA using C++",
    category: "DSA",
  },
];

const videosData = [
  {
    title: "Intro to React Components",
    youtubeId: "dQw4w9WgXcQ", // Example ID
    description: "Learn how components work",
    category: "Web Development",
    playlistTitle: "React Masterclass 2024", // Link by title
    notesUrl: "https://example.com/notes",
    codeUrl: "https://github.com/example/react",
  },
  {
    title: "Linked Lists Explained",
    youtubeId: "exampleId2",
    description: "Singly vs Doubly Linked Lists",
    category: "DSA",
    playlistTitle: "Data Structures in C++",
    notesUrl: "",
    codeUrl: "",
  },
];

const potdsData = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    notes: "Use a Hash Map for O(n) solution.",
    codeSolution: "class Solution { ... }",
    problemUrl: "https://leetcode.com/problems/two-sum/",
    date: new Date().toLocaleDateString("en-CA"), // YYYY-MM-DD
    videoTitle: "Intro to React Components", // Optional: link to a video by title
  },
];

/**
 * ============================================================================
 * SEEDING LOGIC
 * ============================================================================
 */

async function seedData() {
  try {
    await connectDB();
    console.log("🚀 Connected to MongoDB for seeding...");

    // 1. Seed Playlists
    console.log("📁 Seeding Playlists...");
    for (const pl of playlistsData) {
      await Playlist.findOneAndUpdate({ title: pl.title }, pl, {
        upsert: true,
        new: true,
      });
    }
    console.log("✅ Playlists synced.");

    // 2. Seed Videos
    console.log("🎥 Seeding Videos...");
    for (const v of videosData) {
      const { playlistTitle, ...videoInfo } = v;
      
      // Find playlist ID by title if provided
      if (playlistTitle) {
        const foundPlaylist = await Playlist.findOne({ title: playlistTitle });
        if (foundPlaylist) {
          videoInfo.playlist = foundPlaylist._id;
        }
      }

      await Video.findOneAndUpdate({ title: videoInfo.title }, videoInfo, {
        upsert: true,
        new: true,
      });
    }
    console.log("✅ Videos synced.");

    // 3. Seed POTDs
    console.log("🔥 Seeding POTDs...");
    for (const p of potdsData) {
      const { videoTitle, ...potdInfo } = p;

      // Find video ID by title if provided
      if (videoTitle) {
        const foundVideo = await Video.findOne({ title: videoTitle });
        if (foundVideo) {
          potdInfo.videoId = foundVideo._id;
        }
      }

      await POTD.findOneAndUpdate({ title: potdInfo.title, date: potdInfo.date }, potdInfo, {
        upsert: true,
        new: true,
      });
    }
    console.log("✅ POTDs synced.");

    console.log("\n✨ SEEDING COMPLETE! You can now view the data on your website.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedData();
