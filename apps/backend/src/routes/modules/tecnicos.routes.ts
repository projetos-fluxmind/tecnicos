import { Router } from "express";
import { emptyPaginatedResponse, listQuerySchema } from "../../shared/pagination.js";

export const tecnicosRouter = Router();

tecnicosRouter.get("/", (request, response) => {
  const query = listQuerySchema.parse(request.query);
  response.json(emptyPaginatedResponse(query));
});

tecnicosRouter.post("/", (_request, response) => {
  response.status(501).json({ message: "Cadastro de técnicos será implementado na parte de cadastros." });
});

tecnicosRouter.put("/:id", (_request, response) => {
  response.status(501).json({ message: "Atualização de técnicos será implementada na parte de cadastros." });
});

tecnicosRouter.delete("/:id", (_request, response) => {
  response.status(501).json({ message: "Desativação de técnicos será implementada na parte de cadastros." });
});
