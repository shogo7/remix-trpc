// server/src/trpc/index.ts

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import superjson from "superjson";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET!;
import type { Context } from "./context.js";
import type { Response as ExpressResponse } from "express";
import * as userController from "../controllers/user.js";
import * as fruitController from "../controllers/fruit.js";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const appRouter = t.router({
  getFruits: t.procedure.query(async () => {
    return await fruitController.getAllFruits();
  }),
  getFruitById: t.procedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      return await fruitController.getFruitById(input);
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
        return await userController.register(input.username, input.password);
      }),
    login: t.procedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await userController.login(input.username, input.password);

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
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { id: user.id, username: user.username };
      }),
    logout: t.procedure.mutation(({ ctx }) => {
      const res = ctx.res as ExpressResponse;

      res.clearCookie("jwt", {
        httpOnly: true,
        secure: false, // 本番はtrue
        sameSite: "strict",
      });

      return { success: true };
    }),

    me: t.procedure.query(({ ctx }) => {
      if (!ctx.user) throw new Error("未ログインです");
      return ctx.user;
    }),
  }),
});

export type AppRouter = typeof appRouter;
