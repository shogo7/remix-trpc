// server/src/middleware/csrf.ts
import { randomBytes } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = randomBytes(32).toString('hex');

  // サーバーが CSRF トークンをクッキーにセット
  res.cookie('csrf-token', token, {
    httpOnly: false, // JS からアクセス可能にする
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  // 次の middleware / handler で使えるようにする
  req.csrfToken = token;

  next();
}
