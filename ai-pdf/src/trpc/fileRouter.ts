import { z } from "zod";
import { publicProcedure, router } from ".";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const fileRouter = router({
  getUserFiles: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const files = await db.file.findMany({ where: { userId: input.userId } });

      if (!files) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Files not found",
        });
      }
      return files;
    }),
  uploadFile: publicProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const file = db.file.create({
        data: {
          name: input.name,
          content: input.content,
          userId: input.userId,
        },
      });
      if (!file) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File not created",
        });
      }
      return file;
    }),
  getFile: publicProcedure
    .input(
      z.object({
        fileId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const file = await db.file.findFirst({ where: { id: input.fileId } });
      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }
      return file;
    }),
  deleteFile: publicProcedure
    .input(z.object({ fileId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: input.userId,
        },
      });
      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }
      await db.message.deleteMany({ where: { fileId: input.fileId } });
      await db.file.delete({ where: { id: input.fileId } });

      return file;
    }),
});
