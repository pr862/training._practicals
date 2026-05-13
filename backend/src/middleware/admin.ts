import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/user";
import { AuthRequest } from "./auth";

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

