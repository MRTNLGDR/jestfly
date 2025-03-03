
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Falha ao encontrar o elemento root");
} else {
  const root = createRoot(rootElement);
  
  console.log("Iniciando renderização do aplicativo...");
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("App renderizado com sucesso");
  } catch (error) {
    console.error("Erro ao renderizar a aplicação:", error);
  }
}
