import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export default function CardTest() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-background-foreground dark:text-dark-background-foreground">
        カードコンポーネントテスト
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 基本的なカード */}
        <Card variant="default">
          <CardHeader>
            <CardTitle>基本的なカード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              これは基本的なカードの例です。ヘッダーとコンテンツを持っています。
            </p>
          </CardContent>
        </Card>

        {/* 主要色を使ったカード */}
        <Card variant="primary">
          <CardHeader>
            <CardTitle>プライマリーカード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              プライマリーカラーをベースにしたカードです。目立つ情報に使用します。
            </p>
          </CardContent>
        </Card>

        {/* セカンダリーカード */}
        <Card variant="secondary">
          <CardHeader>
            <CardTitle>セカンダリーカード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              セカンダリーカラーを使用したカードです。補足情報などに使用します。
            </p>
          </CardContent>
        </Card>

        {/* 成功メッセージカード */}
        <Card variant="success">
          <CardHeader>
            <CardTitle>成功メッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>成功時のメッセージを表示するためのカードです。</p>
          </CardContent>
        </Card>

        {/* 警告メッセージカード */}
        <Card variant="warning">
          <CardHeader>
            <CardTitle>警告メッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>警告やユーザーの注意を引くための警告メッセージカードです。</p>
          </CardContent>
        </Card>

        {/* エラーメッセージカード */}
        <Card variant="destructive">
          <CardHeader>
            <CardTitle>エラーメッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>エラーや問題があることを通知するためのカードです。</p>
          </CardContent>
        </Card>

        {/* 情報カード */}
        <Card variant="info">
          <CardHeader>
            <CardTitle>情報メッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>一般的な情報を提供するためのカードスタイルです。</p>
          </CardContent>
        </Card>

        {/* ミュートカード */}
        <Card variant="muted">
          <CardHeader>
            <CardTitle>ミュートカード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>控えめなスタイルのカードです。背景要素として使用できます。</p>
          </CardContent>
        </Card>

        {/* アクセントカード */}
        <Card variant="accent">
          <CardHeader>
            <CardTitle>アクセントカード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>アクセントカラーを使用したカードスタイルです。</p>
          </CardContent>
        </Card>

        {/* カスタムスタイル付きカード */}
        <Card
          variant="default"
          className="border-2 border-primary dark:border-dark-primary"
        >
          <CardHeader>
            <CardTitle className="text-primary dark:text-dark-primary">
              カスタムスタイル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Variant指定にさらにclassNameでカスタマイズができます。</p>
          </CardContent>
        </Card>

        {/* シャドウ強調カード */}
        <Card variant="default" className="shadow-lg">
          <CardHeader>
            <CardTitle>シャドウ強調カード</CardTitle>
          </CardHeader>
          <CardContent>
            <p>シャドウを強調したカードデザインです。</p>
          </CardContent>
        </Card>

        {/* 透過度を使ったカード */}
        <Card
          variant="primary"
          className="bg-opacity-20 dark:bg-opacity-20 border border-primary/50 dark:border-dark-primary/50"
        >
          <CardHeader>
            <CardTitle className="text-primary dark:text-dark-primary">
              透過カード
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-background-foreground dark:text-dark-background-foreground">
              透過度を活用したカードデザインの例です。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* カードの実用例 */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-background-foreground dark:text-dark-background-foreground">
        実用例
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 製品カード */}
        <Card variant="default" className="overflow-hidden">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">製品画像</span>
          </div>
          <CardHeader>
            <CardTitle>高性能ノートPC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              最新のプロセッサと高速メモリを搭載した高性能ノートPCです。
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary dark:text-dark-primary">
                ¥128,000
              </span>
              <button className="bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground px-4 py-2 rounded-lg">
                購入する
              </button>
            </div>
          </CardContent>
        </Card>

        {/* プロフィールカード */}
        <Card variant="default">
          <div className="flex justify-center pt-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">写真</span>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-center">山田 太郎</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground dark:text-dark-muted-foreground">
              シニアソフトウェアエンジニア
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground px-3 py-1 rounded">
                フォロー
              </button>
              <button className="bg-secondary text-secondary-foreground dark:bg-dark-secondary dark:text-dark-secondary-foreground px-3 py-1 rounded">
                メッセージ
              </button>
            </div>
          </CardContent>
        </Card>

        {/* お知らせカード */}
        <Card
          variant="default"
          className="border-l-4 border-l-info dark:border-l-dark-info"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-info dark:text-dark-info">
              お知らせ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">システムメンテナンスのお知らせ</p>
            <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mb-3">
              2023年12月10日 23:00〜2023年12月11日
              3:00の間、システムメンテナンスを実施します。
            </p>
            <a
              href="#"
              className="text-info dark:text-dark-info text-sm font-medium hover:underline"
            >
              詳細を見る →
            </a>
          </CardContent>
        </Card>
      </div>

      {/* インタラクティブカード */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-background-foreground dark:text-dark-background-foreground">
        インタラクティブカード
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ホバー効果付きカード */}
        <Card
          variant="default"
          className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <CardHeader>
            <CardTitle>ホバー効果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              このカードにマウスを乗せると、浮き上がるような効果があります。
            </p>
          </CardContent>
        </Card>

        {/* クリック可能なカード */}
        <Card
          variant="default"
          className="cursor-pointer active:scale-95 transition-transform"
        >
          <CardHeader>
            <CardTitle>クリック効果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              このカードをクリックすると、押し込まれるような効果があります。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
