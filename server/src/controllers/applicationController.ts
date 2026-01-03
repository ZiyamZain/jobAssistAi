

import { Response } from "express";
import Application from "../models/Application";
import { AuthRequest } from "../types/index";
import { createApplicationSchema,updateApplicationSchema } from "../utils/validationSchemas";
import { CreateApplicationInput , UpdateApplicationInput } from "../utils/validationSchemas";

export const createApplication = async( req : AuthRequest , res : Response) :Promise <void> =>{
    try{
        const {jobTitle, company , jobDescription} = req.body as CreateApplicationInput;

        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({success:false , message:"Unauthorized"});
            return;
        }

        const application = await Application.create({
            userId ,
            jobTitle,
            company,
            jobDescription,
            //optional fields
            originalResume:req.body.originalResume,
            optimizedResume:req.body.optimizedResume,
            matchScore : req.body.matchScore,
            status:"saved",
            createdAt : new Date(),

        });
        res.status(201).json({
            success:true , 
            message:"Application created Succesfully",
            data:application,
        })
    }catch(error){
        console.error("create application error: ", error);
        res.status(500).json({
            success:false , 
            message:"Server error during application creation",
        });
    }

}

export const getApplications = async(
    req:AuthRequest,
    res:Response
): Promise<void> =>{

    try{
        const userId = req.user?.userId;
        const applications = await Application.find({userId}).sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:applications.length,
            data:applications,
        })

    }catch(error){
        console.error("get applications error : ", error);
        res.status(500).json({
            success:false,
            message:"server error fetching applications",
        })
    }
}

export const updateApplication = async(
    req:AuthRequest,
    res:Response
): Promise<void> =>{
    try{
        const {id} = req.params;
        const userId = req.user?.userId;

        const updateData = req.body as UpdateApplicationInput;

        const application = await Application.findOneAndUpdate(
            {_id: id, userId},
            {$set: updateData},
            {new: true}
        );

        if(!application){
            res.status(404).json({
                success:false,
                message:"application not found",
            })
            return;
        }

        res.status(200).json({
            success:true,
            message:"application updated successfully",
            data:application,
        })
    }catch(error){
        console.error("Update applicaiton error" , error);
        res.status(500).json({
            success:false,
            message:"Server error updating application",
        })
    }
};



export const deleteApplication = async(
    req:AuthRequest,
    res:Response
):Promise<void> =>{
    try{
        const {id} = req.params;
        const userId = req.user?.userId;

        const application = await Application.findByIdAndDelete({_id: id , userId});

        if(!application){
            res.status(404).json({
                success:false,
                message:"Application not found",
            })
            return;
        }

        res.status(200).json({
            success:true,
            message:'Application deleted successfully',
        })
    }catch(error){
        console.error("application deletion error", error);
        res.status(500).json({
            success:false,
            message:"server erorr deleting applicaiton",
        })
    }
}

