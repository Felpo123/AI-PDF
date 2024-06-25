import { trpc } from "@/app/_trpc/client";
import { createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";

type StreamAIResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamAIResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface ChatProviderProps {
  fileID: string;
  children: React.ReactNode;
}

export const ChatContextProvider = ({
  fileID,
  children,
}: ChatProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const trpcUtils = trpc.useUtils();

  const { toast } = useToast();

  const backupMessage = useRef("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const { mutate: sendMessage } = trpc.message.getAIMessage.useMutation({
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await trpcUtils.message.getFileMessages.cancel();

      const previousMessages =
        trpcUtils.message.getFileMessages.getInfiniteData();

      trpcUtils.message.getFileMessages.setInfiniteData(
        { fileID, limit: 10 },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];

          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async ({ content }) => {
      setIsLoading(false);

      if (!content) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      trpcUtils.message.getFileMessages.setInfiniteData(
        { fileID, limit: 10 },
        (old) => {
          if (!old) return { pages: [], pageParams: [] };

          let isAiResponseCreated = old.pages.some((page) =>
            page.messages.some((message) => message.id === "ai-response")
          );

          let updatedPages = old.pages.map((page) => {
            if (page === old.pages[0]) {
              let updatedMessages;

              if (!isAiResponseCreated) {
                updatedMessages = [
                  {
                    createdAt: new Date().toISOString(),
                    id: "ai-response",
                    text: content,
                    isUserMessage: false,
                  },
                  ...page.messages,
                ];
              } else {
                updatedMessages = page.messages.map((message) => {
                  if (message.id === "ai-response") {
                    return {
                      ...message,
                      text: content,
                    };
                  }
                  return message;
                });
              }

              return {
                ...page,
                messages: updatedMessages,
              };
            }

            return page;
          });

          return { ...old, pages: updatedPages };
        }
      );
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      trpcUtils.message.getFileMessages.setData(
        { fileID },
        {
          messages: context?.previousMessages ?? [],
        }
      );
    },
    onSettled: async () => {
      setIsLoading(false);

      await trpcUtils.message.getFileMessages.invalidate({ fileID });
    },
  });

  const addMessage = () => sendMessage({ fileID, message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
