import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Navbar from "../Componets/Navbar";
import InvoiceForm from "../Componets/InvoiceForm";
import { useInvoices } from "../Context/InvoiceContext";

const EditInvoice = () => {
  const { id } = useParams();
  const { invoices } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) return <Navigate to="/" replace />;

  return (
    <div>
      <Navbar />
      <InvoiceForm mode="edit" initialData={invoice} />
    </div>
  );
};

export default EditInvoice;
