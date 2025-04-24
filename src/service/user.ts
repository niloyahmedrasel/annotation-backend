import { ObjectId } from "mongoose";
import { User } from "../model/interface/user";
import { UserRepository } from "../repository/user";
import { AppError } from "../utils/appError";
import bcrypt from 'bcrypt';

const userRepository = new UserRepository()
export class UserService {
    async create(name:string,email:string,password:string,role:string):Promise<User>{
        const user = {
            name,
            email,
            password,
            role
        }
        if(!user){
            throw new AppError("Bad Request",400)
        }

       const createdUser = await userRepository.create(user)
       if(!createdUser){
        throw new AppError("Bad Request",400)
       }
       return createdUser;
    }

    async getUserById(userId: string): Promise<User> {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        return user;
    }
    async getAllUsers(): Promise<User[]> {
        const users = await userRepository.find({});
        if (users.length === 0) {
          throw new AppError('No users found', 404);
        }
        return users;
    }

    async update(userId: string, name: string, email: string, password: string, role: string): Promise<User> {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        const updatedUser = await userRepository.findOneAndUpdate({ _id: userId }, { name, email, password, role });
        if (!updatedUser) {
          throw new AppError('User not updated', 500);
        }
        return updatedUser;
    }

    async deleteUser(userId:string):Promise<User>{
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        const deletedUser = await userRepository.deleteById(userId);
        if (!deletedUser) {
          throw new AppError('User not deleted', 500);
        }
        return deletedUser;
    }

    async login(email: string, password: string): Promise<User> {
        if (!email || !password) {
          throw new AppError('Bad Request: Email and password are required', 400);
        }
        const user = await userRepository.findOne({ email });
        if (!user) {
          throw new AppError('User not found', 404);
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new AppError('Invalid password', 401);
        }
    
        return user;
      }

      async grantPermissions(userId: string, role: string, permissionId: ObjectId): Promise<User[]> {

        let updatedUsers: User[] = []
        console.log(userId,role,permissionId)
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
    
        const allUserByRole = await userRepository.find({ role });
        if (allUserByRole.length === 0) {
          throw new AppError('No users found with the specified role', 404);
        }

        console.log("user role",allUserByRole)
    
        for(let i = 0;i<allUserByRole.length;i++){
           updatedUsers = await userRepository.updateMany({ role:role }, { $push: { permissions: permissionId } } as any);
          if (updatedUsers.length === 0) {
            throw new AppError('No users updated', 500);
          }
        }
        return updatedUsers;
  
      }

      async removePermissions(userId: string, role: string, permissionId: ObjectId): Promise<User[]> {

        let updatedUsers: User[] = []
        console.log(userId,role,permissionId)
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
    
        const allUserByRole = await userRepository.find({ role });
        if (allUserByRole.length === 0) {
          throw new AppError('No users found with the specified role', 404);
        }

        console.log("user role",allUserByRole)
    
        for(let i = 0;i<allUserByRole.length;i++){
           updatedUsers = await userRepository.updateMany({ role:role }, { $pull: { permissions: permissionId } } as any);
          if (updatedUsers.length === 0) {
            throw new AppError('No users updated', 500);
          }
        }
        return updatedUsers;
      }

      async getPermissionByUserId(userId: string): Promise<any> {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        return user.permissions;
      }

      async countUsers(): Promise<number> {
        const count = await userRepository.countDocuments();
        return count;
      }

      async frezeUser(userId: string): Promise<User> {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        }
        const updatedUser = await userRepository.findOneAndUpdate({ _id: userId }, { isfreeze: true });
        if (!updatedUser) {
          throw new AppError('User not updated', 500);
        }
        return updatedUser;
      }

      async unfrezeUser(userId: string): Promise<User> {
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new AppError('User not found', 404);
        } 
        const updatedUser = await userRepository.findOneAndUpdate({ _id: userId }, { isfreeze: false });
        if (!updatedUser) {
          throw new AppError('User not updated', 500);
        }
        return updatedUser;
      }


      
}