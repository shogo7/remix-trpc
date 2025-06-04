// server/src/controllers/music.ts

import { Music } from "../models/music.js";
import {
  type CreateMusicType,
  type UpdateMusicType,
  type MusicType,
  MusicSchema,
} from "@shared/schemas/music.js";
import type { UserType } from "@shared/schemas/user.js";
import { throwInternalError } from "../utils/error.js";

export const createMusic = async (
  input: CreateMusicType,
  user: Pick<UserType, "_id">
) => {
  try {
    const music = await Music.create({
      ...input,
      userId: user._id,
    });

    if (!music) {
      return throwInternalError(null, "Failed to create music");
    }

    return {
      ...music.toObject(),
      _id: music._id.toString(),
    };
  } catch (err) {
    return throwInternalError(err, "Failed to create music");
  }
};

// ✅ controllers/music.ts
export const getAllMusic = async (): Promise<MusicType[]> => {
  try {
    // ① lean() で結果をプレーンオブジェクト配列で取得
    const musics = await Music.find().sort({ createdAt: -1 }).lean();

    // ② .strip() したスキーマで parse すれば、余計なキーは自動的に削除される
    return musics.map((music) =>
      MusicSchema.parse({
        ...music,
        _id: music._id.toString(), // 必ず文字列に変換
      })
    );
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
    return {
      ...music,
      _id: music._id.toString(),
    };
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

    return musics.map((music) => ({
      ...music,
      _id: music._id.toString(),
    }));
  } catch (err) {
    return throwInternalError(err, "Failed to search music");
  }
};

export const updateMusic = async (
  input: UpdateMusicType,
  user: Pick<UserType, "_id">
) => {
  try {
    const { id, ...updateData } = input;

    // 音楽データの存在確認と所有者確認
    const music = await Music.findById(id);
    if (!music) {
      return throwInternalError(null, "音楽が見つかりません", "NOT_FOUND");
    }

    // 所有者チェック
    if (music.userId.toString() !== user._id.toString()) {
      return throwInternalError(
        null,
        "この音楽を更新する権限がありません",
        "FORBIDDEN"
      );
    }

    // 更新処理
    const updatedMusic = await Music.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updatedMusic) {
      return throwInternalError(null, "音楽の更新に失敗しました");
    }

    return {
      ...updatedMusic,
      _id: updatedMusic._id.toString(),
    };
  } catch (err) {
    return throwInternalError(err, "音楽の更新に失敗しました");
  }
};

export const deleteMusic = async (id: string, user: Pick<UserType, "_id">) => {
  try {
    // 音楽データの存在確認と所有者確認
    const music = await Music.findById(id);
    if (!music) {
      return throwInternalError(null, "音楽が見つかりません", "NOT_FOUND");
    }

    // 所有者チェック
    if (music.userId.toString() !== user._id.toString()) {
      return throwInternalError(
        null,
        "この音楽を削除する権限がありません",
        "FORBIDDEN"
      );
    }

    // 削除処理
    const deletedMusic = await Music.findByIdAndDelete(id).lean();
    if (!deletedMusic) {
      return throwInternalError(null, "音楽の削除に失敗しました");
    }

    return {
      ...deletedMusic,
      _id: deletedMusic._id.toString(),
    };
  } catch (err) {
    return throwInternalError(err, "音楽の削除に失敗しました");
  }
};
