import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc.js";
import {
  createMusicSchema,
  type CreateMusicType,
} from "@shared/schemas/music.js";
import { useRevalidator } from "@remix-run/react";
import { toast } from "sonner";

export function CreateMusicForm() {
  const revalidator = useRevalidator();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMusicType>({
    resolver: zodResolver(createMusicSchema),
    mode: "onChange",
    defaultValues: {
      isPublic: true,
    },
  });

  const createMusic = trpc.music.create.useMutation({
    onSuccess: () => {
      reset();
      revalidator.revalidate();
      toast.success("音楽を登録しました");
    },
    onError: (error) => {
      console.error("Failed to create music:", error);
      toast.error(error.message || "音楽の登録に失敗しました");
    },
  });

  const onSubmit = handleSubmit(
    (data) => {
      createMusic.mutate(data);
    },
    (errors) => {
      // バリデーションエラー時の処理
      const errorMessages = Object.entries(errors)
        .map(([key, value]) => `${key}: ${value.message}`)
        .join("\n");

      toast.error("入力エラー", {
        description: errorMessages,
      });
    }
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="artist"
          className="block text-sm font-medium text-gray-700"
        >
          アーティスト
        </label>
        <input
          {...register("artist")}
          type="text"
          id="artist"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.artist && (
          <p className="mt-1 text-sm text-red-600">{errors.artist.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="genre"
          className="block text-sm font-medium text-gray-700"
        >
          ジャンル
        </label>
        <input
          {...register("genre")}
          type="text"
          id="genre"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.genre && (
          <p className="mt-1 text-sm text-red-600">{errors.genre.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="releaseYear"
          className="block text-sm font-medium text-gray-700"
        >
          リリース年
        </label>
        <input
          {...register("releaseYear", { valueAsNumber: true })}
          type="number"
          id="releaseYear"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.releaseYear && (
          <p className="mt-1 text-sm text-red-600">
            {errors.releaseYear.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          URL
        </label>
        <input
          {...register("url")}
          type="url"
          id="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register("isPublic")}
          type="checkbox"
          id="isPublic"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
          公開する
        </label>
      </div>

      <button
        type="submit"
        disabled={createMusic.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {createMusic.isPending ? "登録中..." : "登録"}
      </button>
    </form>
  );
}
