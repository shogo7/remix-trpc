// server/src/trpc/routers/book.ts
import * as BookController from "../../controllers/book.js";
import { z } from "zod";
import { t } from "../trpc.js";
import { createBookSchema } from "@shared/schemas/book.js";

export const bookRouter = t.router({
  getAll: t.procedure.query(() => {
    return BookController.getAllBooks();
  }),
  getById: t.procedure
    .input(z.string().min(1, "IDを指定してください"))
    .query(({ input }) => {
      return BookController.getBookById(input);
    }),

  create: t.procedure.input(createBookSchema).mutation(({ input }) => {
    return BookController.createBook(input);
  }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return BookController.updateBook(id, data);
    }),
  delete: t.procedure.input(z.string()).mutation(({ input }) => {
    return BookController.deleteBook(input);
  }),
});
