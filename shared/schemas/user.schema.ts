// shared/schemas/user.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名は必須です"),
  password: z.string().min(1, "パスワードは必須です"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(1, "ユーザー名は必須です"),
  password: z.string().min(6, "パスワードは6文字以上にしてください"),
});
// スキーマから型を自動生成
export type RegisterInput = z.infer<typeof registerSchema>;
