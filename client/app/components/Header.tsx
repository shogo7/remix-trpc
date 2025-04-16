import { useMe } from '../hooks/useMe';

const Header = () => {
  const { data: user, isLoading } = useMe();

  return (
    <header className="bg-gray-900 p-4 shadow-sm mb-4">
      {isLoading ? (
        <span>読み込み中...</span>
      ) : user ? (
        <span className="text-green-600 font-semibold">{user.username} さん、ようこそ！</span>
      ) : (
        <span className="text-red-500">ログインしてください</span>
      )}
    </header>
  );
};

export default Header;
