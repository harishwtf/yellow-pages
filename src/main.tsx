import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Sections rise in as they scroll into view; only where that can work, so nothing is ever left hidden.
if ('IntersectionObserver' in window) document.documentElement.classList.add('motion')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
