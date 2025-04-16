// server/src/trpc/context.ts
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    user: req.user,
  };
}

export type Context = ReturnType<typeof createContext>;
