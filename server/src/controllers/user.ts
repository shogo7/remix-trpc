import { User } from "../models/user.js";
import type { UserType } from "../models/user.js";

import { nanoid } from "nanoid";

export const register = async (
  username: string,
  password: string
): Promise<UserType> => {
  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("ユーザー名はすでに使われています");
  }

  const user = new User({ username, password });
  await user.save();
  return {
    ...user.toObject(),
    _id: user._id.toString(), // ObjectIdをstringに変換
  };
};

export const login = async (
  username: string,
  password: string
): Promise<UserType> => {
  const user = await User.findOne({ username, password });
  if (!user) {
    throw new Error("ユーザー名またはパスワードが間違っています");
  }

  return {
    ...user.toObject(),
    _id: user._id.toString(), // ObjectIdをstringに変換
  };
}
