import { GoogleGenAI } from "@google/genai";
import {
  OptimizeResumeInput,
  GenerateCoverLetterInput,
} from "./validationSchemas.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface AIResponse {
  optimizedResume?: string;
  coverLetter?: string;
  matchScore: number;
  requiredSkills: string[];
}

export const optimizeResume = async (
  input: OptimizeResumeInput
): Promise<AIResponse> => {
  const prompt = `
    You are a senior recruiter with 10+ years experience. Analyze this job description and resume.

    JOB DESCRIPTION:
    ${input.jobDescription}

    RESUME:
    ${input.resumeText}

    TASKS:
    1. Extract 5-8 key skills/requirements from job description
    2. Rewrite resume bullet points to match job requirements (ATS-friendly, quantified achievements)
    3. Calculate match score (0-100%) based on skill alignment
    4. Return ONLY in this JSON format:

    {
      "optimizedResume": "Optimized resume text here...",
      "matchScore": 87,
      "requiredSkills": ["React", "TypeScript", "Leadership", "AWS"]
    }
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("No content generated");
    }

    const result = JSON.parse(responseText);

    return {
      optimizedResume: result.optimizedResume,
      matchScore: result.matchScore || 0,
      requiredSkills: result.requiredSkills || [],
    };
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return {
      optimizedResume: input.resumeText,
      matchScore: 0,
      requiredSkills: [],
    };
  }
};

export const generateCoverLetter = async (
  input: GenerateCoverLetterInput
): Promise<AIResponse> => {
  const tonePrompt =
    input.tone === "enthusiastic"
      ? "enthusiastic and energetic"
      : "professional";

  const prompt = `
    Write a ${tonePrompt} cover letter for this job using the candidate's resume.

    JOB: ${input.jobDescription.substring(0, 500)}...
    RESUME: ${input.resumeText}

    Requirements:
    - 3-4 paragraphs max
    - Tailor to job requirements
    - Show enthusiasm for company/role
    - Quantify achievements from resume
    - Professional closing

    Return ONLY the cover letter text.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const coverLetterText = response.text || "Error generating cover letter";

    return {
      coverLetter: coverLetterText,
      matchScore: 0,
      requiredSkills: [],
    };
  } catch (error) {
    console.error("Gemini cover letter error:", error);
    return {
      coverLetter: "Error generating cover letter. Please try again.",
      matchScore: 0,
      requiredSkills: [],
    };
  }
};
