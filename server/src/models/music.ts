import mongoose, { Schema, Types, Document, Model } from "mongoose";
import { createMusicSchema } from "@shared/schemas/music.js";
import { zodToMongooseSchema } from "~/utils/zod-to-mongoose.js";

/* ─── Zod→Mongoose 変換 ─── */
const zodSchema = zodToMongooseSchema(createMusicSchema);

/* ─── スキーマ定義 ─── */
const musicMongooseSchema = new Schema(
  {
    ...zodSchema.obj,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ─── インデックス定義 ─── */
musicMongooseSchema.index({ userId: 1 });
musicMongooseSchema.index({ title: 1 });
musicMongooseSchema.index({ artist: 1 });
musicMongooseSchema.index({ genre: 1 });
musicMongooseSchema.index({ createdAt: -1 });

/* ─── 型定義 ─── */
type BaseMusic = mongoose.InferSchemaType<typeof musicMongooseSchema>;

export interface MusicDocument extends BaseMusic, Document {
  userId: Types.ObjectId;
}

export const Music: Model<MusicDocument> = mongoose.model<MusicDocument>(
  "Music",
  musicMongooseSchema
);
