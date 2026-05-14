import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: "Dados inválidos", details: err.errors });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Erro interno do servidor" });
}
