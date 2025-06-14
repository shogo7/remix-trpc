// client/app/routes/users+/index.tsx
import { Link } from "@remix-run/react";

export default function UsersIndex() {
  // 仮のユーザー一覧リンク
  const dummyUsers = [
    { id: "alice", name: "Alice" },
    { id: "bob",   name: "Bob" },
  ];

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <ul>
        {dummyUsers.map((u) => (
          <li key={u.id}>
            <Link to={u.id}>{u.name} さんのページへ</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
