
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/user";
import dotenv from "dotenv";
dotenv.config();
const userRepository = new UserRepository()
interface JwtPayload {
  id: string;
  role: string;
  permissions: string[];
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token)
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = decoded;
    const user = await userRepository.findById(decoded.id);

    console.log("user",user)
    if (user?.isfreeze) {
      res.status(401).json({ message: "You have been freezed by admin" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

