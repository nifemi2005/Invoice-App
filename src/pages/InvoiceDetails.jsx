import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Componets/Navbar";
import StatusBadge from "../Componets/StatusBadge";
import DeleteModal from "../Componets/DeleteModal";
import { useInvoices } from "../Context/InvoiceContext";

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n ?? 0);

// ── Sub-components ────────────────────────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-(--color-muted) mb-1">{label}</p>
    <p className="font-bold text-sm text-(--color-text)">{value || "—"}</p>
  </div>
);

const AddressBlock = ({ address }) => {
  if (!address) return <p className="text-sm text-(--color-muted)">—</p>;
  return (
    <address className="not-italic text-sm text-(--color-muted) leading-6">
      {address.street   && <p>{address.street}</p>}
      {address.city     && <p>{address.city}</p>}
      {address.postCode && <p>{address.postCode}</p>}
      {address.country  && <p>{address.country}</p>}
    </address>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) return <Navigate to="/" replace />;

  const {
    status, clientName, clientEmail, clientAddress, senderAddress,
    invoiceDate, paymentDue, description, items = [], total,
  } = invoice;

  const markAsPaid = () => updateInvoice(id, { status: "paid" });
  const handleDelete = () => { deleteInvoice(id); navigate("/"); };

  return (
    <div className="bg-(--bg-body) min-h-screen transition-colors duration-200">
      <Navbar />

      <div className="px-6 py-8 pb-24 max-w-2xl mx-auto">

        {/* Go back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 mb-8 group">
          <span className="text-[#7C5CBF] text-lg leading-none">‹</span>
          <span className="font-bold text-sm text-(--color-text) group-hover:text-(--color-muted) transition-colors">
            Go back
          </span>
        </button>

        {/* ── Status bar ── */}
        <div className="bg-(--bg-card) rounded-lg px-6 py-5 flex items-center justify-between mb-4">
          <span className="text-sm text-(--color-muted)">Status</span>
          <StatusBadge status={status} />
        </div>

        {/* ── Main info card ── */}
        <div className="bg-(--bg-card) rounded-lg p-6 mb-4 flex flex-col gap-7">

          {/* Invoice ID + description */}
          <div>
            <p className="font-bold text-(--color-text)">
              <span className="text-(--color-muted)">#</span>{id}
            </p>
            <p className="text-sm text-(--color-muted) mt-1">{description || "—"}</p>
          </div>

          {/* Sender address */}
          <div>
            <p className="text-xs text-(--color-muted) mb-2">Bill From</p>
            <AddressBlock address={senderAddress} />
          </div>

          {/* Dates + Bill To — 2-col grid */}
          <div className="grid grid-cols-2 gap-6">
            <InfoRow label="Invoice Date"  value={fmtDate(invoiceDate)} />
            <div>
              <p className="text-xs text-(--color-muted) mb-1">Bill To</p>
              <p className="font-bold text-sm text-(--color-text) mb-2">{clientName || "—"}</p>
              <AddressBlock address={clientAddress} />
            </div>
            <InfoRow label="Payment Due" value={fmtDate(paymentDue)} />
          </div>

          {/* Email */}
          <InfoRow label="Sent To" value={clientEmail} />
        </div>

        {/* ── Items card ── */}
        <div className="bg-(--bg-card) rounded-lg overflow-hidden mb-6">
          {/* Items list */}
          <div className="p-6 flex flex-col gap-5">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-(--color-text)">{item.name || "—"}</p>
                    <p className="text-sm font-bold text-(--color-muted) mt-1">
                      {item.quantity} &times; {fmtCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-(--color-text)">
                    {fmtCurrency(item.total ?? item.quantity * item.price)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--color-muted) text-center py-2">No items</p>
            )}
          </div>

          {/* Amount due */}
          <div className="bg-(--bg-total) px-6 py-6 flex items-center justify-between rounded-b-lg">
            <p className="text-sm text-white/70">Amount Due</p>
            <p className="text-2xl font-bold text-white">{fmtCurrency(total)}</p>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/invoice/${id}/edit`)}
            className="px-5 py-4 rounded-full text-sm font-bold bg-(--bg-card) text-(--color-muted) hover:opacity-80 transition-opacity"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="px-5 py-4 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
          >
            Delete
          </button>
          {status === "pending" && (
            <button
              onClick={markAsPaid}
              className="px-5 py-4 rounded-full text-sm font-bold bg-[#7C5CBF] text-white hover:bg-[#9277FF] transition-colors"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          invoiceId={id}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default InvoiceDetails;
