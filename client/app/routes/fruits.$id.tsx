// client/app/routes/fruits.$id.tsx
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { createServerTRPCClient } from "../lib/trpc.server.js";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id || typeof id !== "string") {
    throw new Response("Invalid fruit ID", { status: 400 });
  }

  const trpc = createServerTRPCClient(request);
  const fruit = await trpc.fruit.getFruitById.query(id);
  return { fruit };
}

export default function FruitDetail() {
  const { fruit } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to fruits list
      </Link>
      <div className="mt-4 p-6 border rounded shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{fruit.name}</h1>
        <p className="text-lg mb-2">
          Color: <span style={{ color: fruit.color }}>{fruit.color}</span>
        </p>
        <p className="text-lg mb-2">Price: {fruit.price} </p>
      </div>
    </div>
  );
}
