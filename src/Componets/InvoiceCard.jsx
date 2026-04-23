import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const fmt = {
  date: (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "No due date",
  currency: (n) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n ?? 0),
};

const InvoiceCard = ({ invoice }) => {
  const { id, clientName, paymentDue, total, status } = invoice;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/invoice/${id}`)}
      className="bg-(--bg-card) rounded-lg px-6 py-5 flex flex-col gap-4 cursor-pointer border border-transparent hover:border-[#7C5CBF] transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm">
          <span className="text-(--color-muted)">#</span>
          <span className="text-(--color-text)">{id}</span>
        </span>
        <span className="text-sm text-(--color-muted)">{clientName}</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-(--color-muted) mb-2">Due {fmt.date(paymentDue)}</p>
          <p className="font-bold text-base text-(--color-text)">{fmt.currency(total)}</p>
        </div>
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default InvoiceCard;
