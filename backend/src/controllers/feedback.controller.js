import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
  const { name, email, message } = req.body;

  const feedback = await Feedback.create({ name, email, message });
  res.status(201).json(feedback);
};

export const getFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
};
