import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@shared/schemas/user.schema";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = trpc.user.login.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await mutation.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: [["user", "me"]] });
      toast.success("ログイン成功！");
      navigate("/");
    } catch (err) {
      toast.error("ログイン失敗：" + (err as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className="border bg-input p-2 w-full focus-visible:ring-ring"
            type="text"
            placeholder="ユーザー名"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-destructive text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="border bg-input p-2 w-full focus-visible:ring-ring"
            type="password"
            placeholder="パスワード"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded shadow hover:bg-primary/90"
          type="submit"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
