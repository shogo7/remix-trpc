import { User } from "../models/user.js";
import { nanoid } from "nanoid";

export async function register(username: string, password: string) {
  const existing = await User.findOne({ username });
  if (existing) {
    throw new Error("ユーザー名はすでに使われています");
  }

  const user = new User({ username, password });
  await user.save();
  return user;
}

export async function login(username: string, password: string) {
  const user = await User.findOne({ username, password });
  if (!user) {
    throw new Error("ユーザー名またはパスワードが間違っています");
  }

  return user;
}
