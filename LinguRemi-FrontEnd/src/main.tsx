import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthModalProvider } from './contexts/AuthModalContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
    </BrowserRouter>
  </StrictMode>,
)