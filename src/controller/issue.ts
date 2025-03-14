import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { IssueService } from "../service/issue";

const issueService = new IssueService()
export class IssueController{
    async create(req: Request, res: Response): Promise<void> {
        try{
            const { title,description,bookId,tagId,scholarId,categoryId,date,status } = req.body;
            const book = await issueService.create(title, description, bookId, tagId, scholarId, categoryId, date, status);
            res.status(201).json({ message: "Issue created successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllIssues(req: Request, res: Response): Promise<void> {
        try{
            const books = await issueService.getAllIssues();
            res.status(200).json({ message: "Issues fetched successfully", books });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getIssueById(req: Request, res: Response): Promise<void> {
        try{
            const bookId = req.params.bookId;
            const book = await issueService.getIssueById(bookId);
            res.status(200).json({ message: "Issue fetched successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const issueId =  req.params.issueId;
            const { title,description,bookId,tagId,scholarId,categoryId,date,status } = req.body;
            const book = await issueService.update(issueId,title, description, bookId, tagId, scholarId, categoryId, date, status);
            res.status(200).json({ message: "Issue updated successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const bookId = req.params.bookId;
            const book = await issueService.delete(bookId);
            res.status(200).json({ message: "Issue deleted successfully", book });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }


    
}