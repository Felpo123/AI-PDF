import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { get } from "http";
import superjson from "superjson";
import { z } from "zod";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const authRouter = router({
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
});

type File = {
  id: string;
  name: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const fileRouter = router({
  getUserFiles: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(() => {
      return [] as File[];
    }),
  uploadFile: publicProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        userId: z.string(),
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
  getFile: publicProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .query(() => {
      return {} as File;
    }),
    deleteFile: publicProcedure.input(z.object({ fileId: z.string(),userId: z.string() })).mutation(() => {
      return {
        id: "",
        name: "",
        content: "",
        userId: "",
      };
    }),
});

const messageRouter = router({
  getAIMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        fileContent: z.string(),
      })
    )
    .query(() => {
      return {
        content: "",
      };
    }),
});

const appRouter = router({
  auth: authRouter,
  file: fileRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
