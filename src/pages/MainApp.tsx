// import { SidebarProvider } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/AppSidebar";
// import ChatInterface from "@/components/ChatInterface";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const MainApp = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/login");
//     }
//   }, [loading, user, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-neutral-400">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AppSidebar />
//         <main className="flex-1 flex flex-col">
//           <ChatInterface />
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default MainApp;

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ChatInterface from "@/components/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext"; // ✅ Import Chat context provider
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <ChatProvider> {/* ✅ Wrap entire app in ChatProvider */}
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <ChatInterface />
          </main>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
};

export default MainApp;
