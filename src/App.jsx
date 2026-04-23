import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import NewInvoice from "./pages/NewInvoice"
import InvoiceDetails from "./pages/InvoiceDetails"
import EditInvoice from "./pages/EditInvoice"

function App() {
  return (
    <Routes>
      <Route path="/"                    element={<Home />} />
      <Route path="/invoice/new"         element={<NewInvoice />} />
      <Route path="/invoice/:id"         element={<InvoiceDetails />} />
      <Route path="/invoice/:id/edit"    element={<EditInvoice />} />
    </Routes>
  )
}

export default App
