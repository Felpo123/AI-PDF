import { router } from ".";
import { authRouter } from "./authRouter";
import { fileRouter } from "./fileRouter";
import { messageRouter } from "./messageRouter";

export const appRouter = router({
  auth: authRouter,
  file: fileRouter,
  message: messageRouter,
});
