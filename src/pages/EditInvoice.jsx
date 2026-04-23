import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Layout from "../Componets/Layout";
import InvoiceForm from "../Componets/InvoiceForm";
import { useInvoices } from "../Context/InvoiceContext";

const EditInvoice = () => {
  const { id } = useParams();
  const { invoices } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) return <Navigate to="/" replace />;

  return (
    <Layout>
      <InvoiceForm mode="edit" initialData={invoice} />
    </Layout>
  );
};

export default EditInvoice;
