// /client/src/App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter"; // 💡 Router 추가
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";

// GitHub Pages 배포 경로 설정 (/moyo_)
const baseLocation = "/moyo_";

function AppRouter() {
  // 💡 기존의 복잡했던 404 리다이렉트 처리 코드를 정리하고, 
  // wouter가 기본 주소(/moyo_)를 인식하도록 <Router>로 감싸줬어.
  return (
    <Router base={baseLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/create" component={CreateGroup} />
        <Route path="/join" component={JoinGroup} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/results" component={Results} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <AppRouter />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
