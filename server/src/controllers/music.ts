// server/src/controllers/music.ts

import { Music } from "../models/music.js";
import {
  type CreateMusicType,
  type UpdateMusicType,
  musicResponseSchema,
  type MusicResponseType,
} from "@shared/schemas/music.js";
import type { UserType } from "@shared/schemas/user.js";
import { throwInternalError } from "../utils/error.js";
import { findByIdAndUserOrThrow } from "../utils/find-owned.js"; // パスは適宜調整
import { Types } from "mongoose";

export const createMusic = async (
  input: CreateMusicType,
  user: Pick<UserType, "_id">
): Promise<MusicResponseType> => {
  try {
    const musicData = {
      ...input,
      userId: user._id,
    };
    const music = await Music.create(musicData);
    if (!music) {
      return throwInternalError(null, "Failed to create music");
    }
    return musicResponseSchema.parse(music);
  } catch (err) {
    return throwInternalError(err, "Failed to create music");
  }
};

// ✅ controllers/music.ts
export const getAllMusic = async (): Promise<MusicResponseType[]> => {
  try {
    // 1) Mongoose から取得（__v など余計なフィールドを含む）
    const musics = await Music.find().sort({ createdAt: -1 }).lean();

    // 2) preprocess 経由で ObjectId→string になるので、
    //    そのまま parse() するだけでOK
    return musics
      .map((music) => musicResponseSchema.safeParse(music))
      .filter((result) => result.success)
      .map((result) => result.data);
  } catch (err) {
    return throwInternalError(err, "Failed to fetch all music");
  }
};

export const getMusicById = async (id: string) => {
  try {
    const music = await Music.findById(id).lean();
    if (!music) {
      return throwInternalError(null, "Music not found");
    }
    return musicResponseSchema.parse(music);
  } catch (err) {
    return throwInternalError(err, "Failed to fetch music");
  }
};

export const searchMusic = async (query: string) => {
  try {
    const musics = await Music.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { artist: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return musics.map((doc) => musicResponseSchema.parse(doc));
  } catch (err) {
    return throwInternalError(err, "Failed to search music");
  }
};

export const updateMusic = async (
  input: UpdateMusicType,
  user: Pick<UserType, "_id">
) => {
  try {
    const { _id, ...updateData } = input;
    // 汎用関数でチェック：存在確認 & 所有者チェック（例外投げ）
    await findByIdAndUserOrThrow(
      Music,
      _id,
      new Types.ObjectId(user._id),
      "音楽"
    );

    // 更新処理
    const updatedMusic = await Music.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedMusic) {
      return throwInternalError(null, "音楽の更新に失敗しました");
    }

    return musicResponseSchema.parse(updatedMusic);
  } catch (err) {
    return throwInternalError(err, "音楽の更新に失敗しました");
  }
};

export const deleteMusic = async (
  id: string,
  user: Pick<{ _id: string }, "_id">
): Promise<MusicResponseType> => {
  try {
    // 汎用関数でチェック：存在確認 & 所有者チェック（例外投げ）
    const found = await findByIdAndUserOrThrow(
      Music,
      id,
      new Types.ObjectId(user._id),
      "音楽"
    );

    const result = await Music.deleteOne({ _id: found._id }).lean();
    if (result.deletedCount === 0) {
      return throwInternalError(
        null,
        "削除に失敗しました",
        "INTERNAL_SERVER_ERROR"
      );
    }
    // 削除後も parse() を通すことで、返却するデータはすべて文字列化・不要フィールド除去済み
    return musicResponseSchema.parse(found);
  } catch (err) {
    return throwInternalError(
      err,
      "音楽の削除に失敗しました",
      "INTERNAL_SERVER_ERROR"
    );
  }
};
