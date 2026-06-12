// MOYO App Router
// Academic Crimson Design System
// Routes: Home → CreateGroup → JoinGroup → Schedule → Results

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";

function Router() {
  const [location, setLocation] = useLocation();

  // Handle GitHub Pages query parameter redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get('0');
    if (redirectPath) {
      setLocation('/' + redirectPath);
    }
  }, [setLocation]);

  return (
    //  수정 후 (경로 앞에 /moyo_ 를 붙여주기)
return (
  <Switch>
    {/* 기본 주소(/)로 들어오든, GitHub 배포 주소(/moyo_/)로 들어오든 둘 다 홈이 뜨게 해줘 */}
    <Route path="/" component={Home} />
    <Route path="/moyo_" component={Home} />
    
    {/* 다른 페이지들도 /moyo_ 경로를 인식할 수 있게 세팅 */}
    <Route path="/moyo_/create" component={CreateGroup} />
    <Route path="/moyo_/join" component={JoinGroup} />
    <Route path="/moyo_/schedule" component={Schedule} />
    <Route path="/moyo_/results" component={Results} />
    
    {/* 아무것도 해당 안 되면 404 */}
    <Route component={NotFound} />
  </Switch>
);
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-center" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
