import { createContext, useContext, useState } from "react";

const MOCK = [
  { id: "XM9141", clientName: "Alex Grim",      paymentDue: "2021-09-20", total: 556.00,   status: "paid" },
  { id: "RG0314", clientName: "John Morrison",  paymentDue: "2021-10-01", total: 14002.33, status: "pending" },
  { id: "RT2080", clientName: "Alysa Werner",   paymentDue: "2021-10-12", total: 1102.00,  status: "paid" },
  { id: "AA1449", clientName: "Mellisa Clarke", paymentDue: "2021-10-14", total: 312.00,   status: "pending" },
  { id: "TY9141", clientName: "Thomas Wayne",   paymentDue: "2021-10-31", total: 2312.00,  status: "draft" },
];

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(
    () => JSON.parse(localStorage.getItem("invoices")) ?? MOCK
  );

  const persist = (data) => {
    setInvoices(data);
    localStorage.setItem("invoices", JSON.stringify(data));
  };

  const addInvoice    = (invoice)      => persist([...invoices, invoice]);
  const updateInvoice = (id, data)     => persist(invoices.map((inv) => inv.id === id ? { ...inv, ...data } : inv));
  const deleteInvoice = (id)           => persist(invoices.filter((inv) => inv.id !== id));

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);
