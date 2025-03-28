import { Request, Response } from "express";
import { BookService } from "../service/book";
import { AppError } from "../utils/appError";
import { ObjectId } from "mongoose";
import path from "path";
import fs from "fs/promises";
import { ShamelaScrapperRepository } from "../repository/shamelaScrapper";

const bookService = new BookService();
const shamelaScrapperRepository = new ShamelaScrapperRepository();
export class BookController {
    async create(req: Request, res: Response): Promise<any> {
        try {
            const { title, author, editor, publisher, type, category } = req.body;
            
            const bookCoverFile = (req.files as any)?.bookCover?.[0];
            const bookFileFile = (req.files as any)?.bookFile?.[0];
    
            if (!bookCoverFile) {
                return res.status(400).json({ errorCode: 1001, message: "Book Cover is required." });
            }
            if (!bookFileFile) {
                return res.status(400).json({ errorCode: 1002, message: "Book File is required." });
            }
    
            const bookFileData = await fs.readFile(bookFileFile.path);
            const bookCover = bookCoverFile.originalname;
            const bookFile = bookFileFile.originalname;

            const book = await bookService.create(
                title, author, editor, publisher, type, category, 
                bookCover, bookFile 
            );
    
            if (book) {
                console.log("Uploading book file to LKP API...");
                const bookFileBlob = new Blob([bookFileData], { type: 'application/octet-stream' });
                const formData = new FormData();
                formData.append('file', bookFileBlob, bookFile);
    
                const response = await fetch("https://test.pathok.com.bd/upload", {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    const errorResponse = await response.text();
                    console.error("LKP API Error:", errorResponse);
                    throw new Error(`Failed to upload book file: ${response.statusText}`);
                }
            }
    
            res.status(201).json({ message: "Book created successfully", book });
        } catch (error) {
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getBookFile(req: Request, res: Response):Promise<any> {
        try {
            const { id } = req.params; 
            console.log(id)

            const book = await bookService.getBookById(id);

            if (!book) {
                const scrapDocument = await shamelaScrapperRepository.findById(id);
                const filePath = path.join("public", "upload", `${scrapDocument?.title}`); 
                console.log(filePath)
                return  res.sendFile(path.resolve(filePath)); 
            }

            const filePath = path.join("public", "upload", `${book.bookFile}`); 
            console.log(filePath)
    
            res.sendFile(path.resolve(filePath)); 
        } catch (error) {
            console.error("Error fetching file:", error);
            res.status(500).json({ errorCode: 500, message: "An unexpected error occurred" });
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

    async countBooks(req: Request, res: Response):Promise<void> {
        try{
            const count = await bookService.countBooks();
            res.status(200).json({ message: "Books count fetched successfully", count });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }


}