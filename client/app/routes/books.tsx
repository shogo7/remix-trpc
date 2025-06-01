import { trpc } from "../lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookSchema,
  type CreateBookInput,
} from "../../../shared/schemas/book";

export default function PostsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
  });

  const utils = trpc.useUtils();
  const books = trpc.book.getAll.useQuery();
  const createBook = trpc.book.create.useMutation({
    onSuccess: async () => {
      utils.book.getAll.invalidate();
      reset();
    },
  });

  const onSubmit = (data: CreateBookInput) => {
    createBook.mutate(data);
  };

  if (books.isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-lg font-medium text-gray-300 animate-pulse">
          Loading...
        </p>
      </div>
    );
  if (books.error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-lg font-medium text-red-400">
          Error: {books.error.message}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 lg:px-0 max-w-4xl">
        {/* ── ページタイトル ── */}
        <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center tracking-wide">
          コレクション
        </h1>

        {/* ── フォームセクション ── */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6">
            新しい本を追加
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-gray-300 font-medium mb-2"
              >
                タイトル
              </label>
              <input
                id="title"
                type="text"
                placeholder="例：はじめてのReact"
                {...register("title")}
                className={`
                  block w-full rounded-lg
                  bg-gray-700 text-gray-100
                  border
                  ${errors.title ? "border-red-500" : "border-gray-600"}
                  focus:outline-none focus:ring-2
                  ${
                    errors.title
                      ? "focus:ring-red-400"
                      : "focus:ring-indigo-500"
                  }
                  focus:border-transparent
                  px-4 py-3
                  transition-colors duration-150
                `}
              />
              {errors.title && (
                <p className="flex items-center text-red-400 text-sm mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M4.93
                      4.93a10 10 0 0114.14 0 10 10 0 010 14.14 10
                      10 0 01-14.14 0 10 10 0 010-14.14z"
                    />
                  </svg>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-gray-300 font-medium mb-2"
              >
                内容
              </label>
              <textarea
                id="content"
                placeholder="例：Reactの基礎から学べます…"
                {...register("content")}
                className={`
                  block w-full rounded-lg
                  bg-gray-700 text-gray-100
                  border
                  ${errors.content ? "border-red-500" : "border-gray-600"}
                  focus:outline-none focus:ring-2
                  ${
                    errors.content
                      ? "focus:ring-red-400"
                      : "focus:ring-indigo-500"
                  }
                  focus:border-transparent
                  px-4 py-3
                  transition-colors duration-150
                `}
                rows={5}
              />
              {errors.content && (
                <p className="flex items-center text-red-400 text-sm mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M4.93
                      4.93a10 10 0 0114.14 0 10 10 0 010 14.14 10
                      10 0 01-14.14 0 10 10 0 010-14.14z"
                    />
                  </svg>
                  {errors.content.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`
                w-full flex items-center justify-center
                bg-gradient-to-r from-purple-600 to-indigo-600
                hover:from-purple-700 hover:to-indigo-700
                text-gray-100 font-bold
                px-6 py-3 rounded-full
                shadow-md hover:shadow-lg
                transition-all duration-200
                ${createBook.isPending ? "opacity-75 cursor-not-allowed" : ""}
              `}
              disabled={createBook.isPending}
            >
              {createBook.isPending ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
              {createBook.isPending ? "投稿中…" : "追加する"}
            </button>

            {createBook.error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mt-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v4m0 4h.01"
                  />
                </svg>
                投稿に失敗しました。もう一度お試しください。
              </div>
            )}
          </form>
        </section>

        {/* ── 投稿一覧 ── */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-200 mb-6">
            最近の投稿
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.data && books.data.length > 0 ? (
              books.data.map((book) => (
                <div
                  key={book.id}
                  className="relative bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden"
                >
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-full shadow-lg transform rotate-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-100 truncate">
                      {book.title}
                    </h3>
                    <p className="text-gray-300 line-clamp-3">
                      {book.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {new Date(book.createdAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <button className="text-indigo-400 hover:text-indigo-300">
                        詳細
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-400 text-center">
                まだ投稿はありません。
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
