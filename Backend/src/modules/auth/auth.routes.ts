import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "./auth.dto";

const router = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), (req, res, next) => {
  controller.register(req, res).catch(next);
});

router.post("/login", validate(loginSchema), (req, res, next) => {
  controller.login(req, res).catch(next);
});

router.get("/me", authMiddleware, (req, res, next) => {
  controller.me(req, res).catch(next);
});

export { router as authRoutes };
