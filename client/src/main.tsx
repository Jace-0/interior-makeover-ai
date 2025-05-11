import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DesignUploader from './DesignUploader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignUploader />
  </StrictMode>,
)
