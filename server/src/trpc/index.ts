// server/src/trpc/index.ts
import { t } from "./trpc.js";
import { fruitRouter } from "./routers/fruit.js";
import { userRouter } from "./routers/user.js";
import { postRouter } from "./routers/post.js";
import { bookRouter } from "./routers/book.js";

export const appRouter = t.router({
  fruit: fruitRouter,
  user: userRouter,
  post: postRouter,
  book: bookRouter,
});

export type AppRouter = typeof appRouter;
