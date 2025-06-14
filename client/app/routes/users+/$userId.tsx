// client/app/routes/users+/$userId.tsx
import { useParams } from "@remix-run/react";

export default function UserPage() {
  const { userId } = useParams<{ userId: string }>();

  // ダミーの「フェッチ」処理
  // 本来は trpc や fetch で取ってくるところを省略
  const user = {
    id: userId!,
    name: userId ? `${userId.charAt(0).toUpperCase()}${userId.slice(1)}` : "Unknown",
  };

  return (
    <div>
      <h1>ユーザー詳細</h1>
      <p>ID: {user.id}</p>
      <p>名前: {user.name}</p>
    </div>
  );
}
