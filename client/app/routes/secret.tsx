// client/app/routes/secret.tsx
import { useMe } from "../hooks/useMe";
import { Link } from "@remix-run/react";

export default function SecretPage() {
  const { data: me, isLoading, error } = useMe();

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">このページはログインが必要です。</p>
        <Link to="/login" className="text-blue-500 underline">
          ログインへ
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Secret Page 🔐</h1>
      <p>こんにちは、<span className="font-semibold">{me.username}</span> さん！</p>
      <p>このページはログインユーザーしか見れません。</p>
    </div>
  );
}
