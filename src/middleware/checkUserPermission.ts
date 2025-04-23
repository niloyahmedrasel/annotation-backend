import { NextFunction, Request, Response } from "express";
import { PermissionRepository } from "../repository/permission";
import { UserRepository } from "../repository/user";
import { ObjectId } from "mongoose";

const permissionRepository = new PermissionRepository();
const userRepostiory = new UserRepository();

export const checkUserPermission = (actionName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const requestedUser = (req as any).user;
        
        const user = await userRepostiory.findById(requestedUser.id);

        if(!user){
            res.status(403).json({ message: "User not found" });
            return;
        }

        const userPermission = await permissionRepository.findOne({ "action.name": actionName });

        const action = userPermission?.action.find(act => act.name === actionName);

        if (!action) {
            res.status(403).json({ message: "Action not found in permission" });
            return;
        }

        const userHasPermission = user.permissions.some(permission => permission.toString() === (action._id as ObjectId).toString());
        if (!userHasPermission) {
            res.status(403).json({ message: "You do not have permission for this action" });
            return;
        }

        next();
    };
};

