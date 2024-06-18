"use client";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";

const useAIStream = (fileContent: string, message: string) => {
  const [streamData, setStreamData] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStreamData = () => {
      const { data: response } = trpc.message.getAIMessage.useQuery({
        message,
        fileContent,
      });
      if (response) {
        if (isMounted) {
          setStreamData(response.content);
        }
      }
    };

    const interval = setInterval(fetchStreamData, 5000);

    fetchStreamData();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [message]);

  return streamData;
};

export default useAIStream;
