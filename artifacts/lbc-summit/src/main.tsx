import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { captureReferral } from "./lib/referral";

// Capture ?ref=CODE for affiliate attribution before rendering.
captureReferral();

createRoot(document.getElementById("root")!).render(<App />);
