import NextAuth, { DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { trpc } from "./trpc/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials.email as string;
          const user = await trpc.auth.login.query({ email });

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
  callbacks: {
    session({ session, user, token }) {
      console.log("session", session, token);
      session.user.id = token.sub as string;
      return session;
    },
  },
});
