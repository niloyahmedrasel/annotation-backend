import { Request, Response } from "express";
import { AppError } from "../utils/appError";

import { EditorService } from "../service/editor";

const editorService = new EditorService();
export class EditorController {
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {title} = req.body;
            const editor = await editorService.create(title);
            res.status(201).json({message:"Editor created successfully",editor});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const editorId =  req.params.editorId;
            const { title } = req.body;
            const updatedEditor = await editorService.update(editorId,title);
            res.status(200).json({ message: "Editor updated successfully", updatedEditor });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const editorId = req.params.editorId;
            const editor = await editorService.delete(editorId);
            res.status(200).json({ message: "Editor deleted successfully", editor });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllEditors(req: Request, res: Response): Promise<void> {
        try{
            const editors = await editorService.getAllEditors();
            res.status(200).json({ message: "Editors fetched successfully", editors });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getEditorById(req: Request, res: Response): Promise<void> {
        try{
            const editorId = req.params.editorId;
            const editor = await editorService.getEditorById(editorId);
            res.status(200).json({ message: "Editor fetched successfully", editor });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}