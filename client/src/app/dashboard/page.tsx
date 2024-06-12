import { auth } from "@/auth";
import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();
  console.log(session);
  return <Dashboard userId={session?.user?.id||""} />;

}

export default Page;
