import { trpc } from '../lib/trpc';

export const useLogout = () => {
  return trpc.user.logout.useMutation();
};
