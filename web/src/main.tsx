import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { AppRoutes } from './AppRoutes.tsx'

document.documentElement.setAttribute('data-js', 'true')

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

const hasServerHtml = rootElement.innerHTML.replace(/<!--app-html-->/g, '').trim().length > 0

if (hasServerHtml) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
