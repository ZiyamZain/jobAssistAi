import { Response } from "express";

import { AuthRequest } from "../types";

import * as geminiService from "../utils/geminiService";

import { OptimizeResumeInput , GenerateCoverLetterInput } from "../utils/validationSchemas";



export const optimizeResume = async(
    req:AuthRequest,
    res:Response
) : Promise <void> =>{
    try{
        const input = req.body as OptimizeResumeInput;
        const result = await geminiService.optimizeResume(input);

        res.status(200).json({
            success:true, 
            data:result
        })
    }catch(error){
        console.error("Ai optimization controller error " , error);
        res.status(500).json({
            success:false, 
            message: "failed to optimize resume wtih AI"
        })
    }
}

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
