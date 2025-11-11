// import { useState } from "react";
// import { Upload, FileText, Trash2, Database, CheckCircle, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Document {
//   id: string;
//   name: string;
//   size: string;
//   uploadDate: string;
//   status: "processing" | "connected" | "error";
// }

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { toast } = useToast();
//   const [documents, setDocuments] = useState<Document[]>([
//     {
//       id: "1",
//       name: "research_paper.pdf",
//       size: "2.4 MB",
//       uploadDate: "2024-01-15",
//       status: "connected"
//     },
//     {
//       id: "2", 
//       name: "annual_report.pdf",
//       size: "8.7 MB",
//       uploadDate: "2024-01-14",
//       status: "connected"
//     }
//   ]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
      
//       // Validate file size (200MB limit)
//       if (file.size > 200 * 1024 * 1024) {
//         toast({
//           title: "File too large",
//           description: "Please select a file smaller than 200MB",
//           variant: "destructive"
//         });
//         return;
//       }

//       // Validate file type
//       if (!file.type.includes('pdf')) {
//         toast({
//           title: "Invalid file type", 
//           description: "Please upload a PDF file",
//           variant: "destructive"
//         });
//         return;
//       }

//       const newDoc: Document = {
//         id: Date.now().toString(),
//         name: file.name,
//         size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//         uploadDate: new Date().toISOString().split('T')[0],
//         status: "processing"
//       };

//       setDocuments([...documents, newDoc]);
      
//       toast({
//         title: "File uploaded",
//         description: "Document is being processed..."
//       });

//       // Simulate processing
//       setTimeout(() => {
//         setDocuments(prev => prev.map(doc => 
//           doc.id === newDoc.id ? { ...doc, status: "connected" } : doc
//         ));
//       }, 3000);
//     }
//   };

//   const deleteDocument = (docId: string) => {
//     setDocuments(documents.filter(doc => doc.id !== docId));
//     toast({
//       title: "Document deleted",
//       description: "The document has been removed from your collection"
//     });
//   };

//   const getStatusIcon = (status: Document["status"]) => {
//     switch (status) {
//       case "connected":
//         return <CheckCircle className="w-4 h-4 text-success" />;
//       case "processing":
//         return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
//       case "error":
//         return <AlertCircle className="w-4 h-4 text-destructive" />;
//     }
//   };

//   return (
//     <Sidebar className={collapsed ? "w-16" : "w-80"}>
//       <SidebarTrigger className="m-2 self-end" />

//       <SidebarContent className="p-4 space-y-6">
//         {/* Document Upload */}
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sm font-medium">
//             {!collapsed && "Document Management"}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <div className="space-y-4">
//                   {/* Upload Button */}
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                     <div className="sidebar-item p-3 border-2 border-dashed border-border hover:border-primary/50 rounded-lg text-center transition-colors">
//                       <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
//                       {!collapsed && (
//                         <div>
//                           <p className="text-sm font-medium">Upload PDF</p>
//                           <p className="text-xs text-muted-foreground">Max 200MB</p>
//                         </div>
//                       )}
//                     </div>
//                   </label>
//                 </div>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* Document List */}
//         {!collapsed && (
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-sm font-medium">
//               Uploaded Documents ({documents.length})
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {documents.length === 0 ? (
//                   <p className="text-xs text-muted-foreground text-center py-4">
//                     No documents uploaded yet
//                   </p>
//                 ) : (
//                   documents.map((doc) => (
//                     <div
//                       key={doc.id}
//                       className="sidebar-item p-3 rounded-lg flex items-start justify-between group"
//                     >
//                       <div className="flex items-start space-x-2 min-w-0 flex-1">
//                         <FileText className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
//                         <div className="min-w-0 flex-1">
//                           <p className="text-xs font-medium truncate" title={doc.name}>
//                             {doc.name}
//                           </p>
//                           <p className="text-xs text-muted-foreground">{doc.size}</p>
//                           <div className="flex items-center space-x-1 mt-1">
//                             {getStatusIcon(doc.status)}
//                             <span className="text-xs text-muted-foreground capitalize">
//                               {doc.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => deleteDocument(doc.id)}
//                         className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}

//         {/* Collection Status */}
//         {!collapsed && (
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-sm font-medium">
//               Vector Database
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <div className="sidebar-item p-3 rounded-lg">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <Database className="w-4 h-4 text-success" />
//                   <span className="text-xs font-medium">Connected to Qdrant</span>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-success rounded-full"></div>
//                   <span className="text-xs text-muted-foreground">
//                     Collection: pdf_embeddingsV3
//                   </span>
//                 </div>
//               </div>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}

//         {/* Delete Documents */}
//         {!collapsed && documents.length > 0 && (
//           <SidebarGroup>
//             <SidebarGroupContent>
//               <Select>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Delete documents..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {documents.map((doc) => (
//                     <SelectItem 
//                       key={doc.id} 
//                       value={doc.id}
//                       onSelect={() => deleteDocument(doc.id)}
//                     >
//                       {doc.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}
//       </SidebarContent>
//     </Sidebar>
//   );
// }


// import { useState } from "react";
// import { Upload, FileText, Trash2, Database, CheckCircle, AlertCircle, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useAuth } from "@/context/AuthContext";

// interface Document {
//   id: string;
//   name: string;
//   size: string;
//   uploadDate: string;
//   status: "processing" | "connected" | "error";
// }

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const [documents, setDocuments] = useState<Document[]>([
//     {
//       id: "1",
//       name: "research_paper.pdf",
//       size: "2.4 MB",
//       uploadDate: "2024-01-15",
//       status: "connected"
//     },
//     {
//       id: "2", 
//       name: "annual_report.pdf",
//       size: "8.7 MB",
//       uploadDate: "2024-01-14",
//       status: "connected"
//     }
//   ]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
      
//       // Validate file size (200MB limit)
//       if (file.size > 200 * 1024 * 1024) {
//         toast({
//           title: "File too large",
//           description: "Please select a file smaller than 200MB",
//           variant: "destructive"
//         });
//         return;
//       }

//       // Validate file type
//       if (!file.type.includes('pdf')) {
//         toast({
//           title: "Invalid file type", 
//           description: "Please upload a PDF file",
//           variant: "destructive"
//         });
//         return;
//       }

//       const newDoc: Document = {
//         id: Date.now().toString(),
//         name: file.name,
//         size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//         uploadDate: new Date().toISOString().split('T')[0],
//         status: "processing"
//       };

//       setDocuments([...documents, newDoc]);
      
//       toast({
//         title: "File uploaded",
//         description: "Document is being processed..."
//       });

//       // Simulate processing
//       setTimeout(() => {
//         setDocuments(prev => prev.map(doc => 
//           doc.id === newDoc.id ? { ...doc, status: "connected" } : doc
//         ));
//       }, 3000);
//     }
//   };

//   const deleteDocument = (docId: string) => {
//     setDocuments(documents.filter(doc => doc.id !== docId));
//     toast({
//       title: "Document deleted",
//       description: "The document has been removed from your collection"
//     });
//   };

//   const getStatusIcon = (status: Document["status"]) => {
//     switch (status) {
//       case "connected":
//         return <CheckCircle className="w-4 h-4 text-green-400" />;
//       case "processing":
//         return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
//       case "error":
//         return <AlertCircle className="w-4 h-4 text-red-400" />;
//     }
//   };

//   return (
//     <Sidebar className={`${collapsed ? "w-16" : "w-80"} bg-neutral-950 border-r border-neutral-700`}>
//       <SidebarTrigger className="m-2 self-end text-neutral-400 hover:text-white" />

//       <SidebarContent className="p-4 space-y-6 flex flex-col h-full">
//         {/* Document Upload */}
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sm font-medium text-neutral-300">
//             {!collapsed && "Document Management"}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <div className="space-y-4">
//                   {/* Upload Button */}
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                     />
//                     <div className="p-3 border-2 border-dashed border-neutral-600 hover:border-blue-500 rounded-lg text-center transition-colors bg-neutral-800">
//                       <Upload className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
//                       {!collapsed && (
//                         <div>
//                           <p className="text-sm font-medium text-white">Upload PDF</p>
//                           <p className="text-xs text-neutral-400">Max 200MB</p>
//                         </div>
//                       )}
//                     </div>
//                   </label>
//                 </div>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* Document List */}
//         {!collapsed && (
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-sm font-medium text-neutral-300">
//               Uploaded Documents ({documents.length})
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {documents.length === 0 ? (
//                   <p className="text-xs text-neutral-400 text-center py-4">
//                     No documents uploaded yet
//                   </p>
//                 ) : (
//                   documents.map((doc) => (
//                     <div
//                       key={doc.id}
//                       className="p-3 rounded-lg flex items-start justify-between group bg-neutral-800 hover:bg-neutral-750"
//                     >
//                       <div className="flex items-start space-x-2 min-w-0 flex-1">
//                         <FileText className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
//                         <div className="min-w-0 flex-1">
//                           <p className="text-xs font-medium truncate text-white" title={doc.name}>
//                             {doc.name}
//                           </p>
//                           <p className="text-xs text-neutral-400">{doc.size}</p>
//                           <div className="flex items-center space-x-1 mt-1">
//                             {getStatusIcon(doc.status)}
//                             <span className="text-xs text-neutral-400 capitalize">
//                               {doc.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         variant="ghost"
//                         onClick={() => deleteDocument(doc.id)}
//                         className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-neutral-400 hover:text-red-400"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}



//         {/* Delete Documents */}
//         {!collapsed && documents.length > 0 && (
//           <SidebarGroup>
//             <SidebarGroupContent>
//               <Select>
//                 <SelectTrigger className="w-full bg-neutral-800 border-neutral-600 text-white">
//                   <SelectValue placeholder="Delete documents..." />
//                 </SelectTrigger>
//                 <SelectContent className="bg-neutral-800 border-neutral-600">
//                   {documents.map((doc) => (
//                     <SelectItem 
//                       key={doc.id} 
//                       value={doc.id}
//                       onSelect={() => deleteDocument(doc.id)}
//                       className="text-white hover:bg-neutral-700"
//                     >
//                       {doc.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}

//         {/* Account Info - Always at bottom */}
//         <div className="mt-auto">
//           {!collapsed && (
//             <div className="border-t border-neutral-700 pt-4">
//               <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition-colors">
//                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                   <User className="w-4 h-4 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-white truncate">{user?.firstName || "User"}</p>
//                   <p className="text-xs text-neutral-400">Free Plan</p>
//                 </div>
//               </div>
//             </div>
//           )}
//           {collapsed && (
//             <div className="border-t border-neutral-700 pt-4">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
//                 <User className="w-4 h-4 text-white" />
//               </div>
//             </div>
//           )}
//         </div>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

// import { useState } from "react";
// import { Upload, FileText, Trash2, CheckCircle, AlertCircle, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useAuth } from "@/context/AuthContext";
// import { useChatContext } from "@/context/ChatContext"; // ✅ import the new context

// interface Document {
//   id: string;
//   name: string;
//   size: string;
//   uploadDate: string;
//   status: "uploading" | "uploaded" | "error";
//   progress?: number;
// }

// export function AppSidebar() {
//   const { state } = useSidebar();
//   const collapsed = state === "collapsed";
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const { setSidebarMessage } = useChatContext(); // ✅ use context hook

//   const [documents, setDocuments] = useState<Document[]>([
//     {
//       id: "1",
//       name: "research_paper.pdf",
//       size: "2.4 MB",
//       uploadDate: "2024-01-15",
//       status: "uploaded",
//       progress: 100,
//     },
//   ]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files?.length) return;

//     const file = files[0];

//     if (file.size > 200 * 1024 * 1024) {
//       toast({
//         title: "File too large",
//         description: "Please select a file smaller than 200MB",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!file.type.includes("pdf")) {
//       toast({
//         title: "Invalid file type",
//         description: "Please upload a PDF file",
//         variant: "destructive",
//       });
//       return;
//     }

//     const newDoc: Document = {
//       id: Date.now().toString(),
//       name: file.name,
//       size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//       uploadDate: new Date().toISOString().split("T")[0],
//       status: "uploading",
//       progress: 0,
//     };

//     setDocuments([...documents, newDoc]);

//     toast({
//       title: "Uploading file...",
//       description: "Your document is being uploaded.",
//     });

//     const uploadInterval = setInterval(() => {
//       setDocuments((prevDocs) =>
//         prevDocs.map((doc) =>
//           doc.id === newDoc.id
//             ? { ...doc, progress: Math.min((doc.progress || 0) + 10, 100) }
//             : doc
//         )
//       );
//     }, 300);

//     setTimeout(() => {
//       clearInterval(uploadInterval);
//       setDocuments((prevDocs) =>
//         prevDocs.map((doc) =>
//           doc.id === newDoc.id
//             ? { ...doc, status: "uploaded", progress: 100 }
//             : doc
//         )
//       );
//       toast({
//         title: "Upload complete",
//         description: "File uploaded successfully!",
//       });
//     }, 3000);
//   };

//   const deleteDocument = (docId: string) => {
//     setDocuments(documents.filter((doc) => doc.id !== docId));
//     toast({
//       title: "Document deleted",
//       description: "The document has been removed.",
//     });
//   };

//   const getStatusDisplay = (doc: Document) => {
//     if (doc.status === "uploading") {
//       return (
//         <div className="w-full mt-1">
//           <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
//             <div
//               className="h-2 bg-blue-500 transition-all duration-200"
//               style={{ width: `${doc.progress || 0}%` }}
//             />
//           </div>
//           <p className="text-xs text-neutral-400 mt-1">
//             Uploading... {doc.progress}%
//           </p>
//         </div>
//       );
//     }

//     if (doc.status === "uploaded") {
//       return (
//         <div className="mt-2 space-y-2">
//           <div className="flex items-center space-x-1">
//             <CheckCircle className="w-4 h-4 text-green-400" />
//             <span className="text-xs text-green-400">
//               File uploaded successfully
//             </span>
//           </div>
//           {/* ✅ Summarize button */}
//           <Button
//             size="sm"
//             onClick={() =>
//               setSidebarMessage(`Summarize ${doc.name} document`)
//             }
//             className="bg-blue-600 hover:bg-blue-700 text-xs text-white px-2 py-1 h-auto"
//           >
//             Summarize
//           </Button>
//         </div>
//       );
//     }

//     if (doc.status === "error") {
//       return (
//         <div className="flex items-center space-x-1 mt-1">
//           <AlertCircle className="w-4 h-4 text-red-400" />
//           <span className="text-xs text-red-400">Error uploading</span>
//         </div>
//       );
//     }
//   };

//   return (
//     <Sidebar
//       className={`${collapsed ? "w-16" : "w-80"} bg-neutral-950 border-r border-neutral-700`}
//     >
//       <SidebarTrigger className="m-2 self-end text-neutral-400 hover:text-white" />

//       <SidebarContent className="p-4 space-y-6 flex flex-col h-full">
//         {/* Document Upload */}
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-sm font-medium text-neutral-300">
//             {!collapsed && "Document Management"}
//           </SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <label className="cursor-pointer">
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                   <div className="p-3 border-2 border-dashed border-neutral-600 hover:border-blue-500 rounded-lg text-center transition-colors bg-neutral-800">
//                     <Upload className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
//                     {!collapsed && (
//                       <div>
//                         <p className="text-sm font-medium text-white">
//                           Upload PDF
//                         </p>
//                         <p className="text-xs text-neutral-400">Max 200MB</p>
//                       </div>
//                     )}
//                   </div>
//                 </label>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         {/* Document List */}
//         {!collapsed && (
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-sm font-medium text-neutral-300">
//               Uploaded Documents ({documents.length})
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {documents.map((doc) => (
//                   <div
//                     key={doc.id}
//                     className="p-3 rounded-lg flex items-start justify-between group bg-neutral-800 hover:bg-neutral-750"
//                   >
//                     <div className="flex items-start space-x-2 min-w-0 flex-1">
//                       <FileText className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
//                       <div className="min-w-0 flex-1">
//                         <p
//                           className="text-xs font-medium truncate text-white"
//                           title={doc.name}
//                         >
//                           {doc.name}
//                         </p>
//                         <p className="text-xs text-neutral-400">{doc.size}</p>
//                         {getStatusDisplay(doc)}
//                       </div>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => deleteDocument(doc.id)}
//                       className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-neutral-400 hover:text-red-400"
//                     >
//                       <Trash2 className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         )}
//       </SidebarContent>
//     </Sidebar>
//   );
// }

import { useState } from "react";
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useChatContext } from "@/context/ChatContext";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "uploading" | "uploaded" | "error";
  progress?: number;
}

const MAX_DOCUMENTS = 5;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { toast } = useToast();
  const { user } = useAuth();
  const { setSidebarMessage } = useChatContext();

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "research_paper.pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "uploaded",
      progress: 100,
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (documents.length >= MAX_DOCUMENTS) {
      toast({
        title: "Upload limit reached",
        description:
          "You can upload a maximum of 5 documents. Please delete one to add a new file.",
        variant: "destructive",
      });
      return;
    }

    const file = files[0];

    if (file.size > 200 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 200MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "uploading",
      progress: 0,
    };

    setDocuments([...documents, newDoc]);

    toast({
      title: "Uploading file...",
      description: "Your document is being uploaded.",
    });

    const uploadInterval = setInterval(() => {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === newDoc.id
            ? { ...doc, progress: Math.min((doc.progress || 0) + 10, 100) }
            : doc
        )
      );
    }, 300);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === newDoc.id
            ? { ...doc, status: "uploaded", progress: 100 }
            : doc
        )
      );
      toast({
        title: "Upload complete",
        description: "File uploaded successfully!",
      });
    }, 3000);
  };

  const deleteDocument = (docId: string) => {
    setDocuments(documents.filter((doc) => doc.id !== docId));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your collection.",
    });
  };

  const getStatusDisplay = (doc: Document) => {
    if (doc.status === "uploading") {
      return (
        <div className="w-full mt-1">
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 transition-all duration-200"
              style={{ width: `${doc.progress || 0}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Uploading... {doc.progress}%
          </p>
        </div>
      );
    }

    if (doc.status === "uploaded") {
      return (
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400">
              File uploaded successfully
            </span>
          </div>
          <Button
            size="sm"
            onClick={() =>
              setSidebarMessage(`Summarize ${doc.name} document`)
            }
            className="bg-blue-600 hover:bg-blue-700 text-xs text-white px-2 py-1 h-auto"
          >
            Summarize
          </Button>
        </div>
      );
    }

    if (doc.status === "error") {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400">Error uploading</span>
        </div>
      );
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-80"} bg-neutral-950 border-r border-neutral-700 flex flex-col justify-between`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <SidebarTrigger className="m-2 self-end text-neutral-400 hover:text-white" />

        <SidebarContent className="flex flex-col flex-1 p-4 space-y-4 overflow-hidden">
          {/* Upload Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-neutral-300">
              {!collapsed && "Document Management"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="p-3 border-2 border-dashed border-neutral-600 hover:border-blue-500 rounded-lg text-center transition-colors bg-neutral-800">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
                      {!collapsed && (
                        <div>
                          <p className="text-sm font-medium text-white">
                            Upload PDF
                          </p>
                          <p className="text-xs text-neutral-400">Max 200MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Uploaded Documents - fills rest of space */}
          {!collapsed && (
            <SidebarGroup className="flex-1 flex flex-col min-h-0">
              <SidebarGroupLabel className="text-sm font-medium text-neutral-300 mb-2">
                Uploaded Documents ({documents.length}/{MAX_DOCUMENTS})
              </SidebarGroupLabel>
              <SidebarGroupContent className="flex-1 min-h-0">
                <div className="space-y-2 overflow-y-auto pr-1 h-full">
                  {documents.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-4">
                      No documents uploaded yet
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg flex items-start justify-between group bg-neutral-800 hover:bg-neutral-750"
                      >
                        <div className="flex items-start space-x-2 min-w-0 flex-1">
                          <FileText className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs font-medium truncate text-white"
                              title={doc.name}
                            >
                              {doc.name}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {doc.size}
                            </p>
                            {getStatusDisplay(doc)}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocument(doc.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </div>

      {/* Profile pinned to bottom with underline */}
      <div className="border-t border-neutral-700 p-4">
        {!collapsed ? (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-neutral-400">Free Plan</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </Sidebar>
  );
}
