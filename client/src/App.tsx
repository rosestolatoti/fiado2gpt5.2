import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import ProductForm from "./pages/admin/products/form";
import AdminSettings from "./pages/admin/settings";

// Componente para proteger rotas admin
function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLoc] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLoc("/admin/login");
    }
  }, [isAuthenticated, loading, setLoc]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component />;
}

function AppRoutes() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />

      {/* Admin Routes - Todas planas (wouter não suporta aninhamento) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <ProtectedAdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/products/new">
        <ProtectedAdminRoute component={ProductForm} />
      </Route>
      <Route path="/admin/products/:id/edit">
        <ProtectedAdminRoute component={ProductForm} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedAdminRoute component={AdminSettings} />
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
