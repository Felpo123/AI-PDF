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
          const { mutate: login } = trpc.hello.login.useMutation({
            onSuccess: ({ email, id, name }) => {
              return {
                email,
                id,
                name,
              } as User;
            },
            onError: () => {
              return null;
            },
          });
          login({ email });
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
