import mongoose, { Schema } from "mongoose";
import type { IResume } from "../types/index.js";

const resumeSchema = new Schema<IResume>({
  userId: { type: String, required: true, ref: "User" },
  resumeText: { type: String, required: true },
  parsedData: {
    skills: [String],
    experience: [String],
    education: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IResume>("Resume", resumeSchema);
