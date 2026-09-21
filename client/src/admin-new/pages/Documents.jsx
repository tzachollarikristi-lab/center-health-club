import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchDocuments, createDocument, updateDocument,
  deleteDocument, uploadDocumentFile
} from '../services/adminService';
import { useToast } from '../../components/Toast';

// ─── Icons ─────────────────────────────────────────
const IconPlus = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const IconSearch = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconEdit = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconFile = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></svg>);
const IconUpload = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>);
const IconLink = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>);
const IconCalendar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
const IconEye = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" /></svg>);
const IconDownload = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>);

// ─── Helpers ───────────────────────────────────────
const emptyForm = () => ({ title: '', description: '', file_path: '' });

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getExt = (path) => {
  if (!path) return 'FILE';
  const m = path.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
  return m ? m[1].toUpperCase().slice(0, 4) : 'FILE';
};

// ─── Confirm Delete Modal ──────────────────────────
function ConfirmDeleteModal({ open, onClose, onConfirm, title, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <IconTrash className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-slate-900">Διαγραφή Εγγράφου</h3>
            </div>
            <p className="text-sm text-slate-600">
              Θέλετε σίγουρα να διαγράψετε το έγγραφο <strong>«{title}»</strong>;
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={onClose} disabled={loading} className="btn-secondary text-sm px-4 py-2">Άκυρο</button>
              <button onClick={onConfirm} disabled={loading} className="text-sm px-5 py-2 bg-red-600 text-white hover:bg-red-700 rounded-full disabled:opacity-50 font-medium">
                {loading ? 'Διαγραφή...' : 'Διαγραφή'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────
export default function Documents() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sourceMode, setSourceMode] = useState('url'); // 'url' | 'upload'

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setSourceMode('url');
    setModalOpen(true);
  };

  const openEdit = (doc) => {
    setEditing(doc);
    setForm({
      title: doc.title || '',
      description: doc.description || '',
      file_path: doc.file_path || '',
    });
    setSourceMode('url');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadDocumentFile(file);
      setForm((prev) => ({ ...prev, file_path: url }));
      showToast('Το αρχείο ανέβηκε.', 'success');
    } catch (err) {
      showToast('Σφάλμα upload: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Ο τίτλος απαιτείται.', 'error'); return; }
    if (!form.file_path.trim()) { showToast('Το αρχείο απαιτείται.', 'error'); return; }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      file_path: form.file_path.trim(),
    };

    setSaving(true);
    try {
      if (editing) {
        await updateDocument(editing.id, payload);
        showToast('Το έγγραφο ενημερώθηκε.', 'success');
      } else {
        await createDocument(payload);
        showToast('Το έγγραφο προστέθηκε.', 'success');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocument(deleteTarget.id);
      showToast('Το έγγραφο διαγράφηκε.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = documents.filter((d) =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-5 md:space-y-6 animate-pulse">
        <div className="h-8 w-56 rounded-full bg-slate-200/60" />
        <div className="h-10 w-72 rounded-full bg-slate-200/50" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="min-w-0">
          <h1 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-slate-900">
            Έγγραφα
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {documents.length} {documents.length === 1 ? 'έγγραφο' : 'έγγραφα'} συνολικά.
          </p>
        </div>
        <button
          onClick={openNew}
          className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0 self-start"
        >
          <span className="text-xs font-semibold tracking-wide">Νέο Έγγραφο</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-90">
            <IconPlus className="h-3.5 w-3.5" />
          </span>
        </button>
      </motion.div>

      {/* SEARCH */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative max-w-md"
      >
        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Αναζήτηση εγγράφου..."
          className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
        />
      </motion.div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 p-10 text-center"
             style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <IconFile className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            {search ? 'Δεν βρέθηκαν έγγραφα.' : 'Δεν υπάρχουν έγγραφα ακόμη. Προσθέστε το πρώτο!'}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {filtered.map((doc) => {
            const ext = getExt(doc.file_path);
            return (
              <motion.div
                key={doc.id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                className="group rounded-2xl border border-slate-200/60 p-3 md:p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* File type badge */}
                  <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-sm">
                    <span className="text-[10px] md:text-[11px] font-black tracking-[0.08em]">{ext}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{doc.title}</p>
                    {doc.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{doc.description}</p>
                    )}
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5">
                      <IconCalendar className="h-3 w-3" />
                      {fmt(doc.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                      aria-label="Προβολή"
                      title="Προβολή"
                    >
                      <IconEye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => openEdit(doc)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                      aria-label="Επεξεργασία"
                    >
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(doc)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                      aria-label="Διαγραφή"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─── CREATE/EDIT MODAL ─────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg my-4 md:my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-slate-200">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    {editing ? 'Επεξεργασία' : 'Νέο Έγγραφο'}
                  </p>
                  <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900">
                    {editing ? 'Ενημέρωση Εγγράφου' : 'Προσθήκη Εγγράφου'}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shrink-0"
                  aria-label="Κλείσιμο"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="p-5 md:p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Τίτλος <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                      placeholder="π.χ. Οδηγίες Πρώτων Βοηθειών"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Περιγραφή
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      className="w-full rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none resize-none"
                      placeholder="Σύντομη περιγραφή (προαιρετικό)"
                    />
                  </div>

                  {/* Source mode toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Αρχείο <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setSourceMode('url')}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                          sourceMode === 'url'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <IconLink className="h-3.5 w-3.5" />
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceMode('upload')}
                        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                          sourceMode === 'upload'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <IconUpload className="h-3.5 w-3.5" />
                        Ανέβασμα
                      </button>
                    </div>

                    {sourceMode === 'url' ? (
                      <input
                        value={form.file_path}
                        onChange={(e) => updateForm('file_path', e.target.value)}
                        className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                        placeholder="https://example.com/document.pdf"
                      />
                    ) : (
                      <>
                        {form.file_path ? (
                          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
                              <span className="text-[9px] font-black">{getExt(form.file_path)}</span>
                            </div>
                            <p className="text-xs text-slate-700 truncate flex-1">{form.file_path}</p>
                            <label className="cursor-pointer">
                              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                              <span className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
                                Αλλαγή
                              </span>
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                              <IconUpload className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">
                              {uploading ? 'Ανέβασμα...' : 'Πατήστε για να ανεβάσετε αρχείο'}
                            </span>
                            <span className="text-[10px] text-slate-400">PDF, DOC, DOCX, XLS, XLSX</span>
                          </label>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="btn-secondary text-sm px-5 py-2"
                  >
                    Άκυρο
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                  >
                    {saving ? 'Αποθήκευση...' : (editing ? 'Ενημέρωση' : 'Προσθήκη')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRM MODAL ──────────────── */}
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.title || ''}
        loading={deleting}
      />
    </div>
  );
}