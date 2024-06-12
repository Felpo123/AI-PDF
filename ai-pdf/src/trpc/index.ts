import { db } from "@/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";
import { authRouter } from "./authRouter";
import { fileRouter } from "./fileRouter";

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  auth: authRouter,
  file: fileRouter,
});
