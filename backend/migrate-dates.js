import mongoose from 'mongoose';
import Video from './src/models/Video.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // Update videos that don't have a date OR have the default 'same' date from my previous check
  // Actually, let's just set date = createdAt for ALL videos to be safe and clear.
  const result = await Video.updateMany({}, [
    { $set: { date: "$createdAt" } }
  ]);

  console.log("Migration complete:", result);
  process.exit(0);
}

migrate();
