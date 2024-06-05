import { auth } from "@/auth";
import React from "react";

async function Page() {
  const session = await auth();
  return (
    <div>
      {session ? (
        <div>{JSON.stringify(session, null, 2)}</div>
      ) : (
        <div>
          <h1>Dashboard</h1>
          <p>You are not signed in.</p>
        </div>
      )}
    </div>
  );
}

export default Page;
