"use client";

import { trpc } from "@/app/_trpc/client";
import PdfRenderer from "@/components/PdfRenderer";
import ChatWrapper from "@/components/chat/ChatWrapper";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: {
    fileid: string;
  };
}

function Page({ params }: PageProps) {
  const { fileid } = params;

  const { data: file, isLoading } = trpc.file.getFile.useQuery({
    fileId: fileid,
  });

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            ) : (
              <PdfRenderer content={file ? file?.content : ""} />
            )}
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0 ">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="my-24 h-6 w-6 animate-spin" />
            </div>
          ) : (
            <ChatWrapper fileID={file ? file.id : ""} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
