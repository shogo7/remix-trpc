// app/routes/profile.tsx (restテスト用)

import { useEffect, useState } from 'react';
type User = {
    id: string;
    username: string;
  };
  
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('http://localhost:3010/api/profile', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p>Loading or Unauthorized...</p>;

  return (
    <div>
      <h1>ようこそ {user.username} さん</h1>
      <p>User ID: {user.id}</p>
    </div>
  );
}
