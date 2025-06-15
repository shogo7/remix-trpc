// server/src/trpc/isAuthed.ts

import { TRPCError } from "@trpc/server";
import { t } from "./trpc.js";

export const isAuthed = t.middleware(({ ctx, next }) => {
  const user = ctx.user;
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  // 👇 ctx.user を NonNullable として次に渡す
  return next({
    ctx: {
      ...ctx,
      user, // これは NonNullable になっている
    },
  });
});
