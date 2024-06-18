"use client";

import { trpc } from "@/app/_trpc/client";
import { useState } from "react";

interface ChatWrapperProps {
  fileID: string;
}

function ChatWrapper({ fileID }: ChatWrapperProps) {
  const [message, setMessage] = useState("");

  const getAIMessageQuery = trpc.message.getAIMessage.useQuery(
    { message, fileContent: fileID },
    {
      enabled: false, // Desactiva la consulta automática
    }
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    getAIMessageQuery.refetch();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message:
          </label>
          <input
            id="message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get AI Message
        </button>
      </form>
      {getAIMessageQuery.isFetching && (
        <p className="mt-4 text-gray-500">Loading...</p>
      )}
      {getAIMessageQuery.data && (
        <p className="mt-4 text-gray-700">
          AI Message: {getAIMessageQuery.data.content}
        </p>
      )}
    </div>
  );
}

export default ChatWrapper;
