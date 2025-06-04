// server/src/trpc/isAuthed.ts

import { TRPCError } from "@trpc/server";
import { t } from "./trpc.js";

export const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});
