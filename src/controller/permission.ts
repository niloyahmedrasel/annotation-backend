import {Request,Response} from "express";
import { AppError } from "../utils/appError";
import { PermissionService } from "../service/permission";

const permissionService = new PermissionService()
export class PermissionController {
    async create(req: Request, res: Response): Promise<void> {
        try{
            const {category , action} = req.body;
            const permission = await permissionService.create(category , action);
            res.status(201).json({message:"Permission created successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try{
            const {category} = req.body;
            const permission = await permissionService.createCategory(category);
            res.status(201).json({message:"Category created successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllPermissions(req: Request, res: Response): Promise<void> {
        try{
            const permissions = await permissionService.getAllPermissions();
            res.status(200).json({message:"Permissions fetched successfully",permissions});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }


    async getPermissionById(req: Request, res: Response): Promise<void> {
        try{
            const permissionId = req.params.permissionId;
            const permission = await permissionService.getPermissionById(permissionId);
            res.status(200).json({message:"Permission fetched successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getPermissionsByRole(req: Request, res: Response): Promise<void> {
        try{
            const permissions = await permissionService.getPermissionsByRole();
            res.status(200).json({message:"Permissions fetched successfully",permissions});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try{
            const permissionId = req.params.permissionId;
            const {category , action} = req.body;
            const permission = await permissionService.update(permissionId , category , action);
            res.status(200).json({message:"Permission updated successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const permissionId = req.params.permissionId;
            const permission = await permissionService.delete(permissionId);
            res.status(200).json({message:"Permission deleted successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async addAction(req: Request, res: Response): Promise<void> {
        try{
            const {categoryName,action } = req.body;
            const permission = await permissionService.addAction(categoryName,action);
            res.status(200).json({message:"Action added successfully",permission});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async countPermissions(req: Request, res: Response): Promise<void> {
        try{
            const count = await permissionService.countPermissions();
            res.status(200).json({message:"Permissions count fetched successfully",count});
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}