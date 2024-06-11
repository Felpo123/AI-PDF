import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { trpc } from "./trpc/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials.email as string;
          const user = await trpc.hello.login.query({ email });

          if (!user) {
            throw new Error("User not found");
          }
          return user as User;
        } catch (error) {
          console.error("xD laksdja");
          return null;
        }
      },
    }),
  ],
});
