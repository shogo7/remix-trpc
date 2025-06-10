import { Music } from "lucide-react";

export default function AnimationDemo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Tailwind CSS アニメーションデモ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 回転アニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            回転アニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-spin text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            animate-spin: 要素を回転させます
          </p>
        </div>

        {/* バウンスアニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            バウンスアニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-bounce text-green-500 dark:text-green-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            animate-bounce: 上下にバウンスします
          </p>
        </div>

        {/* パルスアニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            パルスアニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-pulse text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            animate-pulse: フェードイン/アウトします
          </p>
        </div>

        {/* 複合アニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            複合アニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-spin animate-pulse text-red-500 dark:text-red-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            複数のアニメーションを組み合わせることができます
          </p>
        </div>

        {/* ホバー時のアニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            ホバー時のアニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 hover:animate-spin text-yellow-500 dark:text-yellow-400 transition-all duration-300" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            hover:animate-spin: ホバー時に回転します
          </p>
        </div>

        {/* 無限アニメーション */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            無限アニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-[spin_3s_linear_infinite] text-indigo-500 dark:text-indigo-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            カスタムの回転速度と無限ループ
          </p>
        </div>
      </div>
    </div>
  );
}
