import React from 'react'
import Navbar from '../Componets/Navbar'
import InvoiceList from '../Componets/InvoiceList'
import { useInvoices } from '../Context/InvoiceContext'

const Home = () => {
  const { invoices } = useInvoices()
  return (
    <div>
      <Navbar />
      <InvoiceList invoices={invoices} />
    </div>
  )
}

export default Home
