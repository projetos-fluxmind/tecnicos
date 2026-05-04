import { Router } from "express";

export const authRouter = Router();

authRouter.post("/login", (_request, response) => {
  response.status(501).json({ message: "Login será implementado na parte de autenticação." });
});

authRouter.get("/me", (_request, response) => {
  response.status(501).json({ message: "Sessão do usuário será implementada na parte de autenticação." });
});
