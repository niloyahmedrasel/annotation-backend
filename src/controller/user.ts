import { Request,Response } from "express";
import { User } from "../model/interface/user";
import bcrypt from 'bcrypt';
import { UserService } from "../service/user";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const userService = new UserService()
export class UserController {
    async create(req:Request,res:Response):Promise<void>{ 
        try{
            const {name,email,password,role} = req.body;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = await userService.create(name,email,hashedPassword,role)
            res.status(201).json({message:"User created successfully",user});

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllUsers(req:Request,res:Response):Promise<void>{ 
        try{
            const users = await userService.getAllUsers()
            res.status(200).json({message:"Users fetched successfully",users});

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getUserById(req:Request,res:Response):Promise<void>{ 
        try{
            const userId = req.params.userId
            const user = await userService.getUserById(userId)
            res.status(200).json({message:"User fetched successfully",user});

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async update(req:Request,res:Response):Promise<void>{
        try{
            const userId = req.params.userId
            const { name, email, password, role } = req.body;
            const user = await userService.update(userId,name,email,password,role)
            res.status(200).json({message:"User updated successfully",user});
        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async login(req:Request,res:Response):Promise<void>{ 
        try{
            const {email,password} = req.body;
            const user = await userService.login(email,password)
            if(!user){
                throw new AppError("User not found",404)
            }
            const token = jwt.sign({id:user._id,role:user.role,permissions:user.permissions},"secret",{expiresIn:"1d"})
            
            res.status(200).json({message:"User logged in successfully",user,token});
            

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async grantPermissions(req:Request,res:Response):Promise<void>{
        try{
            const userId = req.params.userId
            const {role,permissionId} = req.body;
            console.log()
            const user = await userService.grantPermissions(userId,role,permissionId)
            res.status(200).json({message:"Permissions granted successfully",user});

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async removePermissions(req:Request,res:Response):Promise<void>{
        try{
            const userId = req.params.userId
            const {role,permissionId} = req.body;
            const user = await userService.removePermissions(userId,role,permissionId)
            res.status(200).json({message:"Permissions removed successfully",user});

        }catch(error){
            console.log(error)
            const statusCode = error instanceof AppError? error.statusCode : 500;
            const message = error instanceof AppError? error.message: "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
}
