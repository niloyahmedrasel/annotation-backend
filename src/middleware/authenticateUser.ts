// src/middleware/authenticateUser.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  permissions: string[];
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction):any => {
  const token = req.headers.authorization?.split(" ")[1];
 console.log("here")
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("also here")

  try {
    const decoded = jwt.verify(token, "secret") as JwtPayload;
    console.log(decoded);
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
