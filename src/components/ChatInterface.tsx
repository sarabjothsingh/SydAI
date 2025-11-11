// import { useState } from "react";
// import { Send, Bot, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
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

//   const models = [
//     { value: "gpt-4", label: "GPT-4" },
//     { value: "claude-3", label: "Claude 3" },
//     { value: "mistral-large", label: "Mistral Large" },
//     { value: "llama-2", label: "LLaMA 2" }
//   ];

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       sender: "user",
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue("");
//     setIsLoading(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: `I'm a demo AI assistant using ${models.find(m => m.value === selectedModel)?.label}. I've received your message: "${userMessage.content}". This is a simulated response for demonstration purposes.`,
//         sender: "assistant",
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Chat Header */}
//       <div className="border-b border-border/20 p-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-semibold">AI Chat</h2>
//           <Select value={selectedModel} onValueChange={setSelectedModel}>
//             <SelectTrigger className="w-48">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {models.map((model) => (
//                 <SelectItem key={model.value} value={model.value}>
//                   {model.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Bot className="w-8 h-8 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Hello, User! 👋</h3>
//             <p className="text-muted-foreground max-w-md mx-auto">
//               I'm your AI assistant. Ask me anything or upload documents to get started. 
//               I can help you analyze content, answer questions, and have meaningful conversations.
//             </p>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex items-start space-x-3 animate-fade-in ${
//                 message.sender === "user" ? "justify-end" : ""
//               }`}
//             >
//               {message.sender === "assistant" && (
//                 <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
//                   <Bot className="w-4 h-4 text-primary" />
//                 </div>
//               )}
              
//               <div
//                 className={`max-w-[70%] rounded-2xl p-4 ${
//                   message.sender === "user"
//                     ? "bg-primary text-primary-foreground"
//                     : "card-gradient"
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap">{message.content}</p>
//                 <span className="text-xs opacity-70 mt-2 block">
//                   {message.timestamp.toLocaleTimeString()}
//                 </span>
//               </div>
              
//               {message.sender === "user" && (
//                 <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
//                   <User className="w-4 h-4 text-accent" />
//                 </div>
//               )}
//             </div>
//           ))
//         )}
        
//         {isLoading && (
//           <div className="flex items-start space-x-3 animate-fade-in">
//             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//               <Bot className="w-4 h-4 text-primary" />
//             </div>
//             <div className="card-gradient rounded-2xl p-4">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
//                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="border-t border-border/20 p-4">
//         <div className="flex space-x-3 items-end">
//           <div className="flex-1">
//             <Textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
//               className="chat-input resize-none min-h-[60px] max-h-32"
//               disabled={isLoading}
//             />
//           </div>
//           <Button
//             onClick={handleSendMessage}
//             disabled={!inputValue.trim() || isLoading}
//             className="bg-gradient-primary hover:opacity-90 transition-opacity px-6 py-3"
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         </div>
//         <p className="text-xs text-muted-foreground mt-2">
//           Using {models.find(m => m.value === selectedModel)?.label} • 
//           Press Enter to send, Shift+Enter for new line
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

// import { useState } from "react";
// import { Send, Bot, User, Menu } from "lucide-react";
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
//     // Let the server clear the session then redirect back to /login
//     window.location.href = `${API_BASE}/logout`;
//   };

//   const models = [
//     { value: "gpt-4", label: "GPT-4" },
//     { value: "claude-3", label: "Claude 3" },
//     { value: "mistral-large", label: "Mistral Large" },
//     { value: "llama-2", label: "LLaMA 2" }
//   ];

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: inputValue,
//       sender: "user",
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue("");
//     setIsLoading(true);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         content: `I'm a demo AI assistant using ${models.find(m => m.value === selectedModel)?.label}. I've received your message: "${userMessage.content}". This is a simulated response for demonstration purposes.`,
//         sender: "assistant",
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
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
//                   <SelectItem key={model.value} value={model.value} className="text-white hover:bg-neutral-700">
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
//       <div className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-8' : ''}`}>
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Bot className="w-8 h-8 text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-semibold mb-2 text-white">{`Hello ${user?.firstName || "User"}!`}</h3>
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
//                   <div className="flex items-start space-x-3">
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
//               <div className="flex items-start space-x-3 animate-fade-in">
//                 <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
//                   <Bot className="w-4 h-4 text-green-400" />
//                 </div>
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

import { useState, useEffect } from "react";
import { Send, Bot, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useChatContext } from "@/context/ChatContext"; // ✅ import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("phi-3"); // ✅ Default model
  const [isLoading, setIsLoading] = useState(false);
  const { toggleSidebar, state } = useSidebar();
  const sidebarOpen = state === "expanded";
  const { user } = useAuth();
  const { sidebarMessage, setSidebarMessage } = useChatContext(); // ✅ receive sidebar message

  const API_BASE =
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

  const handleLogout = () => {
    window.location.href = `${API_BASE}/logout`;
  };

  // ✅ Updated model list
  const models = [
    { value: "phi-3", label: "Phi-3 (Ollama)" }, // Default model
    { value: "groq-llama3.3-70b", label: "Groq - Llama3.3 70B" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "groq-gpt-oss-120b", label: "Groq - GPT-OSS 120B" },
  ];

  const handleSendMessage = async (customInput?: string) => {
    const text = customInput ?? inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // 🧠 Simulated AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm a demo AI assistant using ${
          models.find((m) => m.value === selectedModel)?.label
        }. I've received your message: "${userMessage.content}". This is a simulated response for demonstration purposes.`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // ✅ Auto-send message from sidebar
  useEffect(() => {
    if (sidebarMessage) {
      handleSendMessage(sidebarMessage);
      setSidebarMessage(null);
    }
  }, [sidebarMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Chat Header */}
      <div className="border-b border-neutral-700 p-4">
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
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 bg-neutral-800 border-neutral-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                {models.map((model) => (
                  <SelectItem
                    key={model.value}
                    value={model.value}
                    className="text-white hover:bg-neutral-700"
                  >
                    {model.label}
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
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? "ml-8" : ""
        }`}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
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
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                {message.sender === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-start space-x-3 transition-all duration-300 ${
                      sidebarOpen ? "pl-6" : "pl-0"
                    }`}
                  >
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="max-w-[70%] bg-neutral-800 text-white rounded-2xl px-4 py-3">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                className={`flex items-start space-x-3 animate-fade-in transition-all duration-300 ${
                  sidebarOpen ? "pl-6" : "pl-0"
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
        className={`p-6 transition-all duration-300 ${
          sidebarOpen ? "ml-8" : ""
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3 bg-neutral-800 rounded-xl p-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message your AI assistant..."
              className="flex-1 bg-transparent border-none resize-none min-h-[24px] max-h-32 text-white placeholder-neutral-400 focus:ring-0 focus:outline-none p-2"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-2">
            Using {models.find((m) => m.value === selectedModel)?.label} • Press
            Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;


