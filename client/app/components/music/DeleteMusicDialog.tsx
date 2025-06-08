import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

interface DeleteMusicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isLoading: boolean;
}

export function DeleteMusicDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading,
}: DeleteMusicDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESCキーでダイアログを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 背景クリックでダイアログを閉じる
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* ダイアログパネル */}
      <div
        ref={dialogRef}
        className="relative bg-background text-white rounded-lg max-w-sm w-full mx-auto p-6 shadow-xl transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        {/* 閉じるボタン */}
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">閉じる</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* タイトル */}
        <h3
          id="dialog-title"
          className="text-lg font-medium text-white-900 mb-3"
        >
          音楽を削除しますか？？
        </h3>

        {/* 説明 */}
        <p className="text-sm text-white-600 mb-5">
          「{title}」を削除します。この操作は取り消せません。
        </p>
        {/* ボタン */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button onClick={onClose} disabled={isLoading} variant="outline">
            キャンセル
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "削除中..." : "削除する"}
          </Button>
        </div>
      </div>
    </div>
  );
}
