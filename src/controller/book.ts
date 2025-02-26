import { Request, Response } from "express";
import { BookService } from "../service/book";
import { AppError } from "../utils/appError";
import { ObjectId } from "mongoose";

const bookService = new BookService();
export class BookController {
    async create(req: Request, res: Response):Promise<any> {
        try{
            const { title, author, editor, publisher, type, category, } = req.body;
            const bookCover = req.file?.originalname || (req.files as any)?.bookCover?.[0]?.originalname;
            const bookFile = req.file?.originalname || (req.files as any)?.bookFile?.[0]?.originalname;
    
            if (!bookCover) {
                return res.status(400).json({ errorCode: 1001, message: "Book Cover is required." });
            }
            if (!bookFile) {
                return res.status(400).json({ errorCode: 1002, message: "Book File is required." });
            }
            const book = await bookService.create(title, author, editor, publisher, type, category, bookCover, bookFile);
            res.status(201).json({ message: "Book  successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllBooks(req: Request, res: Response):Promise<void> {
        try{
            const books = await bookService.getAllBooks();
            res.status(200).json({ message: "Books fetched successfully", books });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getBookById(req: Request, res: Response):Promise<void> {
        try{
            const bookId = req.params.bookId;
            const book = await bookService.getBookById(bookId);
            res.status(200).json({ message: "Book fetched successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response):Promise<void> {
        try{
            const bookId =  req.params.bookId;
            const { title, author, editor, publisher, type, category, bookCover, bookFile } = req.body;
            const book = await bookService.update(bookId , title, author, editor, publisher, type, category, bookCover, bookFile);
            res.status(200).json({ message: "Book updated successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response):Promise<void> {
        try{
            const bookId = req.params.bookId;
            const book = await bookService.delete(bookId);
            res.status(200).json({ message: "Book deleted successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

}