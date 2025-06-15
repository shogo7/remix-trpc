// client/app/routes/music.tsx
import { useLoaderData } from "@remix-run/react";
import { createServerTRPCClient } from "~/lib/trpc.server";
import { MusicList } from "~/components/music/MusicList.js";
import { CreateMusicForm } from "~/components/music/CreateMusicForm.js";
import { Music } from "lucide-react";

export const loader = async ({ request }: { request: Request }) => {
  const trpc = createServerTRPCClient(request);
  const musics = await trpc.music.getAll.query();
  return { musics };
};

export default function MusicPage() {
  const { musics } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-background-foreground">
          音楽管理
        </h1>
        <p className="text-muted-foreground">
          お気に入りの音楽を登録・管理しましょう
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-background-foreground">
          <Music className="mr-2" />
          新しい音楽を登録
        </h2>
        <CreateMusicForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center text-background-foreground">
          <Music className="mr-2" />
          登録済みの音楽
        </h2>
        <MusicList initialMusics={musics} />
      </div>
    </div>
  );
}
