import React from 'react';

export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 id="confirm-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">{cancelLabel}</button>
          <button onClick={onConfirm} disabled={loading} className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${loading ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'}`}>
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
