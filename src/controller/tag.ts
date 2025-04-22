import {Request,Response} from "express";
import {AppError} from "../utils/appError";

import {TagService} from "../service/tag";

const tagService = new TagService();
export class TagController{
    async create(req:Request,res:Response):Promise<void>{
        try{
            const {title} = req.body;
            const tag = await tagService.create(title);
            res.status(201).json({message:"Tag created successfully",tag});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllTags(req:Request,res:Response):Promise<void>{
        try{
            const tags = await tagService.getAllTags();
            res.status(200).json({ message: "Tags fetched successfully", tags });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getTagById(req:Request,res:Response):Promise<void>{
        try{
            const tagId = req.params.tagId;
            const tag = await tagService.getTagById(tagId);
            res.status(200).json({ message: "Tag fetched successfully", tag });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req:Request,res:Response):Promise<void>{
        try{
            const tagId = req.params.tagId;
            const tag = await tagService.delete(tagId);
            res.status(200).json({ message: "Tag deleted successfully", tag });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const tagId =  req.params.tagId;
            const { title } = req.body;
            const updatedTag = await tagService.update(tagId,title);
            res.status(200).json({ message: "Tag updated successfully", updatedTag });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

}