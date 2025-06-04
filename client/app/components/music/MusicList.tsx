import { useState } from "react";
import { trpc } from "~/lib/trpc.js";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import type { MusicType } from "@shared/schemas/music";

interface MusicListProps {
  initialMusics: MusicType[];
}

export function MusicList({ initialMusics }: MusicListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: musics, refetch } = trpc.music.getAll.useQuery(undefined, {
    initialData: initialMusics,
  });

  const deleteMusic = trpc.music.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteMusic.mutateAsync(id);
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {musics.map((music: MusicType) => (
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
                  onClick={() => handleDelete(music._id)}
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
  );
}
