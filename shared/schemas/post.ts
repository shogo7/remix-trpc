// shared/schemas/post.ts
import { z } from "zod";

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "タイトルは3文字以上で入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  content: z
    .string()
    .min(1, "内容は必ず入力してください")
    .max(1000, "内容は1000文字以内で入力してください"),
});

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
