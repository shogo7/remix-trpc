import { useRouteError } from "@remix-run/react";

type ErrorBoundaryProps = {
  error?: Error;
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

export function ErrorBoundary({
  error,
  title = "エラーが発生しました",
  message = "申し訳ありません。ページの読み込み中にエラーが発生しました。",
  children,
}: ErrorBoundaryProps) {
  const routeError = useRouteError();
  const errorMessage =
    error?.message ||
    (routeError instanceof Error ? routeError.message : "不明なエラー");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">
          {title}
        </h2>

        <p className="text-muted-foreground mb-6">{message}</p>

        <div className="bg-destructive/10 rounded-lg p-4 mb-6 border border-destructive">
          <p className="text-sm font-mono text-destructive-foreground whitespace-pre-wrap break-all">
            {errorMessage}
          </p>
        </div>

        {children}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
