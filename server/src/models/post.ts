// server/src/models/post.ts
import { Post, CreatePostInput } from "../../../shared/schemas/post.js";

// メモリ内のデータストアとして配列を使用
const posts: Post[] = [];

export const PostModel = {
  getAll: () => posts,
  getById: (id: string) => posts.find((post) => post.id === id),
  create: (post: CreatePostInput) => {
    const newPost: Post = {
      id: Math.random().toString(36).substring(7),
      ...post,
      createdAt: new Date(),
    };
    posts.push(newPost);
    return newPost;
  },
  update: (id: string, post: Partial<CreatePostInput>) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    posts[index] = { ...posts[index], ...post };
    return posts[index];
  },
  delete: (id: string) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
  },
};
