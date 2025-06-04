// server/src/models/music.ts
import mongoose, { Schema, Document } from "mongoose";
import type { MusicType } from "@shared/schemas/music.js";

// Mongooseのインターフェース
export interface IMusicDocument
  extends Omit<MusicType, "_id" | "createdAt" | "updatedAt">,
    Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Mongooseのスキーマ定義
const musicMongooseSchema = new Schema<IMusicDocument>(
  {
    title: { type: String, required: true, maxlength: 100 },
    artist: { type: String, required: true, maxlength: 100 },
    album: { type: String, maxlength: 100 },
    genre: { type: String, maxlength: 50 },
    releaseYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    duration: { type: Number, min: 0 },
    url: { type: String },
    description: { type: String, maxlength: 500 },
    isPublic: { type: Boolean, default: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// インデックスの設定
musicMongooseSchema.index({ userId: 1 });
musicMongooseSchema.index({ title: 1 });
musicMongooseSchema.index({ artist: 1 });
musicMongooseSchema.index({ genre: 1 });
musicMongooseSchema.index({ createdAt: -1 });

// モデルの作成
export const Music = mongoose.model<IMusicDocument>("Music", musicMongooseSchema);
