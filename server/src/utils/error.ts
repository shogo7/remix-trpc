import { TRPCError } from "@trpc/server";

type ErrorCode =
  | "INTERNAL_SERVER_ERROR"
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "FORBIDDEN";

export function throwInternalError(
  err: unknown,
  message: string,
  code: ErrorCode = "INTERNAL_SERVER_ERROR"
): never {
  console.error("予期せぬエラー:", err);
  throw new TRPCError({ code, message });
}
