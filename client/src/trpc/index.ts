import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import superjson from "superjson";
import { z } from "zod";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const middleware = t.middleware;
const router = t.router;
const publicProcedure = t.procedure;

const helloRouter = router({
  helloWord: publicProcedure.input(z.string()).query(async ({ input }) => {
    return `Hello, ${input}!`;
  }),
  getUser: publicProcedure.input(z.string()).query(async ({ input }) => {
    return {
      id: "",
      name: "",
      email: "",
    };
  }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(() => {
      return {
        id: "",
        name: "",
        email: "",
      };
    }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
      })
    ).mutation(() => {
      return {
        id: "",
        name: "",
        email: "",
      };
    }),
});

const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
