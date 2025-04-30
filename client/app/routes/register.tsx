// client/app/routes/register.tsx
import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@shared/schemas/user.schema";


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
      alert("登録完了！");
      navigate("/");
    } catch (err) {
      alert("登録失敗：" + (err as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ユーザー登録</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="ユーザー名"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            className="border p-2 w-full"
            type="password"
            placeholder="パスワード"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          登録
        </button>
      </form>
    </div>
  );
}
