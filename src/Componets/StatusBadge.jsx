import React from "react";

const variants = {
  paid:    { label: "Paid",    color: "#33D69F", bg: "rgba(51,214,159,0.06)" },
  pending: { label: "Pending", color: "#FF8F00", bg: "rgba(255,143,0,0.06)" },
  draft:   { label: "Draft",   color: "var(--draft-color)", bg: "var(--draft-bg)" },
};

const StatusBadge = ({ status }) => {
  const { label, color, bg } = variants[status?.toLowerCase()] ?? variants.draft;

  return (
    <span
      className="inline-flex items-center justify-center gap-2 w-28 py-2.5 rounded-md font-bold text-sm"
      style={{ background: bg, color }}
    >
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
};

export default StatusBadge;
