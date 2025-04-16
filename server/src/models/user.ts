import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const dbUrl = new URL('../db.json', import.meta.url); 

// Zodスキーマと型を一体化
export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(1),
  password: z.string().min(1),
});
export type User = z.infer<typeof UserSchema>;

async function readDB(): Promise<{ users: User[] }> {
  try {
    const data = await fs.readFile(dbUrl, 'utf-8');
    if (!data.trim()) return { users: [] };

    const parsed = JSON.parse(data);
    // バリデーション（必要であれば）
    if (!Array.isArray(parsed.users)) return { users: [] };

    // データ型保証（オプション）
    const validatedUsers = parsed.users.map((u: any) => UserSchema.parse(u));
    return { users: validatedUsers };
  } catch (err: any) {
    if (err.code === 'ENOENT') return { users: [] };
    throw err;
  }
}

async function writeDB(data: { users: User[] }) {
  await fs.writeFile(dbUrl, JSON.stringify(data, null, 2), 'utf-8');
}

export async function registerUser(username: string, password: string): Promise<User> {
  const db = await readDB();

  if (db.users.find((u) => u.username === username)) {
    throw new Error('ユーザー名はすでに使われています');
  }

  const user = UserSchema.parse({
    id: nanoid(),
    username,
    password,
  });

  db.users.push(user);
  await writeDB(db);
  return user;
}

export async function loginUser(username: string, password: string): Promise<User> {
  const db = await readDB();
  const user = db.users.find((u) => u.username === username && u.password === password);

  if (!user) {
    throw new Error('ユーザー名またはパスワードが間違っています');
  }

  return user;
}
