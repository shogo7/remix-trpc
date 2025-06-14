import { trpc } from "../lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  type CreatePostInput,
} from "../../../shared/schemas/post";

export default function PostsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  const utils = trpc.useUtils();
  const posts = trpc.post.getAll.useQuery();
  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      reset();
    },
  });

  const onSubmit = (data: CreatePostInput) => {
    createPost.mutate(data);
  };

  if (posts.isLoading) return <div>Loading...</div>;
  if (posts.error) return <div>Error: {posts.error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 border rounded-md bg-input text-muted-foreground border-border"
          />
          {errors.title && (
            <p className="text-destructive text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            内容
          </label>
          <textarea
            id="content"
            {...register("content")}
            className="w-full px-4 py-2 border rounded-md bg-input text-muted-foreground border-border"
            rows={4}
          />
          {errors.content && (
            <p className="text-destructive text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary px-4 py-2 rounded"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "投稿中..." : "投稿する"}
        </button>
      </form>

      <div className="space-y-4">
        {posts.data?.map((post) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
