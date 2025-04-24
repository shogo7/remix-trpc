// client/app/routes/register.tsx
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useNavigate } from "@remix-run/react";

export default function Register() {
  const navigate = useNavigate();
  const mutation = trpc.user.register.useMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ username, password });
      alert("登録完了！");
      navigate("/"); 
    } catch (err) {
      alert("登録失敗：" + (err as Error).message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">ユーザー登録</h1>
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
          登録
        </button>
      </form>
    </div>
  );
}
