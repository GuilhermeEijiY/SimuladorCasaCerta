import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/app-error";

export interface AuthPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError(401, "Token não fornecido");
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.userId = payload.userId;
    next();
  } catch {
    throw new AppError(401, "Token inválido");
  }
}
