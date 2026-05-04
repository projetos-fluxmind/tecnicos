import { Router } from "express";
import { authRouter } from "./modules/auth.routes.js";
import { dashboardRouter } from "./modules/dashboard.routes.js";
import { gastosRouter } from "./modules/gastos.routes.js";
import { motosRouter } from "./modules/motos.routes.js";
import { tecnicosRouter } from "./modules/tecnicos.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/gastos", gastosRouter);
apiRouter.use("/motos", motosRouter);
apiRouter.use("/tecnicos", tecnicosRouter);
