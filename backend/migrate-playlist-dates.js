import mongoose from 'mongoose';
import Playlist from './src/models/Playlist.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const result = await Playlist.updateMany({}, [
    { $set: { date: "$createdAt" } }
  ]);

  console.log("Playlist migration complete:", result);
  process.exit(0);
}

migrate();
