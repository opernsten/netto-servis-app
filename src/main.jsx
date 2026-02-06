import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './index.css'
import GlobalErrorBoundary from './utils/GlobalErrorBoundary.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Když klikneš zpět do okna, obnoví data
      staleTime: 1000 * 60 * 1,   // Data jsou "čerstvá" 1 minutu (než se znovu zeptá serveru)
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider musí obalovat všechno, aby fungovala kontrola přihlášení všude */}
      <AuthProvider>
        <GlobalErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GlobalErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)