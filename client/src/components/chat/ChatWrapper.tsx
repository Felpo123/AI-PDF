"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { ChatContextProvider } from "./ChatContext";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

interface ChatWrapperProps {
  fileID: string;
}

function ChatWrapper({ fileID }: ChatWrapperProps) {
  return (
    <ChatContextProvider fileID={fileID}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages fileID={fileID} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
}

export default ChatWrapper;
