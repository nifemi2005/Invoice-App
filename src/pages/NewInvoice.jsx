import React from "react";
import Navbar from "../Componets/Navbar";
import InvoiceForm from "../Componets/InvoiceForm";

const NewInvoice = () => (
  <div>
    <Navbar />
    <InvoiceForm mode="create" />
  </div>
);

export default NewInvoice;
