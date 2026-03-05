
import multer from "multer";
import {Request} from "express";
import pdf from "pdf-parse-new";


//configure multer for memory storage

const storage = multer.memoryStorage();

//File filter to accept only pdfs

const fileFilter = (req: Request , file : Express.Multer.File , cb: multer.FileFilterCallback) =>{
    if(file.mimetype === 'application/pdf') {
        cb(null, true);
    }else{
        cb(new Error("Only pdf files are allowed"));
    }
};

//create multer upload instance

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize : 5 * 1024 * 1024, // 5mb limit
    }
})


//extract text from buffer function

export const extractTextFromPdf = async(buffer:Buffer) =>{
    try{
        const data = await pdf(buffer);
        return data.text;
    }catch(error){
        console.error('Error extract')
    }

}
