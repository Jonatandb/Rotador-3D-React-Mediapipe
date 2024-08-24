import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Demo from './Demo.jsx'
import Scene from './Cube.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
