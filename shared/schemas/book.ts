// shared/schemas/book.ts
import { z } from "zod";

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
});

export const createBookSchema = z.object({
  title: z
    .string()
    .min(3, "タイトルは3文字以上で入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  content: z
    .string()
    .min(1, "内容は必ず入力してください")
    .max(1000, "内容は1000文字以内で入力してください"),
});


export type Book = z.infer<typeof bookSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;