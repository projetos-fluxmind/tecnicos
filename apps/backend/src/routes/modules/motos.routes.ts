import { Router } from "express";
import { emptyPaginatedResponse, listQuerySchema } from "../../shared/pagination.js";

export const motosRouter = Router();

motosRouter.get("/", (request, response) => {
  const query = listQuerySchema.parse(request.query);
  response.json(emptyPaginatedResponse(query));
});

motosRouter.post("/", (_request, response) => {
  response.status(501).json({ message: "Cadastro de motos será implementado na parte de cadastros." });
});

motosRouter.put("/:id", (_request, response) => {
  response.status(501).json({ message: "Atualização de motos será implementada na parte de cadastros." });
});
