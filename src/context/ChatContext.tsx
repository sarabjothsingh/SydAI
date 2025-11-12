import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type SidebarRequest =
  | { type: "query"; text: string }
  | { type: "summarize"; filenames: string[] };

interface ChatContextType {
  sidebarRequest: SidebarRequest | null;
  setSidebarRequest: (request: SidebarRequest | null) => void;
  selectedModel: string | null;
  setSelectedModel: (modelId: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarRequest, setSidebarRequest] = useState<SidebarRequest | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const value = useMemo(
    () => ({ sidebarRequest, setSidebarRequest, selectedModel, setSelectedModel }),
    [sidebarRequest, selectedModel]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChatContext must be used within a ChatProvider");
  return context;
};
