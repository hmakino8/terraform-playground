import { useAuth } from "@/user/hooks/useAuth";
import { useLogout } from "@/user/hooks/useLogout";

export const UserProfileScreen = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();

  return (
    <div className="absolute top-14 right-0 w-full p-3 text-sm bg-gray-100">
      <div className="mb-3">
        <div>ユーザー名</div>
        <div className="text-black">{user?.username}</div>
      </div>
      <div className="mb-5">
        <div>メールアドレス</div>
        <div className="text-black">{user?.email}</div>
      </div>
      <button
        className="mb-5 w-20 text-blue-500 hover:opacity-70 border border-blue-500 rounded-lg"
        onClick={handleLogout}
      >
        ログアウト
      </button>
    </div>
  );
};
