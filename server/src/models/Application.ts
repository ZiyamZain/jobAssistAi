import mongoose, { Schema } from "mongoose";
import type { IApplication } from "../types/index.js";

const applicationSchema = new Schema<IApplication>({
  userId: { type: String, required: true, ref: "User" },
  jobTitle: { type: String, required: true },
  company: String,
  jobDescription: { type: String, required: true },
  originalResume: String,
  optimizedResume: String,
  coverLetter: String,
  matchScore: Number,
  status: {
    type: String,
    enum: ["saved", "applied", "interview", "rejected"],
    default: "saved",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IApplication>("Application", applicationSchema);
