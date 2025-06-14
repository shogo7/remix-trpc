import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc.js";
import {
  createMusicSchema,
  type CreateMusicType,
} from "@shared/schemas/music.js";
import { useRevalidator } from "@remix-run/react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button.js";

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
          className="block text-sm font-medium text-foreground"
        >
          タイトル
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="artist"
          className="block text-sm font-medium text-foreground"
        >
          アーティスト
        </label>
        <input
          {...register("artist")}
          type="text"
          id="artist"
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.artist && (
          <p className="mt-1 text-sm text-destructive">
            {errors.artist.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="genre"
          className="block text-sm font-medium text-foreground"
        >
          ジャンル
        </label>
        <input
          {...register("genre")}
          type="text"
          id="genre"
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.genre && (
          <p className="mt-1 text-sm text-destructive">
            {errors.genre.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="releaseYear"
          className="block text-sm font-medium text-foreground"
        >
          リリース年
        </label>
        <input
          {...register("releaseYear", { valueAsNumber: true })}
          type="number"
          id="releaseYear"
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.releaseYear && (
          <p className="mt-1 text-sm text-destructive">
            {errors.releaseYear.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground"
        >
          説明
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-foreground"
        >
          URL
        </label>
        <input
          {...register("url")}
          type="url"
          id="url"
          className="mt-1 block w-full rounded-md border bg-input shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-destructive">{errors.url.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register("isPublic")}
          type="checkbox"
          id="isPublic"
          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
        />
        <label
          htmlFor="isPublic"
          className="ml-2 block text-sm text-foreground"
        >
          公開する
        </label>
      </div>

      <Button
        type="submit"
        disabled={createMusic.isPending}
        className="w-full border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        {createMusic.isPending ? "登録中..." : "登録"}
      </Button>
    </form>
  );
}
