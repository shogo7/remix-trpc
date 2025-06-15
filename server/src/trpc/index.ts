// server/src/trpc/index.ts
import { t } from "./trpc.js";
import { musicRouter } from "./routers/music.js";
import { bookRouter } from "./routers/book.js";
import { fruitRouter } from "./routers/fruit.js";
import { postRouter } from "./routers/post.js";
import { userRouter } from "./routers/user.js";

export const appRouter = t.router({
  music: musicRouter,
  book: bookRouter,
  fruit: fruitRouter,
  post: postRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
