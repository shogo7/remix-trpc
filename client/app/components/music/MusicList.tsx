import { useState, useEffect } from "react";
import { trpc } from "~/lib/trpc.js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import type { MusicResponseType } from "@shared/schemas/music";
import { DeleteMusicDialog } from "./DeleteMusicDialog";
import { toast } from "sonner";

interface MusicListProps {
  initialMusics: MusicResponseType[];
}

export function MusicList({ initialMusics }: MusicListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    musicId: string;
    title: string;
  }>({
    isOpen: false,
    musicId: "",
    title: "",
  });

  const { data: musics, refetch } = trpc.music.getAll.useQuery(undefined, {
    initialData: initialMusics,
  });

  useEffect(() => {
    if (musics) {
      console.log("Fetched musics:", musics);
    }
  }, [musics]);

  const { data: user } = trpc.user.me.useQuery();

  const deleteMusic = trpc.music.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeleteDialog({ isOpen: false, musicId: "", title: "" });
      toast.success("音楽を削除しました");
    },
    onError: (error) => {
      console.error("Failed to delete music:", error);
      toast.error(
        error.data?.code === "NOT_FOUND"
          ? "音楽が見つかりません"
          : error.data?.code === "FORBIDDEN"
          ? "この音楽を削除する権限がありません"
          : "音楽の削除に失敗しました"
      );
    },
  });

  const handleDeleteClick = (music: MusicResponseType) => {
    console.log("Selected music:", music);
    setDeleteDialog({
      isOpen: true,
      musicId: music._id.toString(),
      title: music.title,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      console.log("Attempting to delete music with ID:", deleteDialog.musicId);
      console.log("Current user context:", user);
      await deleteMusic.mutateAsync(deleteDialog.musicId);
    } catch (error) {
      console.error("Failed to delete music:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!musics) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {musics.map((music: MusicResponseType) => (
          <Card key={music._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {music.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">アーティスト:</span>{" "}
                  {music.artist}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ジャンル:</span> {music.genre}
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    編集
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(music)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteMusicDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, musicId: "", title: "" })
        }
        onConfirm={handleDeleteConfirm}
        title={deleteDialog.title}
        isLoading={isLoading}
      />
    </>
  );
}
