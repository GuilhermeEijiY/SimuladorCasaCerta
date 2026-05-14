import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { simulationRoutes } from "../modules/simulation/simulation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/simulations", simulationRoutes);

export { router };
