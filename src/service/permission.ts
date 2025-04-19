import { Action, Permission } from "../model/interface/permission";
import { PermissionRepository } from "../repository/permission";
import { AppError } from "../utils/appError";
import { PermissionModel } from "../model/permission";
import { UserRepository } from "../repository/user";
const permissionRepository = new PermissionRepository();
const userRepository = new UserRepository();
export class PermissionService {
    async create(category: string, action: [Action]): Promise<Permission> {
        const permission = await permissionRepository.create({ category, action });
        if (!permission) throw new AppError("Permission not created", 500);
        return permission;
    }

    async createCategory(category: string): Promise<Permission> {
        const permission = await permissionRepository.create({ category });
        if (!permission) throw new AppError("Permission not created", 500);
        return permission;
    }

    async getAllPermissions(): Promise<Permission[]> {
        const permissions = await permissionRepository.find({});
        if (!permissions) throw new AppError("Permissions not found", 404);
        return permissions;
    }



    async getPermissionById(permissionId: string): Promise<Permission> {
        const permission = await permissionRepository.findById(permissionId);
        if (!permission) throw new AppError("Permission not found", 404);
        return permission;
    }

    async getPermissionsByRole(): Promise<Record<string, string[]>> {
        
        const roles = {
          superAdmin: 'Super Admin',
          annotator: 'Annotator',
          docOrganizer: 'Doc Organizer',
          reviewer: 'Reviewer'
        };
      
        const result: Record<string, string[]> = {
          superAdmin: [],
          annotator: [],
          docOrganizer: [],
          reviewer: []
        };
      

        for (const key in roles) {
          const users = await userRepository.find({ role: roles[key as keyof typeof roles] });
      
          const permissionIds = users.flatMap(user => user.permissions.map((id: any) => id.toString()));
          result[key] = [...new Set(permissionIds)];
        }
      
        return result;
      }
      

    async update(permissionId: string, category: string, action: [Action]): Promise<Permission> {
        const permission = await permissionRepository.findById(permissionId);
        if (!permission) throw new AppError("Permission not found", 404);
        const updatedPermission = await permissionRepository.findOneAndUpdate(permissionId, { category, action });
        if (!updatedPermission) throw new AppError("Permission not updated", 500);
        return updatedPermission;
    }

    async delete(permissionId: string): Promise<Permission> {
        const permission = await permissionRepository.findById(permissionId);
        if (!permission) throw new AppError("Permission not found", 404);
        const deletedPermission = await permissionRepository.deleteById(permissionId);
        if (!deletedPermission) throw new AppError("Permission not deleted", 500);
        return deletedPermission;
    }

    async addAction(categoryName: string, action: Action): Promise<Permission> {
        console.log(categoryName);
        const permission = await permissionRepository.findOneAndUpdate({ category: categoryName }, { $push: { action: action } }as any);
        if (!permission) throw new AppError("Permission not found", 404);
        return permission;
    }

    async countPermissions(): Promise<number> {
        const result = await PermissionModel.aggregate([
            {
                $project: {
                    actionCount: { $size: "$action" } 
                }
            },
            {
                $group: {
                    _id: null,
                    totalActions: { $sum: "$actionCount" } 
                }
            }
        ]);
    
        return result.length > 0 ? result[0].totalActions : 0; 
    }
    

}