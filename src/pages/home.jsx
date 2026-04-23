import React from 'react'
import Layout from '../Componets/Layout'
import InvoiceList from '../Componets/InvoiceList'
import { useInvoices } from '../Context/InvoiceContext'

const Home = () => {
  const { invoices } = useInvoices()
  return (
    <Layout>
      <InvoiceList invoices={invoices} />
    </Layout>
  )
}

export default Home
