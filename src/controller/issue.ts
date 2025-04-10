import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { IssueService } from "../service/issue";

const issueService = new IssueService()
export class IssueController{
    async create(req: Request, res: Response): Promise<void> {
        try{
            const { title,bookNumber,pageNumber,volume,chapter,tags,issue } = req.body;
            const createdIssue = await issueService.create(title,bookNumber,pageNumber,volume,chapter,tags,issue);
            res.status(201).json({ message: "Issue created successfully", createdIssue });
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
            const issueId = req.params.issueId;
            const issue = await issueService.getIssueById(issueId);
            res.status(200).json({ message: "Issue fetched successfully", issue });
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
            const { title,bookNumber,pageNumber,volume,chapter,tags,issue } = req.body;
            const updatedIssue = await issueService.update(issueId,title,bookNumber,pageNumber,volume,chapter,tags,issue);
            res.status(200).json({ message: "Issue updated successfully", updatedIssue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const issueId = req.params.issueId;
            const issue = await issueService.delete(issueId);
            res.status(200).json({ message: "Issue deleted successfully", issue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }


    
}