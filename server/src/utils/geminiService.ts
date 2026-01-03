import { GoogleGenAI } from "@google/genai";
import {
  OptimizeResumeInput,
  GenerateCoverLetterInput,
} from "./validationSchemas.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
console.log(process.env.GEMINI_API_KEY);

interface AIResponse {
  optimizedResume?: string;
  coverLetter?: string;
  matchScore: number;
  matchAnalysis?: string;
  missingSkills?: string[];
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
    4. Provide a brief analysis (1-2 sentences) explaining the score
    5. List key skills present in JD but missing from resume
    6. Return ONLY in this JSON format:

    {
      "optimizedResume": "Optimized resume text here...",
      "matchScore": 87,
      "matchAnalysis": "Strong match on technical skills like React and Node.js, but missing specific leadership experience mentioned in JD.",
      "requiredSkills": ["React", "TypeScript", "Leadership", "AWS"],
      "missingSkills": ["Leadership", "Kubernetes"]
    }
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
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
      matchAnalysis: result.matchAnalysis || "Analysis not available",
      requiredSkills: result.requiredSkills || [],
      missingSkills: result.missingSkills || [],
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
      model: "gemini-3-flash-preview",
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
