import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ThemeTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">テーマカラーテスト</h1>

      {/* システム設定の表示 */}
      <Card className="dark:bg-dark-background">
        <CardHeader>
          <CardTitle className="dark:text-dark-background-foreground">
            システム設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-background text-background-foreground dark:bg-dark-background dark:text-dark-background-foreground">
            <p className="dark:text-dark-background-foreground">
              現在のモード:{" "}
              <span className="font-bold dark:text-dark-background-foreground">
                システム設定に従う
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2 dark:text-dark-muted-foreground">
              OSの設定を変更すると、自動的にダークモード/ライトモードが切り替わります。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ライトモードのテスト */}
      <Card>
        <CardHeader>
          <CardTitle>ライトモード</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-background text-background-foreground">
            背景色: background
          </div>
          <div className="p-4 bg-accent text-accent-foreground">
            アクセント色: accent
          </div>
          <div className="p-4 bg-muted text-muted-foreground">
            ミュート色: muted
          </div>
          <div className="p-4 bg-primary text-primary-foreground">
            プライマリー色: primary
          </div>
          <div className="p-4 bg-destructive text-destructive-foreground">
            デストラクティブ色: destructive
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground">
            セカンダリー色: secondary
          </div>
          <div className="p-4 border-2 border-input">入力枠線色: input</div>
          <div className="p-4 border-2 border-ring">リング色: ring</div>
        </CardContent>
      </Card>

      {/* ダークモードのテスト */}
      <Card>
        <CardHeader>
          <CardTitle>ダークモード</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 dark:bg-dark-background dark:text-dark-background-foreground">
            ダークモード背景色: dark-background
          </div>
          <div className="p-4 dark:bg-dark-accent dark:text-dark-accent-foreground">
            ダークモードアクセント色: dark-accent
          </div>
          <div className="p-4 dark:bg-dark-muted dark:text-dark-muted-foreground">
            ダークモードミュート色: dark-muted
          </div>
          <div className="p-4 dark:bg-dark-primary dark:text-dark-primary-foreground">
            ダークモードプライマリー色: dark-primary
          </div>
          <div className="p-4 dark:bg-dark-destructive dark:text-dark-destructive-foreground">
            ダークモードデストラクティブ色: dark-destructive
          </div>
          <div className="p-4 dark:bg-dark-secondary dark:text-dark-secondary-foreground">
            ダークモードセカンダリー色: dark-secondary
          </div>
          <div className="p-4 border-2 dark:border-dark-input">
            ダークモード入力枠線色: dark-input
          </div>
          <div className="p-4 border-2 dark:border-dark-ring">
            ダークモードリング色: dark-ring
          </div>
        </CardContent>
      </Card>

      {/* 透過度のテスト */}
      <Card>
        <CardHeader>
          <CardTitle>透過度のテスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background dark:bg-dark-background">
            {/* ライトモードの透過度 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ライトモードの透過度</h3>
              <div className="flex flex-col gap-2">
                <div className="p-2 bg-primary text-white">primary (100%)</div>
                <div className="p-2 bg-primary/90 text-white">primary/90</div>
                <div className="p-2 bg-primary/75 text-white">primary/75</div>
                <div className="p-2 bg-primary/50 text-white">primary/50</div>
                <div className="p-2 bg-primary/25 text-white">primary/25</div>
                <div className="p-2 bg-primary/10 text-white">primary/10</div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="p-2 text-destructive">destructive (100%)</div>
                <div className="p-2 text-destructive/90">destructive/90</div>
                <div className="p-2 text-destructive/75">destructive/75</div>
                <div className="p-2 text-destructive/50">destructive/50</div>
                <div className="p-2 text-destructive/25">destructive/25</div>
              </div>
            </div>

            {/* ダークモードの透過度 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold dark:text-dark-background-foreground">
                ダークモードの透過度
              </h3>
              <div className="flex flex-col gap-2">
                <div className="p-2 dark:bg-dark-primary dark:text-white">
                  dark-primary (100%)
                </div>
                <div className="p-2 dark:bg-dark-primary/90 dark:text-white">
                  dark-primary/90
                </div>
                <div className="p-2 dark:bg-dark-primary/75 dark:text-white">
                  dark-primary/75
                </div>
                <div className="p-2 dark:bg-dark-primary/50 dark:text-white">
                  dark-primary/50
                </div>
                <div className="p-2 dark:bg-dark-primary/25 dark:text-white">
                  dark-primary/25
                </div>
                <div className="p-2 dark:bg-dark-primary/10 dark:text-white">
                  dark-primary/10
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="p-2 dark:text-dark-destructive">
                  dark-destructive (100%)
                </div>
                <div className="p-2 dark:text-dark-destructive/90">
                  dark-destructive/90
                </div>
                <div className="p-2 dark:text-dark-destructive/75">
                  dark-destructive/75
                </div>
                <div className="p-2 dark:text-dark-destructive/50">
                  dark-destructive/50
                </div>
                <div className="p-2 dark:text-dark-destructive/25">
                  dark-destructive/25
                </div>
              </div>
            </div>
          </div>

          {/* ユースケース例 */}
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">実用例</h3>

            {/* モーダルオーバーレイ */}
            <div className="mb-6 relative h-32 overflow-hidden rounded border dark:border-gray-600">
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    モーダルオーバーレイ (bg-black/50)
                  </p>
                </div>
              </div>
            </div>

            {/* ボタン状態 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="px-3 py-1 bg-primary text-white rounded">
                有効ボタン
              </button>
              <button className="px-3 py-1 bg-primary/60 text-white/90 rounded">
                半透明ボタン (bg-primary/60)
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-400 rounded dark:bg-gray-700 dark:text-gray-400">
                無効ボタン
              </button>
            </div>

            {/* テキスト階層 */}
            <div className="dark:text-white">
              <h4 className="font-semibold">テキスト階層</h4>
              <p className="">主要テキスト (100%)</p>
              <p className="text-gray-700/75 dark:text-white/75">
                二次テキスト (75%)
              </p>
              <p className="text-gray-700/50 dark:text-white/50">
                補足テキスト (50%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <div className="mt-8 p-4 bg-muted rounded-lg dark:bg-dark-muted">
        <h2 className="text-xl font-semibold mb-4 text-background-foreground dark:text-dark-background-foreground">
          使い方
        </h2>
        <p className="mb-2 text-background-foreground dark:text-dark-background-foreground">
          1. OSの設定でダークモード/ライトモードを切り替えてください。
        </p>
        <p className="mb-2 text-background-foreground dark:text-dark-background-foreground">
          2.
          各色の組み合わせが適切なコントラスト比を持っているか確認してください。
        </p>
        <p className="text-background-foreground dark:text-dark-background-foreground">
          3. 必要に応じて、tailwind.config.tsの色を調整してください。
        </p>
      </div>
    </div>
  );
}
