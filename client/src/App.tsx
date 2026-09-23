import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPlaceholders from "./pages/AdminPlaceholders";
import AdminProducts from "./pages/AdminProducts";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/admin" component={AdminDashboard} />
    <Route path="/admin/products" component={AdminProducts} />
    <Route path="/admin/categories" component={AdminPlaceholders} />
    <Route path="/admin/settings" component={AdminPlaceholders} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
