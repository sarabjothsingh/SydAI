import { useState } from "react";
import { Upload, FileText, Trash2, Database, CheckCircle, AlertCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Document {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "processing" | "connected" | "error";
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "research_paper.pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "connected"
    },
    {
      id: "2", 
      name: "annual_report.pdf",
      size: "8.7 MB",
      uploadDate: "2024-01-14",
      status: "connected"
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file size (200MB limit)
      if (file.size > 200 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 200MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      if (!file.type.includes('pdf')) {
        toast({
          title: "Invalid file type", 
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }

      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "processing"
      };

      setDocuments([...documents, newDoc]);
      
      toast({
        title: "File uploaded",
        description: "Document is being processed..."
      });

      // Simulate processing
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id ? { ...doc, status: "connected" } : doc
        ));
      }, 3000);
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your collection"
    });
  };

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "processing":
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-80"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="p-4 space-y-6">
        {/* Document Upload */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">
            {!collapsed && "Document Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="sidebar-item p-3 border-2 border-dashed border-border hover:border-primary/50 rounded-lg text-center transition-colors">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      {!collapsed && (
                        <div>
                          <p className="text-sm font-medium">Upload PDF</p>
                          <p className="text-xs text-muted-foreground">Max 200MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Document List */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium">
              Uploaded Documents ({documents.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {documents.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No documents uploaded yet
                  </p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="sidebar-item p-3 rounded-lg flex items-start justify-between group"
                    >
                      <div className="flex items-start space-x-2 min-w-0 flex-1">
                        <FileText className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {getStatusIcon(doc.status)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {doc.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteDocument(doc.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
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

        {/* Collection Status */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium">
              Vector Database
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="sidebar-item p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium">Connected to Qdrant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-muted-foreground">
                    Collection: pdf_embeddingsV3
                  </span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Delete Documents */}
        {!collapsed && documents.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Delete documents..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem 
                      key={doc.id} 
                      value={doc.id}
                      onSelect={() => deleteDocument(doc.id)}
                    >
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}