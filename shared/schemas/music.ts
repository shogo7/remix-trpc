// shared/schemas/music.ts

import { z } from "zod";
import mongoose, { Types } from "mongoose"; // ← mongoose.Document を使うために mongoose をインポート

/* ───① ObjectId→string を再帰的に行う関数 ─── */
const convertObjectIdsToStrings = (data: unknown): unknown => {
  // ── Step A: Mongoose の Document インスタンスなら toObject() を呼び出して中身を取り出す ──
  if (data instanceof mongoose.Document) {
    // `data.toObject()` で「純粋なプレーンオブジェクト」を得てから再帰
    return convertObjectIdsToStrings(data.toObject());
  }

  // ── Step B: 配列なら中身を再帰的に処理 ──
  if (Array.isArray(data)) {
    return data.map(convertObjectIdsToStrings);
  }

  // ── Step C: Mongoose の ObjectId を文字列化 ──
  if (data instanceof Types.ObjectId) {
    return data.toString();
  }

  // ── Step D: Date はそのまま（SuperJSON を使うため Date 型を維持） ──
  if (data instanceof Date) {
    return data;
  }

  // ── Step E: オブジェクト（かつ null ではない）なら各キーを再帰的に処理 ──
  if (data && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const key in data as Record<string, unknown>) {
      result[key] = convertObjectIdsToStrings(
        (data as Record<string, unknown>)[key]
      );
    }
    return result;
  }

  // ── Step F: それ以外の型（string, number, boolean, null, undefined など）はそのまま返す ──
  return data;
};

/* ───② BaseMusic：音楽の共通フィールド ─── */
const BaseMusic = z.object({
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

/* ───③ Create/Update 用のスキーマ ─── */
export const createMusicSchema = BaseMusic;

export const updateMusicSchema = BaseMusic.partial().extend({
  // 更新時は「_id」を必須フィールドとして渡す
  _id: z.string().min(1, "_idを指定してください"),
});

/* ───④ DBレスポンス用スキーマ：
“preprocess” で ObjectId を文字列化しつつ、
BaseMusic を拡張（DRY） ─── */
export const musicResponseSchema = z.preprocess(
  convertObjectIdsToStrings,
  BaseMusic.extend({
    _id: z.string().min(1), // ObjectId → string
    userId: z.string().min(1), // ObjectId → string
    createdAt: z.date(), // Date のまま通る
    updatedAt: z.date(), // Date のまま通る
  })
);

/* ───⑤ TS の型定義 ─── */
export type CreateMusicType = z.infer<typeof createMusicSchema>;
export type UpdateMusicType = z.infer<typeof updateMusicSchema>;
export type MusicResponseType = z.infer<typeof musicResponseSchema>;
