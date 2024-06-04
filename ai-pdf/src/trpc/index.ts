import { db } from "@/db";
import { initTRPC } from "@trpc/server";
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
      const user = db.user.findFirst({ where: { email: input.email } });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }),
  createUser: publicProcedure
    .input(
      z.object({ 
        email: z.string(),
        name: z.string(),
       }))
       .query(async ({ input }) => {
        const user = db.user.create({data: {email: input.email, name: input.name}});
        if(!user){
          throw new Error("User not created");
        }
        return user;
       }),
});

export const appRouter = router({
  hello: helloRouter,
});
