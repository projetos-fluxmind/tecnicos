import { Router } from "express";
import { emptyPaginatedResponse, listQuerySchema } from "../../shared/pagination.js";

export const gastosRouter = Router();

const modules = [
  "alimentacao",
  "abastecimento",
  "manutencao",
  "hospedagem",
  "recargas-flash"
];

for (const moduleName of modules) {
  gastosRouter.get(`/${moduleName}`, (request, response) => {
    const query = listQuerySchema.parse(request.query);
    response.json(emptyPaginatedResponse(query));
  });

  gastosRouter.post(`/${moduleName}`, (_request, response) => {
    response.status(501).json({ message: `Criação de ${moduleName} será implementada na parte de lançamentos.` });
  });

  gastosRouter.get(`/${moduleName}/export`, (_request, response) => {
    response.status(501).json({ message: `Exportação de ${moduleName} será implementada na parte de exportação.` });
  });
}
