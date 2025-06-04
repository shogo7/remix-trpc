// client/app/routes/books.tsx
import { useLoaderData, useNavigation, useRevalidator } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createBookSchema,
  type CreateBookInput,
} from "../../../shared/schemas/book";
import { createServerTRPCClient } from "../lib/trpc.server.js";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { trpc } from "../lib/trpc";
import { ErrorBoundary } from "../components/ErrorBoundary";

export async function loader({ request }: LoaderFunctionArgs) {
  // テスト用のエラー発生
  const shouldThrowError =
    new URL(request.url).searchParams.get("error") === "true";
  if (shouldThrowError) {
    throw new Error("テスト用のエラーです");
  }

  const trpc = createServerTRPCClient(request);
  const books = await trpc.book.getAll.query();
  return { books };
}

export default function BooksPage() {
  const { books } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const isLoading = navigation.state === "loading";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
  });

  const createBook = trpc.book.create.useMutation({
    onSuccess: async () => {
      reset();
      revalidator.revalidate();
    },
  });

  const onSubmit = (data: CreateBookInput) => {
    createBook.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">本の一覧</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="border p-2 w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            内容
          </label>
          <textarea
            id="content"
            {...register("content")}
            className="border p-2 w-full"
            rows={4}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={createBook.isPending}
        >
          {createBook.isPending ? "投稿中..." : "投稿する"}
        </button>
      </form>

      <div className="space-y-4">
        {books?.map((book) => (
          <div key={book.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="mt-2">{book.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(book.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// エラーバウンダリコンポーネント
export { ErrorBoundary };
