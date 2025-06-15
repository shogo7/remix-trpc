// client/app/components/Header.tsx
import { Link } from "@remix-run/react";
import { useMe } from "../hooks/useMe";
import { useLogout } from "../hooks/useLogout";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    queryClient.clear();
  };

  return (
    <header className="bg-background p-4 shadow-sm mb-4 flex justify-between items-center">
      {isLoading ? (
        <span>読み込み中...</span>
      ) : user ? (
        <>
          <div className="flex items-center space-x-4">
            <span className="text-success font-semibold">
              {user.username} さん、ようこそ！
            </span>
            <Link to="/secret" className="text-primary hover:underline">
              Secretページ
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90"
          >
            ログアウト
          </button>
        </>
      ) : (
        <span className="text-destructive">ログインしてください</span>
      )}
    </header>
  );
};

export default Header;
