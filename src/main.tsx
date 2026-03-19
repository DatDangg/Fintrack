import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FinanceProvider } from './provider/FinanceProvider.tsx'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FinanceProvider>
        <ToastContainer position="top-right" />
        <App />
      </FinanceProvider>
    </BrowserRouter>
  </StrictMode>,
)
