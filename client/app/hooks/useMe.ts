// client/app/hooks/useMe.ts
import { trpc } from "../lib/trpc";

export const useMe = () => {
  return trpc.user.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
};
