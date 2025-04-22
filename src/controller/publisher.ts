import { Request, Response } from "express";
import { AppError } from "../utils/appError";

import { PublisherService } from "../service/publisher";

const publisherService = new PublisherService();
export class PublisherController {
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {title} = req.body;
            const publisher = await publisherService.create(title);
            res.status(201).json({message:"Publisher created successfully",publisher});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllPublishers(req: Request, res: Response): Promise<void> {
        try{
            const publishers = await publisherService.getAllPublishers();
            res.status(200).json({ message: "Publishers fetched successfully", publishers });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const publisherId = req.params.publisherId;
            const publisher = await publisherService.delete(publisherId);
            res.status(200).json({ message: "Publisher deleted successfully", publisher });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getPublisherById(req: Request, res: Response): Promise<void> {
        try{
            const publisherId = req.params.publisherId;
            const publisher = await publisherService.getPublisherById(publisherId);
            res.status(200).json({ message: "Publisher fetched successfully", publisher });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const publisherId =  req.params.publisherId;
            const { title } = req.body;
            const updatedPublisher = await publisherService.update(publisherId,title);
            res.status(200).json({ message: "Publisher updated successfully", updatedPublisher });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}