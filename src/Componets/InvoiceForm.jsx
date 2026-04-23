import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";
import { useInvoices } from "../Context/InvoiceContext";

// ─── Utilities ───────────────────────────────────────────────────────────────

const generateId = () => {
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const r = (n) => Math.floor(Math.random() * n);
  return `${a[r(26)]}${a[r(26)]}${r(10)}${r(10)}${r(10)}${r(10)}`;
};

const calcDue = (date, terms) => {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(terms));
  return d.toISOString().split("T")[0];
};

const today = new Date().toISOString().split("T")[0];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = (err) =>
  `w-full bg-(--bg-card) border rounded-lg px-5 py-4 text-sm font-bold text-(--color-text) ` +
  `outline-none transition-colors focus:border-[#7C5CBF] ` +
  (err ? "border-red-400" : "border-(--color-border)");

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field = ({ label, error, children, className = "" }) => (
  <div className={className}>
    <div className="flex justify-between items-center mb-2">
      <span className={`text-xs ${error ? "text-red-400" : "text-(--color-muted)"}`}>
        {label}
      </span>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
    {children}
  </div>
);

const SectionLabel = ({ children }) => (
  <h3 className="text-sm font-bold text-[#7C5CBF] mb-6">{children}</h3>
);

// ─── Default state ────────────────────────────────────────────────────────────

const blankForm = {
  senderStreet: "", senderCity: "", senderPostCode: "", senderCountry: "",
  clientName: "", clientEmail: "",
  clientStreet: "", clientCity: "", clientPostCode: "", clientCountry: "",
  invoiceDate: today,
  paymentTerms: "30",
  description: "",
};

const fromInvoice = (inv) => ({
  senderStreet:   inv.senderAddress?.street    ?? "",
  senderCity:     inv.senderAddress?.city      ?? "",
  senderPostCode: inv.senderAddress?.postCode  ?? "",
  senderCountry:  inv.senderAddress?.country   ?? "",
  clientName:     inv.clientName   ?? "",
  clientEmail:    inv.clientEmail  ?? "",
  clientStreet:   inv.clientAddress?.street    ?? "",
  clientCity:     inv.clientAddress?.city      ?? "",
  clientPostCode: inv.clientAddress?.postCode  ?? "",
  clientCountry:  inv.clientAddress?.country   ?? "",
  invoiceDate:    inv.invoiceDate  ?? today,
  paymentTerms:   String(inv.paymentTerms ?? "30"),
  description:    inv.description  ?? "",
});

const blankItem = () => ({ id: Date.now(), name: "", quantity: 1, price: "", total: 0 });

// ─── Main component ───────────────────────────────────────────────────────────

const InvoiceForm = ({ mode = "create", initialData = null }) => {
  const navigate = useNavigate();
  const { addInvoice, updateInvoice } = useInvoices();

  const [form, setForm]   = useState(initialData ? fromInvoice(initialData) : blankForm);
  const [items, setItems] = useState(
    initialData?.items?.map((it, i) => ({ ...it, id: i })) ?? [blankItem()]
  );
  const [errors, setErrors] = useState({});

  // ── Field helpers ──────────────────────────────────────────────────────────

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setItem = (id, key) => (e) =>
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [key]: e.target.value };
        next.total = (Number(next.quantity) || 0) * (Number(next.price) || 0);
        return next;
      })
    );

  const addItem    = () => setItems((p) => [...p, blankItem()]);
  const removeItem = (id) => setItems((p) => p.filter((it) => it.id !== id));

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    const req = (k) => { if (!form[k]?.trim()) errs[k] = "can't be empty"; };

    req("senderStreet"); req("senderCity"); req("senderPostCode"); req("senderCountry");
    req("clientName");   req("clientStreet"); req("clientCity");
    req("clientPostCode"); req("clientCountry"); req("description");

    if (!form.clientEmail?.trim()) {
      errs.clientEmail = "can't be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      errs.clientEmail = "invalid email";
    }

    items.forEach((item, i) => {
      if (!item.name?.trim())                  errs[`item_${i}_name`]  = "can't be empty";
      if (!item.quantity || item.quantity < 1) errs[`item_${i}_qty`]   = "min 1";
      if (item.price === "" || item.price < 0) errs[`item_${i}_price`] = "invalid";
    });

    return errs;
  };

  // ── Build invoice object ───────────────────────────────────────────────────

  const build = (status) => ({
    id:           initialData?.id ?? generateId(),
    status,
    senderAddress: { street: form.senderStreet, city: form.senderCity, postCode: form.senderPostCode, country: form.senderCountry },
    clientName:    form.clientName,
    clientEmail:   form.clientEmail,
    clientAddress: { street: form.clientStreet, city: form.clientCity, postCode: form.clientPostCode, country: form.clientCountry },
    invoiceDate:   form.invoiceDate,
    paymentTerms:  Number(form.paymentTerms),
    paymentDue:    calcDue(form.invoiceDate, form.paymentTerms),
    description:   form.description,
    items:         items.map(({ id, ...rest }) => ({
                     name:     rest.name,
                     quantity: Number(rest.quantity),
                     price:    Number(rest.price),
                     total:    rest.total,
                   })),
    total:         items.reduce((s, it) => s + it.total, 0),
  });

  // ── Submit handlers ────────────────────────────────────────────────────────

  const saveDraft = () => {
    const inv = build("draft");
    mode === "create" ? addInvoice(inv) : updateInvoice(inv.id, inv);
    navigate("/");
  };

  const saveSend = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const inv = build("pending");
    mode === "create" ? addInvoice(inv) : updateInvoice(inv.id, inv);
    navigate("/");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-(--bg-body) min-h-screen flex flex-col transition-colors duration-200">

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-6 md:px-10 lg:px-16 pt-8 pb-36 max-w-3xl mx-auto w-full">

        {/* Go back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 mb-6 group">
          <span className="text-[#7C5CBF] text-lg leading-none">‹</span>
          <span className="font-bold text-sm text-(--color-text) group-hover:text-(--color-muted) transition-colors">
            Go back
          </span>
        </button>

        <h1 className="text-2xl font-bold text-(--color-text) mb-8">
          {mode === "create" ? "New Invoice" : `Edit #${initialData?.id}`}
        </h1>

        {/* ── Bill From ── */}
        <SectionLabel>Bill From</SectionLabel>
        <div className="flex flex-col gap-5 mb-10">
          <Field label="Street Address" error={errors.senderStreet}>
            <input className={inputCls(errors.senderStreet)} value={form.senderStreet} onChange={set("senderStreet")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" error={errors.senderCity}>
              <input className={inputCls(errors.senderCity)} value={form.senderCity} onChange={set("senderCity")} />
            </Field>
            <Field label="Post Code" error={errors.senderPostCode}>
              <input className={inputCls(errors.senderPostCode)} value={form.senderPostCode} onChange={set("senderPostCode")} />
            </Field>
          </div>
          <Field label="Country" error={errors.senderCountry}>
            <input className={inputCls(errors.senderCountry)} value={form.senderCountry} onChange={set("senderCountry")} />
          </Field>
        </div>

        {/* ── Bill To ── */}
        <SectionLabel>Bill To</SectionLabel>
        <div className="flex flex-col gap-5 mb-10">
          <Field label="Client's Name" error={errors.clientName}>
            <input className={inputCls(errors.clientName)} value={form.clientName} onChange={set("clientName")} />
          </Field>
          <Field label="Client's Email" error={errors.clientEmail}>
            <input type="email" placeholder="e.g. email@example.com"
              className={inputCls(errors.clientEmail)} value={form.clientEmail} onChange={set("clientEmail")} />
          </Field>
          <Field label="Street Address" error={errors.clientStreet}>
            <input className={inputCls(errors.clientStreet)} value={form.clientStreet} onChange={set("clientStreet")} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" error={errors.clientCity}>
              <input className={inputCls(errors.clientCity)} value={form.clientCity} onChange={set("clientCity")} />
            </Field>
            <Field label="Post Code" error={errors.clientPostCode}>
              <input className={inputCls(errors.clientPostCode)} value={form.clientPostCode} onChange={set("clientPostCode")} />
            </Field>
          </div>
          <Field label="Country" error={errors.clientCountry}>
            <input className={inputCls(errors.clientCountry)} value={form.clientCountry} onChange={set("clientCountry")} />
          </Field>
          <Field label="Invoice Date">
            <input type="date" className={inputCls(false)} value={form.invoiceDate} onChange={set("invoiceDate")} />
          </Field>
          <Field label="Payment Terms">
            <div className="relative">
              <select
                className={inputCls(false) + " appearance-none cursor-pointer pr-10"}
                value={form.paymentTerms}
                onChange={set("paymentTerms")}
              >
                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Days</option>
                <option value="14">Net 14 Days</option>
                <option value="30">Net 30 Days</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C5CBF] pointer-events-none" />
            </div>
          </Field>
          <Field label="Project Description" error={errors.description}>
            <input placeholder="e.g. Graphic Design Service"
              className={inputCls(errors.description)} value={form.description} onChange={set("description")} />
          </Field>
        </div>

        {/* ── Item List ── */}
        <h3 className="text-lg font-bold text-[#777F98] mb-6">Item List</h3>
        <div className="flex flex-col gap-8 mb-5">
          {items.map((item, i) => (
            <div key={item.id} className="flex flex-col gap-4">
              <Field label="Item Name" error={errors[`item_${i}_name`]}>
                <input className={inputCls(errors[`item_${i}_name`])} value={item.name} onChange={setItem(item.id, "name")} />
              </Field>
              <div className="grid grid-cols-[56px_1fr_1fr_20px] gap-3 items-end">
                <Field label="Qty." error={errors[`item_${i}_qty`]}>
                  <input type="number" min="1"
                    className={inputCls(errors[`item_${i}_qty`])}
                    value={item.quantity} onChange={setItem(item.id, "quantity")} />
                </Field>
                <Field label="Price" error={errors[`item_${i}_price`]}>
                  <input type="number" min="0" step="0.01"
                    className={inputCls(errors[`item_${i}_price`])}
                    value={item.price} onChange={setItem(item.id, "price")} />
                </Field>
                <Field label="Total">
                  <div className="py-4 text-sm font-bold text-(--color-muted)">
                    {item.total.toFixed(2)}
                  </div>
                </Field>
                <button
                  onClick={() => removeItem(item.id)}
                  className="pb-2 text-(--color-muted) hover:text-red-400 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="w-full py-4 bg-(--bg-card) border border-(--color-border) rounded-full text-sm font-bold text-(--color-muted) hover:text-(--color-text) transition-colors"
        >
          + Add New Item
        </button>
      </div>

      {/* ── Sticky footer ── */}
      <div className="sticky bottom-0 bg-(--bg-body) px-6 py-5 flex items-center justify-between shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-4 rounded-full text-sm font-bold bg-(--bg-card) text-(--color-muted) hover:opacity-80 transition-opacity"
        >
          Discard
        </button>
        <div className="flex gap-2">
          <button
            onClick={saveDraft}
            className="px-5 py-4 rounded-full text-sm font-bold bg-[#373B53] text-[#888EB0] hover:bg-[#0C0E16] transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={saveSend}
            className="px-5 py-4 rounded-full text-sm font-bold bg-[#7C5CBF] text-white hover:bg-[#9277FF] transition-colors"
          >
            Save &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
