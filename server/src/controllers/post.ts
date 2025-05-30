// server/src/controllers/post.ts

import { PostModel } from "../models/post.js";
import { Post } from "../../../shared/schemas/post.js";

export async function getAllPosts(): Promise<Post[]> {
  return PostModel.getAll();
}

export async function getPostById(id: string): Promise<Post | null> {
  return PostModel.getById(id) ?? null;
}

export async function createPost(data: {
  title: string;
  content: string;
}): Promise<Post> {
  return PostModel.create(data);
}

export async function updatePost(
  id: string,
  data: { title?: string; content?: string }
): Promise<Post | null> {
  return PostModel.update(id, data);
}

export async function deletePost(id: string): Promise<boolean> {
  return PostModel.delete(id);
}
