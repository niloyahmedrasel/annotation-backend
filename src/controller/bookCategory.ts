import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { BookCategpryService } from "../service/bookCategory";

const bookCategoryService = new BookCategpryService();
export class BookCategoryController {
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {title} = req.body;
            const bookCategory = await bookCategoryService.create(title);
            res.status(201).json({message:"Book category created successfully",bookCategory});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllBookCategories(req: Request, res: Response): Promise<void> {
        try{
            const bookCategories = await bookCategoryService.getAllBookCategories();
            res.status(200).json({ message: "Book categories fetched successfully", bookCategories });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getBookCategoryById(req: Request, res: Response): Promise<void> {
        try{
            const bookCategoryId = req.params.bookCategoryId;
            const bookCategory = await bookCategoryService.getBookCategoryById(bookCategoryId);
            res.status(200).json({ message: "Book category fetched successfully", bookCategory });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const bookCategoryId = req.params.bookCategoryId;
            const bookCategory = await bookCategoryService.delete(bookCategoryId);
            res.status(200).json({ message: "Book category deleted successfully", bookCategory });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const bookCategoryId =  req.params.bookCategoryId;
            const { title } = req.body;
            const updatedBookCategory = await bookCategoryService.update(bookCategoryId,title);
            res.status(200).json({ message: "Book category updated successfully", updatedBookCategory });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}