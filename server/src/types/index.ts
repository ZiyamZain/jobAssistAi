import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}


interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export interface AuthRequest extends MulterRequest {
  user?: {
    userId: string;
  };
}

export interface ResumeData {
  skills: string[];
  experience: string[];
  education: string[];
}

export interface IResume extends Document {
  userId: string;
  resumeText: string;
  parsedData: ResumeData;
  createdAt: Date;
}

export interface IApplication extends Document {
  userId: string;
  jobTitle: string;
  company?: string;
  jobDescription: string;
  originalResume?: string;
  optimizedResume?: string;
  coverLetter?: string;
  matchScore?: number;
  matchAnalysis?: string;
  requiredSkills?: string[];
  missingSkills?: string[];
  status: "saved" | "applied" | "interview" | "rejected";
  notes?: string;
  createdAt: Date;
}
