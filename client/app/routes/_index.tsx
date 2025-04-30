// client/app/routes/_index.tsx

import { Link } from "@remix-run/react";
import { trpc } from "../lib/trpc";

export default function Index() {
  const { data: fruits, isLoading, error } = trpc.fruit.getFruits.useQuery();


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end space-x-4 mb-4">
        <Link to="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Fruit List</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!fruits || fruits.length === 0 ? (
        <p>No fruits available</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fruits.map((fruit) => (
            <div
              key={fruit._id.toString()}
              className="rounded border p-4 shadow-sm"
            >
              <Link
                to={`/fruits/${fruit._id}`}
                className="block hover:underline"
              >
                <h2 className="text-xl font-semibold">{fruit.name}</h2>
                <p>
                  Color:{" "}
                  <span style={{ color: fruit.color }}>{fruit.color}</span>
                </p>
                <p>Price: {fruit.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
