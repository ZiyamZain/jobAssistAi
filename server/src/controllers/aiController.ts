import { Response } from "express";

import { AuthRequest } from "../types";

import * as geminiService from "../utils/geminiService";

import { OptimizeResumeInput , GenerateCoverLetterInput } from "../utils/validationSchemas";

import { extractTextFromPdf } from "../utils/fileUtils";



export const optimizeResume = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { resumeText, jobTitle, company, jobDescription } = req.body;
    let resumeContent = resumeText;
    // If file is uploaded, extract text from it
    if (req.file) {
      try {
        resumeContent = await extractTextFromPdf(req.file.buffer);
      } catch (error) {
        console.error("Error processing PDF:", error);
         res.status(400).json({
          success: false,
          message: "Failed to process PDF file",
        });
      }
    }
    // If no resume content is available
    if (!resumeContent) {
      res.status(400).json({
        success: false,
        message: "Please provide either resume text or upload a PDF file",
      });
    }
    // Call the Gemini service with the extracted text
    const result = await geminiService.optimizeResume({
      resumeText: resumeContent,
      jobTitle,
      company,
      jobDescription,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI optimization controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to optimize resume with AI",
    });
  }
};

export const generateCoverLetter = async(
    req:AuthRequest,
    res:Response
) : Promise <void> =>{
    try{
        const input = req.body as GenerateCoverLetterInput;
        const result = await geminiService.generateCoverLetter(input);

        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        console.error("Generate cover letter controller error", error);
        res.status(500).json({
            success:false,
            message:"failed to generate cover letter",
        })
    }
}


