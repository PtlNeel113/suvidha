import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Electricity from "./pages/Electricity";
import Water from "./pages/Water";
import Gas from "./pages/Gas";
import Waste from "./pages/Waste";
import Schemes from "./pages/Schemes";
import Complaints from "./pages/Complaints";
import Certificates from "./pages/Certificates";
import PMKisan from "./pages/PMKisan";
import Ayushman from "./pages/Ayushman";
import Pension from "./pages/Pension";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, needsOnboarding } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (needsOnboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn || !isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RootRedirect() {
  const { isLoggedIn, isAdmin, needsOnboarding } = useAuth();
  if (isLoggedIn && needsOnboarding) return <Navigate to="/onboarding" replace />;
  if (isLoggedIn) return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
  return <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/electricity" element={<ProtectedRoute><Electricity /></ProtectedRoute>} />
        <Route path="/water" element={<ProtectedRoute><Water /></ProtectedRoute>} />
        <Route path="/gas" element={<ProtectedRoute><Gas /></ProtectedRoute>} />
        <Route path="/waste" element={<ProtectedRoute><Waste /></ProtectedRoute>} />
        <Route path="/schemes" element={<ProtectedRoute><Schemes /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/pm-kisan" element={<ProtectedRoute><PMKisan /></ProtectedRoute>} />
        <Route path="/ayushman" element={<ProtectedRoute><Ayushman /></ProtectedRoute>} />
        <Route path="/pension" element={<ProtectedRoute><Pension /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
