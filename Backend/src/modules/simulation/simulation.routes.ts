import { Router } from "express";
import { SimulationController } from "./simulation.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createSimulationSchema } from "./simulation.dto";

const router = Router();
const controller = new SimulationController();

router.use(authMiddleware);

router.post("/", validate(createSimulationSchema), (req, res, next) => {
  controller.create(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  controller.list(req, res).catch(next);
});

export { router as simulationRoutes };
