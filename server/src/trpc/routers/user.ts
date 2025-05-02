// server/src/trpc/routers/userRouter.ts
import { t } from "../trpc.js";
import * as userController from "../../controllers/user.js";
import jwt from "jsonwebtoken";
import type { Response as ExpressResponse } from "express";
import { loginSchema, registerSchema } from "@shared/schemas/user.schema.js";
import { protectedProcedure } from '../utils.js';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
console.log("JWT_SECRET:", process.env.JWT_SECRET); // 安全な環境でのみ

export const userRouter = t.router({
  register: t.procedure.input(registerSchema).mutation(async ({ input }) => {
    return await userController.register(input.username, input.password);
  }),
  login: t.procedure.input(loginSchema).mutation(async ({ input, ctx }) => {
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
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
