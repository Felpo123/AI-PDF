import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { trpc } from "./app/_trpc/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;

        try {
          const { data: login } = trpc.hello.login.useQuery({ email });
          const user = login as User;
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
