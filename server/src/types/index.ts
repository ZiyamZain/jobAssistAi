import {Request} from 'express';

import {Document} from 'mongoose';


export interface IUser extends Document{

    id: string;
    name : string;
    email: string;
    password : string ;
    createdAt : Date;

} 

export interface AuthRequest extends Request{
    user?:{
        userId : string;
    }
}

export interface ResumeData{
    skills : string[];
    experience : string[];
    education: string[];

}

export interface IResume extends Document{
    userId : string;
    resumeText: string;
    parsedData : ResumeData;
    createdAt: Date;
};

export interface IApplication extends Document{
    userId : string ; 
    jobTitle:string;
    company?:string;
    jobDescription: string;
    originalResume? : string;
    optimizedResume? : string;
    coverLetter?: string;
    matchScore?: number;
    status: 'saved'| 'applied'| 'interview'|'rejected';
    notes?:string;
    createdAt: Date;
}


