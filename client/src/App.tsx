import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FoundPlates from "./pages/FoundPlates";
import Search from "./pages/Search";
import PlateDetail from "./pages/PlateDetail";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Messaging from "./pages/Messaging";
import MyPlates from "./pages/MyPlates";
import NavBar from "./components/NavBar";
import MobileNav from "./components/MobileNav";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/encontradas" component={FoundPlates} />
          <Route path="/buscar" component={Search} />
          <Route path="/placa/:id" component={PlateDetail} />
          <Route path="/reportar/perdida" component={ReportLost} />
          <Route path="/reportar/encontrada" component={ReportFound} />
          <Route path="/mensajes" component={Messaging} />
          <Route path="/mensajes/:id" component={Messaging} />
          <Route path="/mis-placas" component={MyPlates} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
