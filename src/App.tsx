import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from './lib/firebase/FirebaseContext';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CVManager from "./pages/CVManager";
import WebsiteCustomization from "./pages/WebsiteCustomization";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Templates from "./pages/Templates";
import ActivityHistory from "./pages/ActivityHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuthProtectedRoute from "./components/AuthProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/templates" element={<Templates />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <AuthProtectedRoute>
                <Dashboard />
              </AuthProtectedRoute>
            } />
            <Route path="/cv-manager" element={
              <AuthProtectedRoute>
                <CVManager />
              </AuthProtectedRoute>
            } />
            <Route path="/website" element={
              <AuthProtectedRoute>
                <WebsiteCustomization />
              </AuthProtectedRoute>
            } />
            <Route path="/activity" element={
              <AuthProtectedRoute>
                <ActivityHistory />
              </AuthProtectedRoute>
            } />
            <Route path="/profile" element={
              <AuthProtectedRoute>
                <Profile />
              </AuthProtectedRoute>
            } />
            <Route path="/settings" element={
              <AuthProtectedRoute>
                <Settings />
              </AuthProtectedRoute>
            } />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FirebaseProvider>
  </QueryClientProvider>
);

export default App;
