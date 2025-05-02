// server/src/middleware/auth.ts
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
const JWT_SECRET = process.env.JWT_SECRET!;

export function attachUserFromJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        username: string;
      };
      req.user = { id: decoded.id, username: decoded.username };
    } catch (err) {
      console.error("JWT verification failed:", err);
      req.user = undefined;
    }
  } else {
    req.user = undefined;
  }

  next();
}
