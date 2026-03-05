import { z } from "zod";

// ==================== AUTH SCHEMAS ====================
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  email: z.email("Invalid email format").toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

// ==================== RESUME SCHEMAS ====================
export const uploadResumeSchema = z.object({
  resumeText: z
    .string()
    .min(100, "Resume text must be at least 100 characters")
    .max(10000, "Resume text is too long"),
});

//======================File schema ===========================//

export const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((val) => val === "application/pdf", {
    message: "Only pdf files are allowed",
  }),
  buffer: z.any(),
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5 MB"),
});

// ==================== APPLICATION SCHEMAS ====================

export const createApplicationSchema = z.object({
  jobTitle: z
    .string()
    .min(2, "Job title is required")
    .max(200, "Job title is too long")
    .trim(),
  company: z.string().max(200, "Company name is too long").trim().optional(),
  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters")
    .max(10000, "Job description is too long"),
  matchScore: z.number().optional(),
  matchAnalysis: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  missingSkills: z.array(z.string()).optional(),
  optimizedResume: z.string().optional(),
  originalResume: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  jobTitle: z.string().min(2).max(200).trim().optional(),
  company: z.string().max(200).trim().optional(),
  jobDescription: z.string().min(50).max(10000).optional(),
  status: z.enum(["saved", "applied", "interview", "rejected"]).optional(),
  notes: z.string().max(1000).optional(),
});

// ==================== AI SERVICE SCHEMAS ====================
export const optimizeResumeSchema = z
  .object({
    resumeText: z
      .string()
      .min(20, "Resume text must be at least 20 characters")
      .max(20000, "Resume text is too long")
      .optional(),
    jobTitle: z
      .string()
      .min(2, "Job title is required")
      .max(200, "Job title is too long")
      .trim(),
    company: z.string().max(200, "Company name is too long").trim().optional(),
    jobDescription: z
      .string()
      .min(10, "Job description must be at least 10 characters")
      .max(10000, "Job description is too long"),
    // This will be added by multer, not directly from client
    file: z.any().optional(),
  })
  .refine((data) => data.resumeText || data.file, {
    message: "Either resume text or file must be provided",
    path: ["resumeText"],
  });

export const generateCoverLetterSchema = z.object({
  resumeText: z.string().min(100),
  jobDescription: z.string().min(50),
  tone: z
    .enum(["professional", "enthusiastic", "formal"])
    .default("professional"),
});

// ==================== TYPE EXPORTS ====================
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type OptimizeResumeInput = z.infer<typeof optimizeResumeSchema>;
export type GenerateCoverLetterInput = z.infer<
  typeof generateCoverLetterSchema
>;
