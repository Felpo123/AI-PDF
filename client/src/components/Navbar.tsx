import { auth, signOut } from "@/auth";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

async function Navbar() {
  const session = await auth();

  return session ? (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-end border-b border-zinc-200">
          <>
            <form
              action={async (formData) => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit">Cerrar</Button>
            </form>
          </>
        </div>
      </MaxWidthWrapper>
    </nav>
  ) : null;
}

export default Navbar;
