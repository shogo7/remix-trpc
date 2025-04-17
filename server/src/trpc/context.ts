// server/src/trpc/context.ts
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export function createContext({ req, res }: CreateExpressContextOptions) {
  const csrfHeader = req.headers['x-csrf-token'];
  const csrfCookie = req.cookies['csrf-token'];


  if (req.method !== 'GET' && csrfHeader !== csrfCookie) {
    throw new Error('CSRF token mismatch');
  }

  return {
    req,
    res,
    user: req.user,
  };
}

export type Context = ReturnType<typeof createContext>;
