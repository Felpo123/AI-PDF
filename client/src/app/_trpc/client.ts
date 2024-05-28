import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../trpc';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});