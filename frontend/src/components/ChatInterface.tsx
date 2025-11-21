//                 <div className="bg-gray-700 rounded-2xl px-4 py-3">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Input Area - Centered */}
//       <div className={`p-6 transition-all duration-300 ${sidebarOpen ? 'ml-8' : ''}`}>
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-end space-x-3 bg-neutral-800 rounded-xl p-2">
//             <Textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Message ChatGPT..."
//               className="flex-1 bg-transparent border-none resize-none min-h-[24px] max-h-32 text-white placeholder-neutral-400 focus:ring-0 focus:outline-none p-2"
//               disabled={isLoading}
//             />
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim() || isLoading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
//               size="sm"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//           <p className="text-xs text-neutral-500 text-center mt-2">
//             Using {models.find(m => m.value === selectedModel)?.label} • 
//             Press Enter to send, Shift+Enter for new line
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

// import { useState } from "react";
// import { Send, Bot, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useSidebar } from "@/components/ui/sidebar";
// import { useAuth } from "@/context/AuthContext";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Message {
//   id: string;
//   content: string;
//   sender: "user" | "assistant";
//   timestamp: Date;
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedModel, setSelectedModel] = useState("gpt-4");
//   const [isLoading, setIsLoading] = useState(false);
//   const { toggleSidebar, state } = useSidebar();
//   const sidebarOpen = state === "expanded";
//   const { user } = useAuth();
//   const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

//   const handleLogout = () => {
//     window.location.href = `${API_BASE}/logout`;
//   };

//   const models = [
//     { value: "gpt-4", label: "GPT-4" },
//     { value: "claude-3", label: "Claude 3" },
//     { value: "mistral-large", label: "Mistral Large" },
//     { value: "llama-2", label: "LLaMA 2" },
//   ];

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsLoading(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: `I'm a demo AI assistant using ${
//           models.find((m) => m.value === selectedModel)?.label
//         }. I've received your message: "${userMessage.content}". This is a simulated response for demonstration purposes.`,
//         sender: "assistant",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-neutral-900">
//       {/* Chat Header */}
//       <div className="border-b border-neutral-700 p-4">
//         <div className="flex items-center justify-between">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="text-neutral-400 hover:text-white hover:bg-neutral-800"
//           >
//             <Menu className="w-5 h-5" />
//           </Button>
//           <div className="flex items-center gap-2">
//             <Select value={selectedModel} onValueChange={setSelectedModel}>
//               <SelectTrigger className="w-48 bg-neutral-800 border-neutral-600 text-white">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent className="bg-neutral-800 border-neutral-600">
//                 {models.map((model) => (
//                   <SelectItem
//                     key={model.value}
//                     value={model.value}
//                     className="text-white hover:bg-neutral-700"
//                   >
//                     {model.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleLogout}
//               className="border-neutral-600 text-neutral-200 hover:bg-neutral-800"
//             >
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div
//         className={`flex-1 overflow-y-auto transition-all duration-300 ${
//           sidebarOpen ? "ml-8" : ""
//         }`}
//       >
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Bot className="w-8 h-8 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2 text-white">{`Hello ${
//                 user?.firstName || "User"
//               }!`}</h3>
//               <p className="text-neutral-400 max-w-md mx-auto">
//                 What's on your mind today?
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6 p-4">
//             {messages.map((message) => (
//               <div key={message.id} className="animate-fade-in">
//                 {message.sender === "user" ? (
//                   <div className="flex justify-end">
//                     <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3">
//                       <p className="whitespace-pre-wrap">{message.content}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     className={`flex items-start space-x-3 transition-all duration-300 ${
//                       sidebarOpen ? "pl-6" : "pl-0"
//                     }`}
//                   >
//                     <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
//                       <Bot className="w-4 h-4 text-green-400" />
//                     </div>
//                     <div className="max-w-[70%] bg-neutral-800 text-white rounded-2xl px-4 py-3">
//                       <p className="whitespace-pre-wrap">{message.content}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div
//                 className={`flex items-start space-x-3 animate-fade-in transition-all duration-300 ${
//                   sidebarOpen ? "pl-6" : "pl-0"
//                 }`}
//               >
//                 <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
//                   <Bot className="w-4 h-4 text-green-400" />
//                 </div>
//                 <div className="bg-gray-700 rounded-2xl px-4 py-3">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
//                       style={{ animationDelay: "0.2s" }}
//                     />
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
//                       style={{ animationDelay: "0.4s" }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Input Area - Centered */}
//       <div
//         className={`p-6 transition-all duration-300 ${
//           sidebarOpen ? "ml-8" : ""
//         }`}
//       >
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-end space-x-3 bg-neutral-800 rounded-xl p-2">
//             <Textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Message ChatGPT..."
//               className="flex-1 bg-transparent border-none resize-none min-h-[24px] max-h-32 text-white placeholder-neutral-400 focus:ring-0 focus:outline-none p-2"
//               disabled={isLoading}
//             />
//             <Button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim() || isLoading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
//               size="sm"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//           <p className="text-xs text-neutral-500 text-center mt-2">
//             Using {models.find((m) => m.value === selectedModel)?.label} • Press
//             Enter to send, Shift+Enter for new line
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;


// import { useState, useEffect } from "react";
// import { Send, Bot, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useSidebar } from "@/components/ui/sidebar";
// import { useAuth } from "@/context/AuthContext";
// import { useChatContext } from "@/context/ChatContext"; // ✅ import
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Message {
//   id: string;
//   content: string;
//   sender: "user" | "assistant";
//   timestamp: Date;
// }

// const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [selectedModel, setSelectedModel] = useState("gpt-4");
//   const [isLoading, setIsLoading] = useState(false);
//   const { toggleSidebar, state } = useSidebar();
//   const sidebarOpen = state === "expanded";
//   const { user } = useAuth();
//   const { sidebarMessage, setSidebarMessage } = useChatContext(); // ✅ receive sidebar message

//   const API_BASE =
//     (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

//   const handleLogout = () => {
//     window.location.href = `${API_BASE}/logout`;
//   };

//   const models = [
//     { value: "gpt-4", label: "GPT-4" },
//     { value: "claude-3", label: "Claude 3" },
//     { value: "mistral-large", label: "Mistral Large" },
//     { value: "llama-2", label: "LLaMA 2" },
//   ];

//   const handleSendMessage = async (customInput?: string) => {
//     const text = customInput ?? inputValue;
//     if (!text.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: text,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setIsLoading(true);

//     setTimeout(() => {
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: `I'm a demo AI assistant using ${
//           models.find((m) => m.value === selectedModel)?.label
//         }. I've received your message: "${userMessage.content}". This is a simulated response for demonstration purposes.`,
//         sender: "assistant",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   // ✅ Auto-send message from sidebar
//   useEffect(() => {
//     if (sidebarMessage) {
//       handleSendMessage(sidebarMessage);
//       setSidebarMessage(null);
//     }
//   }, [sidebarMessage]);

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full bg-neutral-900">
//       {/* Chat Header */}
//       <div className="border-b border-neutral-700 p-4">
//         <div className="flex items-center justify-between">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="text-neutral-400 hover:text-white hover:bg-neutral-800"
//           >
//             <Menu className="w-5 h-5" />
//           </Button>
//           <div className="flex items-center gap-2">
//             <Select value={selectedModel} onValueChange={setSelectedModel}>
//               <SelectTrigger className="w-48 bg-neutral-800 border-neutral-600 text-white">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent className="bg-neutral-800 border-neutral-600">
//                 {models.map((model) => (
//                   <SelectItem
//                     key={model.value}
//                     value={model.value}
//                     className="text-white hover:bg-neutral-700"
//                   >
//                     {model.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleLogout}
//               className="border-neutral-600 text-neutral-200 hover:bg-neutral-800"
//             >
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div
//         className={`flex-1 overflow-y-auto transition-all duration-300 ${
//           sidebarOpen ? "ml-8" : ""
//         }`}
//       >
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Bot className="w-8 h-8 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2 text-white">{`Hello ${
//                 user?.firstName || "User"
//               }!`}</h3>
//               <p className="text-neutral-400 max-w-md mx-auto">
//                 What's on your mind today?
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6 p-4">
//             {messages.map((message) => (
//               <div key={message.id} className="animate-fade-in">
//                 {message.sender === "user" ? (
//                   <div className="flex justify-end">
//                     <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3">
//                       <p className="whitespace-pre-wrap">{message.content}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     className={`flex items-start space-x-3 transition-all duration-300 ${
//                       sidebarOpen ? "pl-6" : "pl-0"
//                     }`}
//                   >
//                     <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
//                       <Bot className="w-4 h-4 text-green-400" />
//                     </div>
//                     <div className="max-w-[70%] bg-neutral-800 text-white rounded-2xl px-4 py-3">
//                       <p className="whitespace-pre-wrap">{message.content}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div
//                 className={`flex items-start space-x-3 animate-fade-in transition-all duration-300 ${
//                   sidebarOpen ? "pl-6" : "pl-0"
//                 }`}
//               >
//                 <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
//                   <Bot className="w-4 h-4 text-green-400" />
//                 </div>
//                 <div className="bg-gray-700 rounded-2xl px-4 py-3">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
//                       style={{ animationDelay: "0.2s" }}
//                     />
//                     <div
//                       className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
//                       style={{ animationDelay: "0.4s" }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div
//         className={`p-6 transition-all duration-300 ${
//           sidebarOpen ? "ml-8" : ""
//         }`}
//       >
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-end space-x-3 bg-neutral-800 rounded-xl p-2">
//             <Textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Message ChatGPT..."
//               className="flex-1 bg-transparent border-none resize-none min-h-[24px] max-h-32 text-white placeholder-neutral-400 focus:ring-0 focus:outline-none p-2"
//               disabled={isLoading}
//             />
//             <Button
//               onClick={() => handleSendMessage()}
//               disabled={!inputValue.trim() || isLoading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
//               size="sm"
//             >
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//           <p className="text-xs text-neutral-500 text-center mt-2">
//             Using {models.find((m) => m.value === selectedModel)?.label} • Press
//             Enter to send, Shift+Enter for new line
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Send, Bot, Menu, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useChatContext, SidebarRequest } from "@/context/ChatContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchModels, ModelConfig, queryAI, summarizeDocuments } from "@/lib/aiClient";

interface Citation {
  id: string;
  filename?: string;
  pageNumber?: number;
  score?: number;
  snippet?: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  citations?: Citation[];
  isError?: boolean;
}

const makeId = () => (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

const truncate = (value: string, max = 160) => {
  if (!value) return "";
  return value.length > max ? `${value.substring(0, max)}…` : value;
};

const buildUserMessage = (content: string): Message => ({
  id: makeId(),
  content,
  sender: "user",
  timestamp: new Date(),
});

const buildAssistantMessage = (content: string, citations?: Citation[], isError = false): Message => ({
  id: makeId(),
  content,
  sender: "assistant",
  timestamp: new Date(),
  citations,
  isError,
});

const parseCitations = (matches: any[] = []): Citation[] =>
  matches
      .map((match, index) => {
      const payload = match?.payload ?? {};
      const metadata = payload.metadata ?? {};
      const pageNumber = metadata.page_number ?? metadata.pageNumber;
      return {
        id: String(match?.id ?? `${index}`),
        filename: metadata.filename,
        pageNumber: typeof pageNumber === "number" ? pageNumber : Number(pageNumber) || undefined,
        score: typeof match?.score === "number" ? match.score : undefined,
        snippet: truncate(payload.text ?? ""),
      } as Citation;
    })
    .filter((citation) => Boolean(citation.filename || citation.snippet));

const handleSidebarRequestDescription = (request: SidebarRequest) => {
  if (request.type === "summarize") {
    if (request.filenames.length === 0) return "Summarize indexed documents";
    return `Summarize documents: ${request.filenames.join(", ")}`;
  }
  return request.text;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const { toggleSidebar, state } = useSidebar();
  const sidebarOpen = state === "expanded";
  const { user } = useAuth();
  const { sidebarRequest, setSidebarRequest, selectedModel, setSelectedModel } = useChatContext();
  const selectedModelRef = useRef<string | null>(null);

  const handleLogout = () => {
    window.location.href = `/logout`;
  };

  useEffect(() => {
    selectedModelRef.current = selectedModel;
  }, [selectedModel]);

  useEffect(() => {
    let active = true;
    setModelsLoading(true);

    fetchModels()
      .then((fetched) => {
        if (!active) return;
        setModels(fetched);
        setModelError(null);
        if (!selectedModelRef.current && fetched.length) {
          setSelectedModel(fetched[0].id);
        }
      })
      .catch((error) => {
        if (!active) return;
        setModelError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (active) setModelsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [setSelectedModel]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text) return;

      if (!selectedModel) {
        setMessages((prev) => [
          ...prev,
          buildAssistantMessage("Please select a model before sending a message.", undefined, true),
        ]);
        return;
      }

      const userMessage = buildUserMessage(text);
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      try {
        const response = await queryAI(text, selectedModel);
        const citations = parseCitations(response.matches);
        setMessages((prev) => [...prev, buildAssistantMessage(response.answer, citations)]);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setMessages((prev) => [...prev, buildAssistantMessage(`Error: ${message}`, undefined, true)]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedModel]
  );

  const processSidebarRequest = useCallback(
    async (request: SidebarRequest) => {
      try {
        if (request.type === "query") {
          await sendMessage(request.text);
          return;
        }

        const description = handleSidebarRequestDescription(request);
        setMessages((prev) => [...prev, buildUserMessage(description)]);

        if (!selectedModel) {
          setMessages((prev) => [
            ...prev,
            buildAssistantMessage("Please select a model before summarizing.", undefined, true),
          ]);
          return;
        }

        setIsLoading(true);
        try {
          const { summary } = await summarizeDocuments(selectedModel, request.filenames);
          setMessages((prev) => [...prev, buildAssistantMessage(summary)]);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setMessages((prev) => [
            ...prev,
            buildAssistantMessage(`Error generating summary: ${message}`, undefined, true),
          ]);
        } finally {
          setIsLoading(false);
        }
      } finally {
        setSidebarRequest(null);
      }
    },
    [selectedModel, sendMessage, setSidebarRequest]
  );

  useEffect(() => {
    if (!sidebarRequest) return;
    void processSidebarRequest(sidebarRequest);
  }, [sidebarRequest, processSidebarRequest]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(inputValue);
    }
  };

  const selectedModelLabel = useMemo(
    () => models.find((model) => model.id === selectedModel)?.display_name,
    [models, selectedModel]
  );

  const renderMarkdown = (content: string, variant: "user" | "assistant") => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`prose prose-invert max-w-none text-sm leading-relaxed ${
        variant === "assistant" ? "prose-headings:text-white prose-strong:text-white" : ""
      }`}
      components={{
        p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0" />,
        ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 mb-3" />,
        ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-6 mb-3" />,
        li: ({ node, ...props }) => <li {...props} className="mb-1" />,
        h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-semibold mt-4 mb-2" />,
        h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-semibold mt-4 mb-2" />,
        h3: ({ node, ...props }) => <h3 {...props} className="text-base font-semibold mt-3 mb-2" />,
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table {...props} className="w-full border border-white/20 text-sm" />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th {...props} className="border border-white/20 px-2 py-1 text-left font-semibold" />
        ),
        td: ({ node, ...props }) => <td {...props} className="border border-white/10 px-2 py-1 align-top" />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            {...props}
            className="border-l-4 border-blue-500/70 pl-4 italic text-white/80 mb-4"
          />
        ),
        code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode } & Record<string, any>) => (
          inline ? (
            <code
              {...props}
              className={`rounded bg-white/10 px-1 py-0.5 text-xs ${className ?? ""}`}
            >
              {children}
            </code>
          ) : (
            <pre className="rounded-lg bg-black/50 p-3 text-xs overflow-x-auto mb-4">
              <code {...props} className={className}>
                {children}
              </code>
            </pre>
          )
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="grid h-full w-full grid-rows-[auto,1fr,auto] bg-neutral-900">
      {/* Chat Header */}
      <div className="border-b border-neutral-800/70 bg-neutral-900/95 backdrop-blur px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Select
              value={selectedModel ?? undefined}
              onValueChange={setSelectedModel}
              disabled={modelsLoading || !models.length}
            >
              <SelectTrigger className="w-56 bg-neutral-800 border-neutral-600 text-white">
                <SelectValue placeholder={modelsLoading ? "Loading models..." : "Select model"} />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                {models.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="text-white hover:bg-neutral-700"
                  >
                    {model.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-neutral-600 text-neutral-200 hover:bg-neutral-800"
            >
              Logout
            </Button>
          </div>
        </div>
        {modelError && (
          <p className="mt-2 text-xs text-red-400">Failed to load models: {modelError}</p>
        )}
      </div>

      {/* Messages Area */}
      <div
        className={`overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "lg:pl-8" : ""
        }`}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">{`Hello ${
                user?.firstName || "User"
              }!`}</h3>
              <p className="text-neutral-400 max-w-md mx-auto">
                What's on your mind today?
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                {message.sender === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3">
                      {renderMarkdown(message.content, "user")}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-start space-x-3 transition-all duration-300 ${
                      sidebarOpen ? "lg:pl-6" : "pl-0"
                    }`}
                  >
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-green-400" />
                    </div>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.isError ? "bg-red-900/40 text-red-100" : "bg-neutral-800 text-white"
                      }`}
                    >
                      {renderMarkdown(message.content, "assistant")}
                      {message.citations?.length ? (
                        <div className="mt-3 space-y-2 border-t border-white/10 pt-2">
                          <p className="text-xs font-semibold tracking-wide text-white/70">Sources</p>
                          <ul className="space-y-2 text-xs text-white/80">
                            {message.citations.map((citation) => (
                              <li key={citation.id} className="flex items-start gap-2">
                                <FileText className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">{citation.filename ?? "Unknown"}</span>
                                  {citation.pageNumber ? ` • Page ${citation.pageNumber}` : ""}
                                  {typeof citation.score === "number"
                                    ? ` • Score ${citation.score.toFixed(3)}`
                                    : ""}
                                  {citation.snippet ? (
                                    <p className="mt-1 text-white/60">“{citation.snippet}”</p>
                                  ) : null}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                className={`flex items-start space-x-3 animate-fade-in transition-all duration-300 ${
                  sidebarOpen ? "lg:pl-6" : "pl-0"
                }`}
              >
                <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-400" />
                </div>
                <div className="bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className={`border-t border-neutral-800/60 bg-neutral-900/95 px-4 py-5 transition-all duration-300 ${
          sidebarOpen ? "lg:pl-8" : ""
        }`}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="flex items-end gap-3 rounded-xl bg-neutral-800/90 p-3 shadow-sm shadow-black/20">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message your AI assistant..."
              className="flex-1 resize-none border-none bg-transparent p-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-0 max-h-48"
              disabled={isLoading || modelsLoading || !selectedModel}
            />
            <Button
              onClick={() => void sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading || !selectedModel}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-2">
            {selectedModelLabel ? `Using ${selectedModelLabel}` : "Select a model to begin."} • Press Enter to send,
            Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;


