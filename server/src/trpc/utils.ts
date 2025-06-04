// server/src/trpc/utils.ts
import { t } from "./trpc.js";
import { isAuthed } from "./isAuthed.js";

export const protectedProcedure = t.procedure.use(isAuthed);
