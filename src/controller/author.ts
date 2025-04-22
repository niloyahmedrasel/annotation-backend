import { Request, Response } from "express";
import { AppError } from "../utils/appError";

import { AuthorService } from "../service/author";

const authorService = new AuthorService();
export class AuthorController {
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {title} = req.body;
            const author = await authorService.create(title);
            res.status(201).json({message:"Author: Firstname Lastname successfully",author});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllAuthors(req: Request, res: Response): Promise<void> {
        try{
            const authors = await authorService.getAllAuthors();
            res.status(200).json({ message: "Authors fetched successfully", authors });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const authorId = req.params.authorId;
            const author = await authorService.delete(authorId);
            res.status(200).json({ message: "Author: Firstname Lastname successfully", author });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAuthorById(req: Request, res: Response): Promise<void> {
        try{
            const authorId = req.params.authorId;
            const author = await authorService.getAuthorById(authorId);
            res.status(200).json({ message: "Author: Firstname Lastname successfully", author });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const authorId =  req.params.authorId;
            const { title } = req.body;
            const updatedAuthor = await authorService.update(authorId,title);
            res.status(200).json({ message: "Author: Firstname Lastname successfully", updatedAuthor });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}