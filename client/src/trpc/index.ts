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
type File = { 
  id: string; 
  name: string; 
  content: string; 
  userId: string; 
  createdAt: string;
  updatedAt: string;

};

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
    .query(() => {
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
    )
    .mutation(() => {
      return {
        id: "",
        name: "",
        email: "",
      };
    }),
  getUserFiles: publicProcedure
    .input(
      z.object({ 
        userId: z.string() 
      })
    )
    .query(() => {
      return [] as File[]
      
    }),
  uploadFile: publicProcedure
    .input(
      z.object({
        name:z.string(),
        content:z.string(),
        userId:z.string(),
      })
    )
    .mutation(() => {
      return {
        id: "",
        name: "",
        content: "",
        userId: "",
      };
    }),
});

const appRouter = router({
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
