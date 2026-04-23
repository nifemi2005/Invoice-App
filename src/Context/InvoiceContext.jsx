import { createContext, useContext, useState } from "react";

const MOCK = [
  {
    id: "XM9141",
    status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    clientAddress: { street: "84 Church Way", city: "Bradford", postCode: "BD1 9PB", country: "United Kingdom" },
    invoiceDate: "2021-08-21",
    paymentTerms: 30,
    paymentDue: "2021-09-20",
    description: "Graphic Design",
    items: [
      { name: "Banner Design",    quantity: 1, price: 156.00, total: 156.00 },
      { name: "Email Design",     quantity: 2, price: 200.00, total: 400.00 },
    ],
    total: 556.00,
  },
  {
    id: "RG0314",
    status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientName: "John Morrison",
    clientEmail: "jm@myco.com",
    clientAddress: { street: "79 Dover Road", city: "Westhall", postCode: "IP19 3PF", country: "United Kingdom" },
    invoiceDate: "2021-09-01",
    paymentTerms: 30,
    paymentDue: "2021-10-01",
    description: "Website Redesign",
    items: [
      { name: "Website Redesign",  quantity: 1,  price: 14002.33, total: 14002.33 },
    ],
    total: 14002.33,
  },
  {
    id: "RT2080",
    status: "paid",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientName: "Alysa Werner",
    clientEmail: "alysa@email.co.uk",
    clientAddress: { street: "63 Warwick Road", city: "Carlisle", postCode: "CA20 2TF", country: "United Kingdom" },
    invoiceDate: "2021-09-12",
    paymentTerms: 30,
    paymentDue: "2021-10-12",
    description: "Logo Concept",
    items: [
      { name: "Logo Sketches", quantity: 1, price: 102.00, total: 102.00 },
      { name: "Logo Renders",  quantity: 5, price: 200.00, total: 1000.00 },
    ],
    total: 1102.00,
  },
  {
    id: "AA1449",
    status: "pending",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientName: "Mellisa Clarke",
    clientEmail: "mellisa.c@myco.com",
    clientAddress: { street: "46 Abbey Row", city: "Cambridge", postCode: "CB5 6EG", country: "United Kingdom" },
    invoiceDate: "2021-09-14",
    paymentTerms: 30,
    paymentDue: "2021-10-14",
    description: "Re-branding",
    items: [
      { name: "New Logo",     quantity: 1, price: 156.00, total: 156.00 },
      { name: "Brand Guide",  quantity: 1, price: 156.00, total: 156.00 },
    ],
    total: 312.00,
  },
  {
    id: "TY9141",
    status: "draft",
    senderAddress: { street: "19 Union Terrace", city: "London", postCode: "E1 3EZ", country: "United Kingdom" },
    clientName: "Thomas Wayne",
    clientEmail: "thomas@dc.com",
    clientAddress: { street: "3 Gotham Road", city: "Gotham City", postCode: "G1 1TW", country: "United Kingdom" },
    invoiceDate: "2021-10-01",
    paymentTerms: 30,
    paymentDue: "2021-10-31",
    description: "Interior Design Consultation",
    items: [
      { name: "Initial Consultation",   quantity: 1, price:  312.00, total:  312.00 },
      { name: "Design Concept Boards",  quantity: 2, price:  500.00, total: 1000.00 },
      { name: "Mood Board",             quantity: 1, price: 1000.00, total: 1000.00 },
    ],
    total: 2312.00,
  },
];

const InvoiceContext = createContext();

const SEED_VERSION = "2";

const loadInvoices = () => {
  if (localStorage.getItem("invoices_v") !== SEED_VERSION) {
    localStorage.removeItem("invoices");
    localStorage.setItem("invoices_v", SEED_VERSION);
  }
  return JSON.parse(localStorage.getItem("invoices")) ?? MOCK;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState(loadInvoices);

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
