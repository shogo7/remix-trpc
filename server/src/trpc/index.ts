// server/src/trpc/index.ts

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { fruits } from "../models/fruit.js";
import superjson from "superjson";
import * as userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import type { Context } from "./context.js"; 
import type { Response as ExpressResponse } from 'express';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getFruits: t.procedure.query(() => {
    return fruits;
  }),
  getFruitById: t.procedure.input(z.number()).query((opts) => {
    const fruit = fruits.find((f) => f.id === opts.input);
    if (!fruit) throw new Error("Not found");
    return fruit;
  }),
  user: t.router({
    register: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        return await userModel.registerUser(input.username, input.password);
      }),
    login: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await userModel.loginUser(input.username, input.password);

        // JWT発行
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        // Cookieにセット
        const res = ctx.res as ExpressResponse;
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: false, // 本番ではtrueにする（HTTPSのみ）
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { id: user.id, username: user.username };
      }),
    me: t.procedure.query(({ ctx }) => {
      if (!ctx.user) throw new Error("未ログインです");
      return ctx.user;
    }),
  }),
});

export type AppRouter = typeof appRouter;
