import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/hooks/useLanguage";
import { UserProvider } from "@/contexts/UserContext"; // [NEW]
import Index from "./pages/Index";
import Login from "./pages/Login";
import Electricity from "./pages/Electricity";
import Schemes from "./pages/Schemes";
import Complaints from "./pages/Complaints";
import Certificates from "./pages/Certificates";
import AdminDashboard from "./pages/AdminDashboard";
import MainDashboard from "./pages/MainDashboard";
import LocationDashboard from "./pages/LocationDashboard";
import Profile from "./pages/Profile"; // [NEW]
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Index />} />
        {/* <Route path="/login" element={<Login />} />  Removed/Commented as / is now login */}
        <Route path="/electricity" element={<Electricity />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/location-dashboard" element={<LocationDashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* [NEW] */}
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserProvider> {/* [NEW] */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
