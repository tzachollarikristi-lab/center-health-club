import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchAnnouncements, createAnnouncement,
  updateAnnouncement, deleteAnnouncement, uploadAnnouncementImage
} from '../services/adminService';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

// ─── Icons ─────────────────────────────────────────
const IconPlus = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const IconSearch = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconEdit = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconStar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);
const IconImage = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>);
const IconCalendar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
const IconArrowRight = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 5l7 7-7 7" /></svg>);
const IconArrowLeft = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 13l4 4L19 7" /></svg>);

// ─── Helpers ───────────────────────────────────────
const emptyForm = () => ({
  title: '',
  summary: '',
  description: '',
  pinned: false,
  publish_date: new Date().toISOString().slice(0, 10),
  event_date: '',
  expiry_date: '',
  deletion_mode: 'auto',
  is_permanent: false,
  images: [],
});

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const STEPS = [
  { num: 1, label: 'Βασικά' },
  { num: 2, label: 'Κείμενο' },
  { num: 3, label: 'Εικόνες' },
  { num: 4, label: 'Ρυθμίσεις' },
];

// ─── Confirm Delete Modal ──────────────────────────
function ConfirmDeleteModal({ open, onClose, onConfirm, title, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
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
              <h3 className="font-display text-lg text-slate-900">Διαγραφή Ανακοίνωσης</h3>
            </div>
            <p className="text-sm text-slate-600">
              Θέλετε σίγουρα να διαγράψετε την ανακοίνωση <strong>«{title}»</strong>; Η ενέργεια δεν μπορεί να αναιρεθεί.
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
export default function Announcements() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ann = await fetchAnnouncements();
      setAnnouncements(ann);
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Open modal (new or edit) ──────────────────
  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setStep(1);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      summary: item.summary || '',
      description: item.description || '',
      pinned: Boolean(item.pinned),
      publish_date: item.publish_date || new Date().toISOString().slice(0, 10),
      event_date: item.event_date || '',
      expiry_date: item.expiry_date || '',
      deletion_mode: item.deletion_mode || 'auto',
      is_permanent: Boolean(item.is_permanent),
      images: item.images || [],
    });
    setStep(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Wizard navigation ────────────────────────
  const goNext = () => {
    if (step === 1 && !form.title.trim()) { showToast('Ο τίτλος απαιτείται.', 'error'); return; }
    if (step === 2 && !form.description.trim()) { showToast('Το κείμενο απαιτείται.', 'error'); return; }
    setStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  // ─── Image upload ──────────────────────────────
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadAnnouncementImage(file);
        urls.push(url);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      showToast(`${urls.length} εικόνα(ες) ανέβηκαν.`, 'success');
    } catch (err) {
      showToast('Σφάλμα upload: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // ─── Save (create or update) ───────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Ο τίτλος απαιτείται.', 'error'); setStep(1); return; }
    if (!form.description.trim()) { showToast('Το κείμενο απαιτείται.', 'error'); setStep(2); return; }

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      category: 'Γενικό',
      pinned: Boolean(form.pinned),
      publish_date: form.publish_date || new Date().toISOString().slice(0, 10),
      event_date: form.event_date || null,
      expiry_date: form.deletion_mode === 'auto' ? (form.expiry_date || null) : null,
      deletion_mode: form.deletion_mode || 'auto',
      is_permanent: Boolean(form.is_permanent),
      images: form.images || [],
    };

    setSaving(true);
    try {
      if (editing) {
        await updateAnnouncement(editing.id, payload);
        showToast('Η ανακοίνωση ενημερώθηκε.', 'success');
      } else {
        await createAnnouncement(payload);
        showToast('Η ανακοίνωση δημοσιεύτηκε.', 'success');
      }
      setModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAnnouncement(deleteTarget.id);
      showToast('Η ανακοίνωση διαγράφηκε.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = announcements.filter((a) =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
  return (
    <div className="space-y-5 md:space-y-6 animate-pulse">
      <div className="h-8 w-56 rounded-full bg-slate-200/60" />
      <div className="h-10 w-72 rounded-full bg-slate-200/50" />
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-slate-200/50" />
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
            Ανακοινώσεις
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {announcements.length} {announcements.length === 1 ? 'ανακοίνωση' : 'ανακοινώσεις'} συνολικά.
          </p>
        </div>
        <button
          onClick={openNew}
          className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0 self-start"
        >
          <span className="text-xs font-semibold tracking-wide">Νέα Ανακοίνωση</span>
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
          placeholder="Αναζήτηση ανακοίνωσης..."
          className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
        />
      </motion.div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 p-10 text-center"
             style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <IconImage className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            {search ? 'Δεν βρέθηκαν ανακοινώσεις.' : 'Δεν υπάρχουν ανακοινώσεις ακόμη. Δημιουργήστε την πρώτη!'}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="group rounded-2xl border border-slate-200/60 p-3 md:p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <IconImage className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                      <IconStar className="h-2.5 w-2.5" /> Κορυφαία
                    </span>
                  )}
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <IconCalendar className="h-3 w-3" />
                    {fmt(item.publish_date || item.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                    aria-label="Επεξεργασία"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    aria-label="Διαγραφή"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── WIZARD MODAL ──────────────────────── */}
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
              className="w-full max-w-2xl my-4 md:my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="px-5 md:px-6 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                      Βήμα {step} από 4
                    </p>
                    <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900">
                      {editing ? 'Επεξεργασία Ανακοίνωσης' : 'Νέα Ανακοίνωση'}
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

                {/* Progress steps */}
                <div className="mt-4 flex items-center gap-1.5">
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s.num}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                            step > s.num
                              ? 'bg-emerald-500 text-white'
                              : step === s.num
                              ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {step > s.num ? <IconCheck className="h-3.5 w-3.5" /> : s.num}
                        </div>
                        <span className={`hidden sm:inline text-[11px] font-semibold ${step >= s.num ? 'text-slate-800' : 'text-slate-400'}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 rounded-full transition-all ${step > s.num ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Modal body */}
              <form onSubmit={handleSave}>
                <div className="p-5 md:p-6 min-h-[320px]">
                  <AnimatePresence mode="wait">
                    {/* ─── STEP 1: Basics ─── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Τίτλος <span className="text-red-500">*</span>
                          </label>
                          <input
                            autoFocus
                            value={form.title}
                            onChange={(e) => updateForm('title', e.target.value)}
                            className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                            placeholder="π.χ. Νέα δράση ενημέρωσης"
                          />
                          <p className="text-[10px] text-slate-400 mt-1.5 pl-3">
                            Ένας σύντομος, περιγραφικός τίτλος.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Σύντομη περίληψη
                          </label>
                          <input
                            value={form.summary}
                            onChange={(e) => updateForm('summary', e.target.value)}
                            className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                            placeholder="Μία σύντομη περιγραφή (προαιρετικό)"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 2: Content ─── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Κείμενο ανακοίνωσης <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            autoFocus
                            rows={12}
                            value={form.description}
                            onChange={(e) => updateForm('description', e.target.value)}
                            className="w-full rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none resize-none leading-relaxed"
                            placeholder="Γράψτε το πλήρες κείμενο της ανακοίνωσης..."
                          />
                          <p className="text-[10px] text-slate-400 mt-1.5 pl-3">
                            {form.description.length} χαρακτήρες
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 3: Images ─── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Εικόνες (προαιρετικό)
                          </label>
                          <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                              <IconImage className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-semibold text-slate-600">
                              {uploading ? 'Ανέβασμα...' : 'Πατήστε για να ανεβάσετε εικόνες'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              JPG, PNG, WEBP — πολλαπλές εικόνες
                            </span>
                          </label>

                          {form.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                              {form.images.map((url, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                                  <img src={url} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <IconX className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ─── STEP 4: Settings ─── */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Ημερομηνία δημοσίευσης
                            </label>
                            <input
                              type="date"
                              value={form.publish_date}
                              onChange={(e) => updateForm('publish_date', e.target.value)}
                              className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Ημερομηνία συμβάντος
                            </label>
                            <input
                              type="date"
                              value={form.event_date}
                              onChange={(e) => updateForm('event_date', e.target.value)}
                              className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Τρόπος διαγραφής
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => updateForm('deletion_mode', 'auto')}
                              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                                form.deletion_mode === 'auto'
                                  ? 'border-brand-500 bg-brand-50/50'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <p className="text-xs font-semibold text-slate-800">Αυτόματη</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Διαγράφεται στην ημερομηνία λήξης</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateForm('deletion_mode', 'admin')}
                              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                                form.deletion_mode === 'admin'
                                  ? 'border-brand-500 bg-brand-50/50'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <p className="text-xs font-semibold text-slate-800">Χειροκίνητη</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Μόνο από admin</p>
                            </button>
                          </div>
                        </div>

                        {form.deletion_mode === 'auto' && (
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                              Ημερομηνία λήξης
                            </label>
                            <input
                              type="date"
                              value={form.expiry_date}
                              onChange={(e) => updateForm('expiry_date', e.target.value)}
                              className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                            />
                          </div>
                        )}

                        <div className="space-y-2 pt-2">
                          <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={form.pinned}
                              onChange={(e) => updateForm('pinned', e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Κορυφαία (pinned)</p>
                              <p className="text-[10px] text-slate-500">Εμφανίζεται πρώτη στη λίστα</p>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={form.is_permanent}
                              onChange={(e) => updateForm('is_permanent', e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Μόνιμη ανακοίνωση</p>
                              <p className="text-[10px] text-slate-500">Δεν διαγράφεται ποτέ αυτόματα</p>
                            </div>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-between gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1 || saving}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all px-3 py-2"
                  >
                    <IconArrowLeft className="h-3.5 w-3.5" />
                    Πίσω
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-5 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600"
                    >
                      <span className="text-xs font-semibold">Επόμενο</span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:translate-x-0.5">
                        <IconArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saving}
                      className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 pl-5 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-700 disabled:opacity-50"
                    >
                      <span className="text-xs font-semibold">
                        {saving ? 'Αποθήκευση...' : (editing ? 'Ενημέρωση' : 'Δημοσίευση')}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  )}
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