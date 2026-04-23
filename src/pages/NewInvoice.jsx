import React from "react";
import Layout from "../Componets/Layout";
import InvoiceForm from "../Componets/InvoiceForm";

const NewInvoice = () => (
  <Layout>
    <InvoiceForm mode="create" />
  </Layout>
);

export default NewInvoice;
