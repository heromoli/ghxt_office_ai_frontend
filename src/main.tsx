import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  //StrictMode在开发环境下会故意重复渲染组件以帮助发现潜在问题,在生产环境下不会出现此问题。
  <StrictMode>
    <App />
  </StrictMode>,
)
