// server/types/express/index.d.ts
import type { User } from "../src/models/user.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "username">;
    }
  }
}
export {}; // ← モジュール化（これがないと global に作用しない）
