import { Link } from '@remix-run/react';
import { useMe } from '../hooks/useMe';
import { useLogout } from '../hooks/useLogout';

const Header = () => {
  const { data: user, isLoading, refetch } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    refetch(); // 再取得してログイン状態を反映
  };

  return (
    <header className="bg-gray-900 p-4 shadow-sm mb-4 flex justify-between items-center">
      {isLoading ? (
        <span>読み込み中...</span>
      ) : user ? (
        <>
          <div className="flex items-center space-x-4">
            <span className="text-green-600 font-semibold">{user.username} さん、ようこそ！</span>
            <Link to="/secret" className="text-blue-400 hover:underline">
              Secretページ
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </>
      ) : (
        <span className="text-red-500">ログインしてください</span>
      )}
    </header>
  );
};

export default Header;
