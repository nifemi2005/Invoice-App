import React from "react";

const DeleteModal = ({ invoiceId, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
    <div className="bg-(--bg-card) rounded-lg p-8 w-full max-w-sm">
      <h2 className="text-xl font-bold text-(--color-text) mb-3">Confirm Deletion</h2>
      <p className="text-sm text-(--color-muted) leading-relaxed mb-6">
        Are you sure you want to delete invoice{" "}
        <span className="font-bold text-(--color-text)">#{invoiceId}</span>? This action
        cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-5 py-4 rounded-full text-sm font-bold bg-(--bg-body) text-(--color-muted) hover:opacity-80 transition-opacity"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-4 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
