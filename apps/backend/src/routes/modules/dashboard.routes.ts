import { Router } from "express";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", (_request, response) => {
  response.json({
    totalGeral: 0,
    categorias: {
      alimentacao: 0,
      abastecimento: 0,
      manutencao: 0,
      hospedagem: 0,
      recargasFlash: 0
    }
  });
});

dashboardRouter.get("/trends", (_request, response) => {
  response.json({ data: [] });
});

dashboardRouter.get("/rankings", (_request, response) => {
  response.json({ data: [] });
});
