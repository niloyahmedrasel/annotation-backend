import { Request,Response,NextFunction } from "express";;

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): any => {
      console.log((req as any).user);
      if (!(req as any).user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      if (!allowedRoles.includes((req as any).user.role)) {
        return res.status(403).json({ message: "Forbidden: You do not have the required role" });
      }
  
      next();
    };
  };
  