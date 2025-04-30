// server/src/trpc/index.ts
import { t } from "./trpc.js";
import { fruitRouter } from "./routers/fruit.js";
import { userRouter } from "./routers/user.js";

export const appRouter = t.router({
  fruit: fruitRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
