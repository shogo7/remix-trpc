// server/src/trpc/routers/post.ts
import * as PostController from "../../controllers/post.js";
import { z } from "zod";
import { t } from "../trpc.js";
import { createPostSchema } from "@shared/schemas/post.js";

export const postRouter = t.router({
  getAll: t.procedure.query(() => {
    return PostController.getAllPosts(); 
  }),
  getById: t.procedure
  .input(z.string().min(1, "ID を指定してください"))
  .query(({ input }) => {
    return PostController.getPostById(input);
  }),
  create: t.procedure
    .input(createPostSchema)
    .mutation(({ input }) => {
      return PostController.createPost(input);
    }),
  update: t.procedure
    .input(z.object({ id: z.string(), title: z.string().optional(), content: z.string().optional() }))
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return PostController.updatePost(id, data);
    }),
  delete: t.procedure.input(z.string()).mutation(({ input }) => {
    return PostController.deletePost(input);
  }),
});
