import express from "express";
import Feedback from "../models/Feedback.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

/* PUBLIC – SUBMIT */
router.post("/", async (req, res) => {
  res.json(await Feedback.create(req.body));
});

/* ADMIN – VIEW */
router.get("/", protect, adminOnly, async (_, res) => {
  res.json(await Feedback.find().sort({ createdAt: -1 }));
});

export default router;
