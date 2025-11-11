import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  sidebarMessage: string | null;
  setSidebarMessage: (message: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarMessage, setSidebarMessage] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ sidebarMessage, setSidebarMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};
