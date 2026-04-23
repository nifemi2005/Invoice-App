import React from "react";
import { FiCheck } from "react-icons/fi";

const STATUSES = ["draft", "pending", "paid"];

const FilterDropdown = ({ selected, onChange }) => {
  const toggle = (status) =>
    onChange(
      selected.includes(status)
        ? selected.filter((s) => s !== status)
        : [...selected, status]
    );

  return (
    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-(--bg-card) rounded-lg shadow-2xl p-6 z-20">
      {STATUSES.map((status) => {
        const checked = selected.includes(status);
        return (
          <label
            key={status}
            className="flex items-center gap-3 cursor-pointer mb-4 last:mb-0 select-none"
          >
            <span
              className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                checked ? "bg-[#7C5CBF]" : "border-2 border-(--color-border) hover:border-[#7C5CBF]"
              }`}
            >
              {checked && <FiCheck size={10} className="text-white" />}
            </span>
            <span className="font-bold text-sm capitalize text-(--color-text)">{status}</span>
          </label>
        );
      })}
    </div>
  );
};

export default FilterDropdown;
