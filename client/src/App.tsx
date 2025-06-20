import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Homepage from "@/pages/homepage";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Dashboard from "@/pages/dashboard";
import LoanApplication from "@/pages/loan-application";
import Applications from "@/pages/applications";
import Documents from "@/pages/documents";
import Analytics from "@/pages/analytics";
import Messages from "@/pages/messages";
import FIDashboard from "@/pages/fi/fi-dashboard";
import FIApplications from "@/pages/fi/applications";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: any }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Login />;
  }
  
  return <Component />;
}

function Router() {
  const { user } = useAuth();
  
  // Role-based dashboard routing
  const getDashboardComponent = () => {
    if (!user) return Homepage;
    switch (user.role) {
      case 'fi': return FIDashboard;
      case 'admin': return AdminDashboard;
      default: return Dashboard;
    }
  };
  
  return (
    <Switch>
      <Route path="/" component={user ? getDashboardComponent() : Homepage} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/dashboard">
        <ProtectedRoute component={getDashboardComponent()} />
      </Route>
      
      {/* SMB Routes */}
      <Route path="/apply">
        <ProtectedRoute component={LoanApplication} />
      </Route>
      <Route path="/applications">
        <ProtectedRoute component={Applications} />
      </Route>
      <Route path="/documents">
        <ProtectedRoute component={Documents} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      
      {/* FI Routes */}
      <Route path="/fi/applications">
        <ProtectedRoute component={FIApplications} />
      </Route>
      <Route path="/fi/portfolio">
        <ProtectedRoute component={() => <div className="p-8 text-center">FI Portfolio Management - Coming Soon</div>} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/users">
        <ProtectedRoute component={() => <div className="p-8 text-center">User Management - Coming Soon</div>} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={() => <div className="p-8 text-center">Admin Settings - Coming Soon</div>} />
      </Route>
      
      {/* Shared Routes */}
      <Route path="/messages">
        <ProtectedRoute component={Messages} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {user && <AppHeader />}
      <Toaster />
      <Router />
    </div>
  );
}

function AppHeader() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedCurrency, currencies, setCurrency } = useCurrency();
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">KreditHub</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <Select value={selectedCurrency.code} onValueChange={(code) => {
              const currency = currencies.find(c => c.code === code);
              if (currency) setCurrency(currency);
            }}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ({user?.role === 'smb' ? 'Business' : user?.role === 'fi' ? 'Financial Institution' : 'Admin'})
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-xs">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
