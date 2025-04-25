// server/src/trpc/routers/fruitRouter.ts
import { t } from "../trpc.js";
import * as fruitController from "../../controllers/fruit.js";
import { z } from "zod";

export const fruitRouter = t.router({
  getFruits: t.procedure.query(async () => {
    return await fruitController.getAllFruits();
  }),
  getFruitById: t.procedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      return await fruitController.getFruitById(input);
    }),
});
