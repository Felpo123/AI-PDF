import { z } from "zod";
import { publicProcedure, router } from ".";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
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
      const user = await db.user.create({
        data: { email: input.email, name: input.name },
      });
      if (!user) {
        throw new Error("User not created");
      }
      return user;
    }),
});
