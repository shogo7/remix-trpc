import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "~/lib/trpc.js";
import {
  updateMusicSchema,
  type UpdateMusicType,
  type MusicResponseType,
} from "@shared/schemas/music.js";
import { useRevalidator } from "@remix-run/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface EditMusicFormProps {
  music: MusicResponseType;
  isOpen: boolean;
  onClose: () => void;
}

export function EditMusicForm({ music, isOpen, onClose }: EditMusicFormProps) {
  const revalidator = useRevalidator();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMusicType>({
    resolver: zodResolver(updateMusicSchema),
    mode: "onChange",
    defaultValues: {
      _id: music._id,
      title: music.title,
      artist: music.artist,
      genre: music.genre,
      releaseYear: music.releaseYear,
      description: music.description,
      url: music.url,
      isPublic: music.isPublic,
    },
  });

  const updateMusic = trpc.music.update.useMutation({
    onSuccess: () => {
      reset();
      revalidator.revalidate();
      toast.success("音楽を更新しました");
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update music:", error);
      toast.error(error.message || "音楽の更新に失敗しました");
    },
  });

  const onSubmit = handleSubmit(
    (data) => {
      updateMusic.mutate(data);
    },
    (errors) => {
      const errorMessages = Object.entries(errors)
        .map(([key, value]) => `${key}: ${value.message}`)
        .join("\n");

      toast.error("入力エラー", {
        description: errorMessages,
      });
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background text-background-foreground">
        <DialogHeader>
          <DialogTitle>音楽を編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-background-foreground"
            >
              タイトル
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
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
              className="block text-sm font-medium text-background-foreground"
            >
              アーティスト
            </label>
            <input
              {...register("artist")}
              type="text"
              id="artist"
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
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
              className="block text-sm font-medium text-background-foreground"
            >
              ジャンル
            </label>
            <input
              {...register("genre")}
              type="text"
              id="genre"
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
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
              className="block text-sm font-medium text-background-foreground"
            >
              リリース年
            </label>
            <input
              {...register("releaseYear", { valueAsNumber: true })}
              type="number"
              id="releaseYear"
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
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
              className="block text-sm font-medium text-background-foreground"
            >
              説明
            </label>
            <textarea
              {...register("description")}
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
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
              className="block text-sm font-medium text-background-foreground"
            >
              URL
            </label>
            <input
              {...register("url")}
              type="url"
              id="url"
              className="mt-1 block w-full rounded-md border-input bg-background text-background-foreground shadow-sm focus:border-primary focus:ring-primary"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-destructive">
                {errors.url.message}
              </p>
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
              className="ml-2 block text-sm text-background-foreground"
            >
              公開する
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-background-foreground bg-background border border-input rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={updateMusic.isPending}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {updateMusic.isPending ? "更新中..." : "更新"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
