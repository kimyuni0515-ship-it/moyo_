import { createRoot } from "react-dom/client";
import "./index.css";
import App from './App';
import { initDemoIfEmpty } from './lib/initDemo';

// Initialize demo data on first load
initDemoIfEmpty();

createRoot(document.getElementById("root")!).render(<App />);
