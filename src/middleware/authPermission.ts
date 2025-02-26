import { Request, Response, NextFunction } from "express";


export const authorizePermissions = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!(req as any).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const hasPermission = requiredPermissions.every(permission =>
        req.user!.permissions.includes(permission)
      );
  
      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
      }
  
      next();
    };
  };
  
  