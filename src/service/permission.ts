import { Action, Permission } from "../model/interface/permission";
import { PermissionRepository } from "../repository/permission";
import { AppError } from "../utils/appError";
const permissionRepository = new PermissionRepository();
export class PermissionService {
    async create(category: string, action: [Action]): Promise<Permission> {
        const permission = await permissionRepository.create({ category, action });
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

}