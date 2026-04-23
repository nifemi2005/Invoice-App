import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import NewInvoice from "./pages/NewInvoice"
import InvoiceDetails from "./pages/InvoiceDetails"

function App() {
  return (
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/invoice/new"   element={<NewInvoice />} />
      <Route path="/invoice/:id"   element={<InvoiceDetails />} />
    </Routes>
  )
}

export default App
