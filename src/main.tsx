
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <App />
    );
    console.log("App rendered successfully");
  } catch (error) {
    console.error("Error rendering the application:", error);
  }
}
