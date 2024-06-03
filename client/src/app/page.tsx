"use client";

import { trpc } from "./_trpc/client";
import { auth, signIn, signOut } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        await signIn("credentials", formData);
      }}
    >
      <label>
        Email
        <input name="email" type="email" className="text-black" />
      </label>
      <button>Sign In</button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}

export default function Home() {
  const { data: user, isLoading } = trpc.hello.getUser.useQuery("1");
  console.log({ user, isLoading });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to tRPC</h1>
      <pre className="mt-4">
        {isLoading ? "Loading..." : JSON.stringify(user, null, 2)}
      </pre>
    </main>
  );
}
