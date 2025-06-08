// server/src/trpc/routers/music.ts

import { t } from "../trpc.js";
import { createMusicSchema, updateMusicSchema } from "@shared/schemas/music.js";
import { protectedProcedure } from "../utils.js";
import * as musicController from "../../controllers/music.js";
import { z } from "zod";

export const musicRouter = t.router({
  create: protectedProcedure
    .input(createMusicSchema)
    .mutation(async ({ input, ctx }) => {
      return await musicController.createMusic(input, { _id: ctx.user.id });
    }),

  update: protectedProcedure
    .input(updateMusicSchema)
    .mutation(async ({ input, ctx }) => {
      return await musicController.updateMusic(input, { _id: ctx.user.id });
    }),

  delete: protectedProcedure
    .input(z.string().min(1, "IDを指定してください"))
    .mutation(async ({ input, ctx }) => {
      return await musicController.deleteMusic(input, { _id: ctx.user.id });
    }),

  getAll: t.procedure.query(async () => {
    return await musicController.getAllMusic();
  }),

  getById: t.procedure
    .input(z.string().min(1, "IDを指定してください"))
    .query(async ({ input }) => {
      return await musicController.getMusicById(input);
    }),

  search: t.procedure
    .input(z.string().min(1, "検索クエリを入力してください"))
    .query(async ({ input }) => {
      return await musicController.searchMusic(input);
    }),
});
