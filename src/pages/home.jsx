import React from 'react'
import Navbar from '../Componets/Navbar'
import InvoiceList from '../Componets/InvoiceList'

const MOCK_INVOICES = [
  { id: "XM9141", clientName: "Alex Grim",      paymentDue: "2021-09-20", total: 556.00,  status: "paid" },
  { id: "RG0314", clientName: "John Morrison",  paymentDue: "2021-10-01", total: 14002.33, status: "pending" },
  { id: "RT2080", clientName: "Alysa Werner",   paymentDue: "2021-10-12", total: 1102.00, status: "paid" },
  { id: "AA1449", clientName: "Mellisa Clarke", paymentDue: "2021-10-14", total: 312.00,  status: "pending" },
  { id: "TY9141", clientName: "Thomas Wayne",   paymentDue: "2021-10-31", total: 2312.00, status: "draft" },
]

const Home = () => {
  return (
    <div>
      <Navbar />
      <InvoiceList invoices={MOCK_INVOICES} />
    </div>
  )
}

export default Home
