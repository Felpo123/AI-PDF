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
        fileContent: z.string(),
      })
    )
    .query(async ({ input }) => {
      const fileContent = await db.file.findFirst({
        where: { id: input.fileContent },
      });
      if (!fileContent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      const streamingAIResponse = await generateContent(
        fileContent.content,
        "HACE UN RESUMEN DEL CONTENIDO Xd"
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
      console.log("chunks", chunks.join(""));
      return { content: chunks.join("") };
    }),
});
