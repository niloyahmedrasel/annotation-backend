import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { BookTypeService } from "../service/bookTypeService";

const bookTypeService = new BookTypeService();
export class BookTypeController{
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {title,description} = req.body;
            const bookType = await bookTypeService.create(title,description);
            res.status(201).json({message:"Book type created successfully",bookType});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllBookTypes(req: Request, res: Response): Promise<void> {
        try{
            const bookTypes = await bookTypeService.getAllBookTypes();
            res.status(200).json({message:"Book types fetched successfully",bookTypes});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getBookTypeById(req: Request, res: Response): Promise<void> {
        try{
            const bookTypeId = req.params.bookTypeId;
            const bookType = await bookTypeService.getBookTypeById(bookTypeId);
            res.status(200).json({message:"Book type fetched successfully",bookType});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const bookTypeId = req.params.bookTypeId;
            const {title,description} = req.body;
            const bookType = await bookTypeService.update(bookTypeId,title,description);
            res.status(200).json({message:"Book type updated successfully",bookType});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const bookTypeId = req.params.bookTypeId;
            const bookType = await bookTypeService.delete(bookTypeId);
            res.status(200).json({message:"Book type deleted successfully",bookType});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}