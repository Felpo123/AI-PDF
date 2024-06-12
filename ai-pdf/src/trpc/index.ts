import { db } from "@/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

const helloRouter = router({
  helloWord: publicProcedure.input(z.string()).query(async ({ input }) => {
    console.log("hola" + input);
    return `Hello, ${input}!`;
  }),
  getUser: publicProcedure.input(z.string()).query(async ({ input }) => {
    const id = input;
    const user = db.user.findFirst({ where: { id: id } });
    return user;
  }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await db.user.findFirst({ where: { email: input.email } });
      console.log(user);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = db.user.create({
        data: { email: input.email, name: input.name },
      });
      if (!user) {
        throw new Error("User not created");
      }
      return user;
    }),
    getUserFiles: publicProcedure
    .input(z.object(
      {
        userId: z.string()
      }
    )).query(async ({ input }) => {
      const files = await db.file.findMany({where: {userId: input.userId}});
      if(!files){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Files not found",
        });
      }
      console.log(files);
      return files;
    }),
    uploadFile: publicProcedure
    .input(z.object(
      {
        name: z.string(),
        content: z.string(),
        userId: z.string(),
      }
    )).mutation(async ({ input }) => {
      const file = db.file.create({
        data: {name: input.name, content: input.content, userId: input.userId}
      });
      if(!file){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File not created",
        });
      }
      return file;
    }),
});

export const appRouter = router({
  hello: helloRouter,
});
