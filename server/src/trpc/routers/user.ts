// server/src/trpc/routers/userRouter.ts
import { t } from "../trpc.js";
import { z } from "zod";
import * as userController from "../../controllers/user.js";
import jwt from "jsonwebtoken";
import type { Response as ExpressResponse } from "express";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
console.log("JWT_SECRET:", process.env.JWT_SECRET); // 安全な環境でのみ

export const userRouter = t.router({
  register: t.procedure
    .input(z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return await userController.register(input.username, input.password);
    }),
  login: t.procedure
    .input(z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const user = await userController.login(input.username, input.password);
      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const res = ctx.res as ExpressResponse;
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { id: user._id, username: user.username };
    }),
  logout: t.procedure.mutation(({ ctx }) => {
    const res = ctx.res as ExpressResponse;
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return { success: true };
  }),
  me: t.procedure.query(({ ctx }) => {
    if (!ctx.user) throw new Error("未ログインです");
    return ctx.user;
  }),
});
