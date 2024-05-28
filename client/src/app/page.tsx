import Image from "next/image";
import { trpcClient } from "./_trpc/client";

export default async function Home() {

  const data  = await trpcClient.hello.helloWord.query("MAX");
  const users = await trpcClient.hello.getUser.query("2");

  console.log(users);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data}
      {users.id && (
        <div>
          <h1>{users.name}</h1>
          <h2>{users.email}</h2>
          <h3>{users.id}</h3>
        </div>
      )  
      }
    </main>
  );
}
