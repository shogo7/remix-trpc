import { Music } from "lucide-react";

export default function AnimationDemo() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tailwind CSS アニメーションデモ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 回転アニメーション */}
        <div className="p-6 bg-background rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">回転アニメーション</h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground mt-4">
            animate-spin: 要素を回転させます
          </p>
        </div>

        {/* バウンスアニメーション */}
        <div className="p-6 bg-background rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">バウンスアニメーション</h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-bounce text-success" />
          </div>
          <p className="text-muted-foreground mt-4">
            animate-bounce: 上下にバウンスします
          </p>
        </div>

        {/* パルスアニメーション */}
        <div className="p-6 bg-background rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">パルスアニメーション</h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-pulse text-info" />
          </div>
          <p className="text-muted-foreground mt-4">
            animate-pulse: フェードイン/アウトします
          </p>
        </div>


        {/* ホバー時のアニメーション */}
        <div className="p-6 bg-background rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            ホバー時のアニメーション
          </h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 hover:animate-spin text-warning transition-all duration-300" />
          </div>
          <p className="text-muted-foreground mt-4">
            hover:animate-spin: ホバー時に回転します
          </p>
        </div>

        {/* 無限アニメーション */}
        <div className="p-6 bg-background rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">無限アニメーション</h2>
          <div className="flex items-center justify-center h-32">
            <Music className="w-16 h-16 animate-[spin_3s_linear_infinite] text-indigo" />
          </div>
          <p className="text-muted-foreground mt-4">
            カスタムの回転速度と無限ループ
          </p>
        </div>
      </div>
    </div>
  );
}
