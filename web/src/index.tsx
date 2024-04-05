import ReactDOM from "react-dom/client";
import App from "./app";

const rootElement = document.getElementById("root");
if (!rootElement)
  throw new Error("Failed to get root element.");

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
