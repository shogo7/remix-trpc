// shared/schemas/music.ts

import { z } from "zod";

// 基本となる音楽スキーマ
const baseMusicSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().min(1).max(100),
  album: z.string().max(100).optional(),
  genre: z.string().max(50).optional(),
  releaseYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  duration: z.number().min(0).optional(),
  url: z.string().url().optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean(),
});

// `.strip()` 付きの全フィールド付きスキーマ（MongoDBからの取り込み用）
export const MusicSchema = baseMusicSchema
  .extend({
    _id: z.string(), // ObjectIdをstringに変換して扱う
    createdAt: z.date(), // サーバー側も Client 側も Date 型のまま（superjsonを想定）
    updatedAt: z.date(),
    userId: z.string().min(1),
  })
  .strip(); // vなどを取り除く

// 作成用スキーマ（基本スキーマをそのまま使用）
export const createMusicSchema = baseMusicSchema;

// 更新用スキーマ（基本スキーマの全フィールドをオプショナルにし、IDを追加）
export const updateMusicSchema = baseMusicSchema.partial().extend({
  id: z.string().min(1, "IDを指定してください"),
});

// TypeScriptの型定義
export type CreateMusicType = z.infer<typeof createMusicSchema>;
export type UpdateMusicType = z.infer<typeof updateMusicSchema>;

export type MusicType = z.infer<typeof MusicSchema>;
