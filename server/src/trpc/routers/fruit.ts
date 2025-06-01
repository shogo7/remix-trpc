// server/src/trpc/routers/fruitRouter.ts を修正
import { t } from "../trpc.js";
import * as fruitController from "../../controllers/fruit.js";
import { z } from "zod";

export const fruitRouter = t.router({
  getFruits: t.procedure.query(async () => {
    // 戻り値の型を明示的に指定
    return await fruitController.getAllFruits();
  }),
  getFruitById: t.procedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      // 戻り値の型を明示的に指定
      return await fruitController.getFruitById(input);
    }),
});
