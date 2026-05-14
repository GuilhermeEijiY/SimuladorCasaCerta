import { Request, Response } from "express";
import { SimulationService } from "./simulation.service";

const simulationService = new SimulationService();

export class SimulationController {
  async create(req: Request, res: Response) {
    const result = await simulationService.execute(req.userId!, req.body);
    res.status(201).json({ simulation: result });
  }

  async list(req: Request, res: Response) {
    const simulations = await simulationService.list(req.userId!);
    res.json({ simulations });
  }
}
