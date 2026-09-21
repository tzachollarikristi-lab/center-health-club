import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMessages, markMessageRead, deleteMessage } from '../services/adminService';
import { useToast } from '../../components/Toast';

// ─── Icons ─────────────────────────────────────────
const IconSearch = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconMail = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>);
const IconMailOpen = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9 6 9-6M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M3 9l9-6 9 6" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 13l4 4L19 7" /></svg>);
const IconClock = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);

// ─── Confirm Delete Modal ──────────────────────────
function ConfirmDeleteModal({ open, onClose, onConfirm, name, loading }) {
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
              <h3 className="font-display text-lg text-slate-900">Διαγραφή Μηνύματος</h3>
            </div>
            <p className="text-sm text-slate-600">
              Θέλετε σίγουρα να διαγράψετε το μήνυμα από <strong>«{name}»</strong>; Η ενέργεια δεν μπορεί να αναιρεθεί.
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
export default function Messages() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Open message: mark as read automatically ───
  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await markMessageRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch (err) {
        // silent — not critical
        console.warn('Failed to mark as read:', err);
      }
    }
  };

  const toggleRead = async (msg, e) => {
    e.stopPropagation();
    const nextState = !msg.is_read;
    try {
      await markMessageRead(msg.id, nextState);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextState } : m))
      );
      if (selected && selected.id === msg.id) {
        setSelected({ ...selected, is_read: nextState });
      }
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMessage(deleteTarget.id);
      showToast('Το μήνυμα διαγράφηκε.', 'success');
      setDeleteTarget(null);
      if (selected && selected.id === deleteTarget.id) setSelected(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const fmtLong = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleString('el-GR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filtered = messages.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.message?.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.is_read).length;

  // ─── Skeleton ───
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
            Μηνύματα
          </h1>
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span>{messages.length} {messages.length === 1 ? 'μήνυμα' : 'μηνύματα'} συνολικά.</span>
            {unreadCount > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                  </span>
                  {unreadCount} μη αναγνωσμένα
                </span>
              </>
            )}
          </p>
        </div>
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
          placeholder="Αναζήτηση μηνύματος..."
          className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
        />
      </motion.div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 p-10 text-center"
             style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <IconMail className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            {search ? 'Δεν βρέθηκαν μηνύματα.' : 'Δεν υπάρχουν μηνύματα ακόμη.'}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {filtered.map((msg) => {
            const unread = !msg.is_read;
            return (
              <motion.div
                key={msg.id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                onClick={() => openMessage(msg)}
                className={`group rounded-2xl border p-3 md:p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                  unread
                    ? 'border-amber-200/80 bg-gradient-to-br from-amber-50/60 via-white to-white'
                    : 'border-slate-200/60'
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Avatar / Icon */}
                  <div className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    unread ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {unread ? <IconMail className="h-5 w-5" /> : <IconMailOpen className="h-5 w-5" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 truncate">{msg.name}</p>
                      {unread && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Νέο
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.email}</p>
                    <p className="text-xs md:text-sm text-slate-700 font-medium mt-1.5 truncate">
                      {msg.subject || 'Χωρίς θέμα'}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {msg.message}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5">
                      <IconClock className="h-3 w-3" />
                      {fmt(msg.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => toggleRead(msg, e)}
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                      aria-label={unread ? 'Σημείωση ως αναγνωσμένο' : 'Σημείωση ως μη αναγνωσμένο'}
                      title={unread ? 'Σημείωση ως αναγνωσμένο' : 'Σημείωση ως μη αναγνωσμένο'}
                    >
                      {unread ? <IconCheck className="h-4 w-4" /> : <IconMail className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg); }}
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

      {/* ─── DETAIL MODAL ──────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl my-4 md:my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="px-5 md:px-6 py-4 border-b border-slate-200 bg-white flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <IconMail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                      Μήνυμα
                    </p>
                    <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900 leading-tight">
                      {selected.subject || 'Χωρίς θέμα'}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      από <strong className="text-slate-700">{selected.name}</strong> · {selected.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shrink-0"
                  aria-label="Κλείσιμο"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5 md:p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                  <IconClock className="h-3.5 w-3.5" />
                  {fmtLong(selected.created_at)}
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-4 md:p-5">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`}
                    className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50/50 transition-all"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <IconMail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Απάντηση</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{selected.email}</p>
                    </div>
                  </a>

                  <button
                    onClick={(e) => toggleRead(selected, e)}
                    className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50/50 transition-all text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      {selected.is_read ? <IconMail className="h-4 w-4" /> : <IconCheck className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Κατάσταση</p>
                      <p className="text-xs font-semibold text-slate-800">
                        {selected.is_read ? 'Σήμανση ως νέο' : 'Σήμανση ως αναγνωσμένο'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => { setDeleteTarget(selected); }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-all px-3 py-2"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  Διαγραφή
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="btn-secondary text-sm px-5 py-2"
                >
                  Κλείσιμο
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DELETE CONFIRM MODAL ──────────────── */}
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDelete}
        name={deleteTarget?.name || ''}
        loading={deleting}
      />
    </div>
  );
}