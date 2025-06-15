// client/app/routes/register.tsx
import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@shared/schemas/user.schema";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = trpc.user.register.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await mutation.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: [["user", "me"]] });
      toast.success("登録完了！");
      navigate("/");
    } catch (err) {
      toast.error("登録失敗：" + (err as Error).message);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-background rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">
        ユーザー登録
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            type="text"
            placeholder="ユーザー名"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-sm mt-1 text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            type="password"
            placeholder="パスワード"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm mt-1 text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          type="submit"
        >
          登録
        </button>
      </form>
    </div>
  );
}
