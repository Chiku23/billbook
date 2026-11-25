import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppRoutes } from './routes'

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="bottom-right" />
    </BrowserRouter>
  )
}
