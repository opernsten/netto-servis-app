import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './index.css'
import GlobalErrorBoundary from './utils/GlobalErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider musí obalovat všechno, aby fungovala kontrola přihlášení všude */}
    <AuthProvider>
      <GlobalErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalErrorBoundary>
    </AuthProvider>
  </React.StrictMode>,
)