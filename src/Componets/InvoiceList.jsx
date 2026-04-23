import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import Announce from "../assets/announce.png";
import InvoiceCard from "./InvoiceCard";
import FilterDropdown from "./FilterDropdown";

const EmptyState = ({ isFiltering }) => (
  <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
    <img src={Announce} alt="No invoices" />
    <h2 className="text-xl font-bold text-(--color-text) mt-8 mb-3">
      {isFiltering ? "No results found" : "There is nothing here"}
    </h2>
    <p className="text-sm text-(--color-muted) max-w-50 leading-relaxed">
      {isFiltering
        ? "No invoices match the selected filters."
        : <>Create an invoice by clicking the <span className="font-bold">New</span> button and get started</>}
    </p>
  </div>
);

const InvoiceList = ({ invoices = [] }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const isFiltering = selectedStatuses.length > 0;

  const filtered = isFiltering
    ? invoices.filter((inv) => selectedStatuses.includes(inv.status?.toLowerCase()))
    : invoices;

  const countLabel =
    invoices.length === 0
      ? "No invoices"
      : `${invoices.length} invoice${invoices.length > 1 ? "s" : ""}`;

  return (
    <div className="min-h-screen bg-(--bg-body) px-6 py-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Invoices</h1>
          <p className="text-sm text-(--color-muted) mt-0.5">{countLabel}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-2 font-bold text-(--color-text)"
            >
              Filter
              <FiChevronDown
                className={`text-[#7C5CBF] transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>
            {filterOpen && (
              <FilterDropdown
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
              />
            )}
          </div>

          {/* New button */}
          <button className="flex items-center gap-2 bg-[#7C5CBF] hover:bg-[#9277FF] text-white font-bold pl-2 pr-4 py-2 rounded-full transition-colors">
            <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
              <FiPlus className="text-[#7C5CBF] text-lg" />
            </span>
            New
          </button>
        </div>
      </div>

      {/* List or empty state */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filtered.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      ) : (
        <EmptyState isFiltering={isFiltering} />
      )}
    </div>
  );
};

export default InvoiceList;
