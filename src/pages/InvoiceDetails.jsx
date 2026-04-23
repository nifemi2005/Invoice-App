import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Layout from "../Componets/Layout";
import StatusBadge from "../Componets/StatusBadge";
import DeleteModal from "../Componets/DeleteModal";
import { useInvoices } from "../Context/InvoiceContext";

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtCurrency = (n) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    n ?? 0,
  );

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-(--color-muted) mb-2">{label}</p>
    <p className="font-bold text-sm text-(--color-text)">{value || "—"}</p>
  </div>
);

const AddressBlock = ({ address, alignRight = false }) => {
  if (!address)
    return (
      <p className={`text-sm text-(--color-muted) ${alignRight ? "text-right" : ""}`}>
        —
      </p>
    );
  return (
    <address
      className={`not-italic text-sm text-(--color-muted) leading-6 ${alignRight ? "text-right" : ""}`}
    >
      {address.street && <p>{address.street}</p>}
      {address.city && <p>{address.city}</p>}
      {address.postCode && <p>{address.postCode}</p>}
      {address.country && <p>{address.country}</p>}
    </address>
  );
};

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();
  const [showDelete, setShowDelete] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) return <Navigate to="/" replace />;

  const {
    status,
    clientName,
    clientEmail,
    clientAddress,
    senderAddress,
    invoiceDate,
    paymentDue,
    description,
    items = [],
    total,
  } = invoice;

  const markAsPaid = () => updateInvoice(id, { status: "paid" });
  const handleDelete = () => {
    deleteInvoice(id);
    navigate("/");
  };

  const ActionButtons = () => (
    <>
      <button
        onClick={() => navigate(`/invoice/${id}/edit`)}
        className="px-6 py-4 rounded-full text-sm font-bold bg-(--bg-surface) text-(--color-muted) hover:opacity-80 transition-opacity"
      >
        Edit
      </button>
      <button
        onClick={() => setShowDelete(true)}
        className="px-6 py-4 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
      >
        Delete
      </button>
      {status === "pending" && (
        <button
          onClick={markAsPaid}
          className="px-6 py-4 rounded-full text-sm font-bold bg-[#7C5CBF] text-white hover:bg-[#9277FF] transition-colors"
        >
          Mark as Paid
        </button>
      )}
    </>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-(--bg-body) transition-colors duration-200 px-6 py-8 pb-28 lg:pb-12 lg:px-8 lg:py-12 max-w-[900px] mx-auto">

        {/* Go back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-8 group"
        >
          <span className="text-[#7C5CBF] text-lg leading-none">‹</span>
          <span className="font-bold text-sm text-(--color-text) group-hover:text-(--color-muted) transition-colors">
            Go back
          </span>
        </button>

        {/* Status bar */}
        <div className="bg-(--bg-card) rounded-lg px-6 py-5 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-(--color-muted)">Status</span>
            <StatusBadge status={status} />
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <ActionButtons />
          </div>
        </div>

        {/* Invoice info card */}
        <div className="bg-(--bg-card) rounded-lg p-6 lg:p-8 mb-4">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="font-bold text-(--color-text) mb-1">
                <span className="text-[#7C5CBF]">#</span>{id}
              </p>
              <p className="text-sm text-(--color-muted)">{description || "—"}</p>
            </div>
            <AddressBlock address={senderAddress} alignRight />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <InfoRow label="Invoice Date" value={fmtDate(invoiceDate)} />
              <InfoRow label="Payment Due" value={fmtDate(paymentDue)} />
            </div>
            <div>
              <p className="text-xs text-(--color-muted) mb-2">Bill To</p>
              <p className="font-bold text-sm text-(--color-text) mb-2">{clientName || "—"}</p>
              <AddressBlock address={clientAddress} />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <InfoRow label="Sent to" value={clientEmail} />
            </div>
          </div>
        </div>

        {/* Items card */}
        <div className="bg-(--bg-card) rounded-lg overflow-hidden mb-4">
          <div className="bg-(--bg-surface) p-6 lg:p-8">
            {/* Table header — desktop only */}
            <div className="hidden lg:grid grid-cols-[1fr_80px_120px_120px] gap-4 mb-5">
              <span className="text-xs text-(--color-muted)">Item Name</span>
              <span className="text-xs text-(--color-muted) text-center">QTY.</span>
              <span className="text-xs text-(--color-muted) text-right">Price</span>
              <span className="text-xs text-(--color-muted) text-right">Total</span>
            </div>

            {items.length > 0 ? (
              <div className="flex flex-col gap-5">
                {items.map((item, i) => (
                  <div key={i}>
                    {/* Mobile */}
                    <div className="flex items-center justify-between lg:hidden">
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
                    {/* Desktop */}
                    <div className="hidden lg:grid grid-cols-[1fr_80px_120px_120px] gap-4 items-center">
                      <p className="font-bold text-sm text-(--color-text)">{item.name || "—"}</p>
                      <p className="font-bold text-sm text-(--color-muted) text-center">{item.quantity}</p>
                      <p className="font-bold text-sm text-(--color-muted) text-right">{fmtCurrency(item.price)}</p>
                      <p className="font-bold text-sm text-(--color-text) text-right">
                        {fmtCurrency(item.total ?? item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-(--color-muted) text-center py-2">No items</p>
            )}
          </div>

          {/* Amount due */}
          <div className="bg-(--bg-total) px-6 lg:px-8 py-6 flex items-center justify-between">
            <p className="text-sm text-white/70">Amount Due</p>
            <p className="text-2xl font-bold text-white">{fmtCurrency(total)}</p>
          </div>
        </div>

      </div>

      {/* Sticky footer — mobile/tablet only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-(--bg-card) px-6 py-5 flex items-center justify-between gap-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-40">
        <button
          onClick={() => navigate(`/invoice/${id}/edit`)}
          className="text-sm font-bold text-(--color-muted) hover:text-(--color-text) transition-colors"
        >
          Edit
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDelete(true)}
            className="px-6 py-4 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
          >
            Delete
          </button>
          {status === "pending" && (
            <button
              onClick={markAsPaid}
              className="px-6 py-4 rounded-full text-sm font-bold bg-[#7C5CBF] text-white hover:bg-[#9277FF] transition-colors"
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
    </Layout>
  );
};

export default InvoiceDetails;
