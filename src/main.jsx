import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './Context/ThemeContext'
import { InvoiceProvider } from './Context/InvoiceContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
