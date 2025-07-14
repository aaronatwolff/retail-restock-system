import { createRoot } from "react-dom/client";
import "./index.css";

import SimpleApp from './SimpleApp';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<SimpleApp />);