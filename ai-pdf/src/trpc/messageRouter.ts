import { z } from "zod";
import { publicProcedure, router } from ".";
import { TRPCError } from "@trpc/server";
import generateContent from "@/lib/vertex-ai";
import { db } from "@/db";

export const messageRouter = router({
  getAIMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        fileID: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      //Get File
      const file = await db.file.findFirst({
        where: { id: input.fileID },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      //Create Message
      await db.message.create({
        data: {
          fileId: input.fileID,
          text: input.message,
          isUserMessage: true,
          userId: file.userId,
        },
      });

      const streamingAIResponse = await generateContent(
        file.content,
        input.message
      );
      const chunks = [];
      for await (const item of streamingAIResponse.stream) {
        if (item.candidates && item.candidates.length > 0) {
          const textParts = item.candidates[0].content.parts
            .map((part) => part.text)
            .join("");
          chunks.push(textParts);
        } else {
          continue;
        }
      }

      const aiResponse = chunks.join("");

      if (!aiResponse) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI response is empty",
        });
      }

      // Guardar la respuesta de la IA en la base de datos
      const aiMessage = await db.message.create({
        data: {
          fileId: input.fileID,
          text: aiResponse,
          isUserMessage: false,
          userId: file.userId,
        },
      });

      return { content: aiResponse };
    }),

  getFileMessages: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileID: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { fileID, cursor } = input;
      const limit = input.limit ?? 10;

      const file = await db.file.findFirst({
        where: { id: fileID },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        where: {
          fileId: fileID,
        },
        take: limit + 1,
        orderBy: { createdAt: "desc" },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          text: true,
          createdAt: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),
});
