// client/app/routes/a/theme-test.tsx
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ThemeTest() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-background-foreground">
        テーマカラーテスト
      </h1>

      {/* システム設定の表示 */}
      <Card>
        <CardHeader>
          <CardTitle>システム設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-background text-background-foreground">
            <p>
              現在のモード:{" "}
              <span className="font-bold">システム設定に従う</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              OSの設定を変更すると、自動的にダークモード/ライトモードが切り替わります。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* カラーパレット */}
      <Card>
        <CardHeader>
          <CardTitle>カラーパレット</CardTitle>
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
          <div className="p-4 bg-success text-success-foreground">
            サクセス色: success
          </div>
          <div className="p-4 bg-warning text-warning-foreground">
            警告色: warning
          </div>
          <div className="p-4 bg-info text-info-foreground">情報色: info</div>
          <div className="p-4 border-2 border-input">入力枠線色: input</div>
          <div className="p-4 border-2 border-ring">リング色: ring</div>
          <div className="p-4 border-2 border-border">ボーダー色: border</div>
        </CardContent>
      </Card>

      {/* 透過度のテスト */}
      <Card>
        <CardHeader>
          <CardTitle>透過度のテスト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background">
            {/* 背景色の透過度 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">背景色の透過度</h3>
              <div className="flex flex-col gap-2">
                <div className="p-2 bg-primary text-primary-foreground">
                  primary (100%)
                </div>
                <div className="p-2 bg-primary/90 text-primary-foreground">
                  primary/90
                </div>
                <div className="p-2 bg-primary/75 text-primary-foreground">
                  primary/75
                </div>
                <div className="p-2 bg-primary/50 text-primary-foreground">
                  primary/50
                </div>
                <div className="p-2 bg-primary/25 text-primary-foreground">
                  primary/25
                </div>
                <div className="p-2 bg-primary/10 text-primary-foreground">
                  primary/10
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="p-2 bg-destructive text-destructive-foreground">
                  destructive (100%)
                </div>
                <div className="p-2 bg-destructive/90 text-destructive-foreground">
                  destructive/90
                </div>
                <div className="p-2 bg-destructive/75 text-destructive-foreground">
                  destructive/75
                </div>
                <div className="p-2 bg-destructive/50 text-destructive-foreground">
                  destructive/50
                </div>
                <div className="p-2 bg-destructive/25 text-destructive-foreground">
                  destructive/25
                </div>
              </div>
            </div>

            {/* テキスト色の透過度 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">テキスト色の透過度</h3>
              <div className="flex flex-col gap-2">
                <div className="p-2 text-primary">text-primary (100%)</div>
                <div className="p-2 text-primary/90">text-primary/90</div>
                <div className="p-2 text-primary/75">text-primary/75</div>
                <div className="p-2 text-primary/50">text-primary/50</div>
                <div className="p-2 text-primary/25">text-primary/25</div>
                <div className="p-2 text-primary/10">text-primary/10</div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="p-2 text-destructive">
                  text-destructive (100%)
                </div>
                <div className="p-2 text-destructive/90">
                  text-destructive/90
                </div>
                <div className="p-2 text-destructive/75">
                  text-destructive/75
                </div>
                <div className="p-2 text-destructive/50">
                  text-destructive/50
                </div>
                <div className="p-2 text-destructive/25">
                  text-destructive/25
                </div>
              </div>
            </div>
          </div>

          {/* ユースケース例 */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-background-foreground">
              実用例
            </h3>

            {/* モーダルオーバーレイ */}
            <div className="mb-6 relative h-32 overflow-hidden rounded border border-border">
              <div className="absolute inset-0 bg-background-foreground/50 flex items-center justify-center">
                <div className="bg-background p-3 rounded-lg">
                  <p className="text-sm font-medium text-background-foreground">
                    モーダルオーバーレイ (bg-background-foreground/50)
                  </p>
                </div>
              </div>
            </div>

            {/* ボタン状態 */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
                有効ボタン
              </button>
              <button className="px-3 py-1 bg-primary/60 text-primary-foreground/90 rounded">
                半透明ボタン (bg-primary/60)
              </button>
              <button className="px-3 py-1 bg-muted text-muted-foreground rounded">
                無効ボタン
              </button>
            </div>

            {/* テキスト階層 */}
            <div>
              <h4 className="font-semibold text-background-foreground">
                テキスト階層
              </h4>
              <p className="text-background-foreground">主要テキスト (100%)</p>
              <p className="text-background-foreground/75">
                二次テキスト (75%)
              </p>
              <p className="text-background-foreground/50">
                補足テキスト (50%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-background-foreground">
          使い方
        </h2>
        <p className="mb-2 text-background-foreground">
          1. OSの設定でダークモード/ライトモードを切り替えてください。
        </p>
        <p className="mb-2 text-background-foreground">
          2.
          各色の組み合わせが適切なコントラスト比を持っているか確認してください。
        </p>
        <p className="text-background-foreground">
          3.
          必要に応じて、tailwind.cssの:rootとdarkモードのCSS変数を調整してください。
        </p>
      </div>
    </div>
  );
}
