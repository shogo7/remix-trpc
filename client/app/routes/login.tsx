import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

export default function Login() {
  const navigate = useNavigate();
  const mutation = trpc.user.login.useMutation();
  const queryClient = useQueryClient(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ username, password });
      await queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      alert("ログイン成功！");
      navigate("/");
    } catch (err) {
      alert("ログイン失敗：" + (err as Error).message);
    }
  };


  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}
