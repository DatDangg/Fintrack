import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FinanceProvider } from './provider/FinanceProvider.tsx'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FinanceProvider>
          <ToastContainer position="top-right" />
          <App />
        </FinanceProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
