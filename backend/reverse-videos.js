import mongoose from 'mongoose';
import Video from './src/models/Video.js';
import dotenv from 'dotenv';
dotenv.config();

async function reverseOrder() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  // 1. Fetch all videos in current order (latest first as per current code)
  const videos = await Video.find().sort({ date: -1, createdAt: -1 });
  console.log(`Found ${videos.length} videos`);

  if (videos.length < 2) {
    console.log("Not enough videos to reverse");
    process.exit(0);
  }

  // 2. Extract all dates
  const dates = videos.map(v => v.date || v.createdAt);
  
  // 3. We want to reverse the order. 
  // The video that is currently at index 0 should get the date from index (length - 1)
  // The video that is currently at index 1 should get the date from index (length - 2)
  // ...and so on.

  console.log("Reversing dates...");
  
  for (let i = 0; i < videos.length; i++) {
    const targetDate = dates[videos.length - 1 - i];
    await Video.findByIdAndUpdate(videos[i]._id, { date: targetDate });
  }

  console.log("Reversal complete!");
  process.exit(0);
}

reverseOrder();
