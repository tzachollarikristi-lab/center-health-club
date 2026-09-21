import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, rectSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  fetchGallery, createGalleryItem, updateGalleryItem,
  deleteGalleryItem, uploadGalleryImage, reorderGallery
} from '../services/adminService';
import { useToast } from '../../components/Toast';

// ─── Icons ─────────────────────────────────────────
const IconPlus = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const IconSearch = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconEdit = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconImage = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>);
const IconLayout = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M5 13l4 4L19 7" /></svg>);
const IconGrip = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>);
const IconHand = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.667.667 0 00-1.14-.47l-2.215 2.215" /></svg>);
const IconArrowUpDown = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4" /></svg>);

// ─── Helpers ───────────────────────────────────────
const emptyForm = () => ({ title: '', description: '', image_url: '' });

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ─── Sortable Grid Item — whole card is draggable ───
function SortableItem({ item }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? undefined : (transition || 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)'),
        opacity: isDragging ? 0.25 : 1,
        zIndex: isDragging ? 50 : 1,
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        cursor: 'grab',
      }}
      className="relative group active:cursor-grabbing"
    >
      <div className="ios-shake relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/60 bg-white shadow-sm">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
          />
          {/* iOS-style grip indicator (visual only) */}
          <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5">
            <IconGrip className="h-3.5 w-3.5 text-slate-500" />
          </div>
        </div>
        <div className="px-2.5 py-2 bg-white">
          <p className="text-[11px] md:text-xs font-semibold text-slate-800 truncate">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

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
              <h3 className="font-display text-lg text-slate-900">Διαγραφή Φωτογραφίας</h3>
            </div>
            <p className="text-sm text-slate-600">
              Θέλετε σίγουρα να διαγράψετε τη φωτογραφία <strong>«{title}»</strong>;
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

// ─── Confirm Modal ────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Επιβεβαίωση', loading, tone = 'brand', icon: Icon = IconLayout }) {
  const isBrand = tone === 'brand';
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
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isBrand ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-600'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-slate-900">{title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={onClose} disabled={loading} className="btn-secondary text-sm px-4 py-2">Άκυρο</button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full font-medium transition-colors ${
                  isBrand
                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                } disabled:opacity-50`}
              >
                <IconCheck className="h-3.5 w-3.5" />
                {loading ? '...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────
export default function Gallery() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showEnterConfirm, setShowEnterConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Hold-to-drag: 120ms of contact starts a drag. Before that, taps stay taps.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGallery();
      setItems(data);
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
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      image_url: item.image_url || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadGalleryImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      showToast('Η εικόνα ανέβηκε.', 'success');
    } catch (err) {
      showToast('Σφάλμα upload: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('Ο τίτλος απαιτείται.', 'error'); return; }
    if (!form.image_url) { showToast('Η εικόνα απαιτείται.', 'error'); return; }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url,
    };

    setSaving(true);
    try {
      if (editing) {
        await updateGalleryItem(editing.id, payload);
        showToast('Η φωτογραφία ενημερώθηκε.', 'success');
      } else {
        await createGalleryItem(payload);
        showToast('Η φωτογραφία προστέθηκε.', 'success');
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
      await deleteGalleryItem(deleteTarget.id);
      showToast('Η φωτογραφία διαγράφηκε.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const enterEditMode = () => {
    setOrderedItems([...items]);
    setEditMode(true);
    setShowEnterConfirm(false);
  };

  const exitEditMode = () => {
    setEditMode(false);
    setOrderedItems([]);
    setActiveId(null);
    setShowExitConfirm(false);
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setOrderedItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => setActiveId(null);

  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      await reorderGallery(orderedItems);
      showToast('Η σειρά αποθηκεύτηκε.', 'success');
      setEditMode(false);
      setOrderedItems([]);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSavingOrder(false);
    }
  };

  const filtered = items.filter((it) =>
    it.title?.toLowerCase().includes(search.toLowerCase()) ||
    it.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeItem = orderedItems.find((i) => i.id === activeId);

  if (loading) {
    return (
      <div className="space-y-5 md:space-y-6 animate-pulse">
        <div className="h-8 w-56 rounded-full bg-slate-200/60" />
        <div className="h-10 w-72 rounded-full bg-slate-200/50" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square rounded-2xl bg-slate-200/50" />
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
            Γκαλερί
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            {items.length} {items.length === 1 ? 'φωτογραφία' : 'φωτογραφίες'} συνολικά.
          </p>
        </div>

        {!editMode ? (
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setShowEnterConfirm(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white pl-2 pr-4 py-1.5 text-slate-700 text-xs font-semibold transition-all hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-700"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-100 group-hover:text-brand-600">
                <IconLayout className="h-3.5 w-3.5" />
              </span>
              Αλλαγή Σειράς
            </button>
            <button
              onClick={openNew}
              className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0"
            >
              <span className="text-xs font-semibold tracking-wide">Νέα Φωτογραφία</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-90">
                <IconPlus className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white pl-2 pr-4 py-1.5 text-slate-700 text-xs font-semibold transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-red-100 group-hover:text-red-500">
                <IconX className="h-3.5 w-3.5" />
              </span>
              Άκυρο
            </button>
            <button
              onClick={saveOrder}
              disabled={savingOrder}
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-700 disabled:opacity-50"
            >
              <span className="text-xs font-semibold">{savingOrder ? 'Αποθήκευση...' : 'Αποθήκευση Σειράς'}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Search */}
      {!editMode && (
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
            placeholder="Αναζήτηση φωτογραφίας..."
            className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
          />
        </motion.div>
      )}

      {/* EDIT MODE BANNER — compact */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-brand-200/70 bg-gradient-to-r from-brand-50/80 via-white to-cyan-50/60 px-3.5 py-3 md:px-4 md:py-3"
        >
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md shadow-brand-500/25"
          >
            <IconHand className="h-4 w-4 md:h-4.5 md:w-4.5" />
          </motion.div>
          <p className="text-[11px] md:text-xs text-slate-700 leading-snug min-w-0">
            <span className="font-semibold text-slate-900">Κρατήστε πατημένη</span> μια φωτογραφία και{' '}
            <span className="font-semibold text-slate-900">σύρετέ την</span> στη νέα θέση.
          </p>
        </motion.div>
      )}

      {/* CONTENT */}
      {filtered.length === 0 && !editMode ? (
        <div className="rounded-2xl border border-slate-200/60 p-10 text-center"
             style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <IconImage className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            {search ? 'Δεν βρέθηκαν φωτογραφίες.' : 'Δεν υπάρχουν φωτογραφίες ακόμη. Προσθέστε την πρώτη!'}
          </p>
        </div>
      ) : editMode ? (
        <>
          <style>{`
            @keyframes iosShake {
              0%, 100% { transform: rotate(-0.6deg); }
              50%      { transform: rotate(0.6deg); }
            }
            .ios-shake { animation: iosShake 0.5s ease-in-out infinite; }
          `}</style>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={orderedItems.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {orderedItems.map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
              {activeItem ? (
                <div className="rotate-2 scale-105 overflow-hidden rounded-2xl md:rounded-3xl border-2 border-brand-500 bg-white shadow-2xl shadow-brand-500/30">
                  <div className="aspect-square relative overflow-hidden">
                    <img src={activeItem.image_url} alt="" className="w-full h-full object-cover" draggable={false} />
                  </div>
                  <div className="px-2.5 py-2 bg-white">
                    <p className="text-[11px] md:text-xs font-semibold text-slate-800 truncate">{activeItem.title}</p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/60 bg-slate-100 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-brand-600 transition-all shadow-sm"
                    aria-label="Επεξεργασία"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-red-600 transition-all shadow-sm"
                    aria-label="Διαγραφή"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-xs md:text-sm font-semibold truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-white/70 text-[10px] md:text-xs truncate mt-0.5">{item.description}</p>
                  )}
                </div>
              </div>

              <div className="p-3 md:hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{fmt(item.created_at)}</p>
              </div>
            </motion.div>
          ))}
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
                    {editing ? 'Επεξεργασία' : 'Νέα Φωτογραφία'}
                  </p>
                  <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900">
                    {editing ? 'Ενημέρωση Φωτογραφίας' : 'Προσθήκη Φωτογραφίας'}
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
                      Εικόνα <span className="text-red-500">*</span>
                    </label>

                    {form.image_url ? (
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                        <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2">
                          <label className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                              <IconImage className="h-3.5 w-3.5" />
                              Αλλαγή
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, image_url: '' }))}
                            className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <IconX className="h-3.5 w-3.5" />
                            Αφαίρεση
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                          <IconImage className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {uploading ? 'Ανέβασμα...' : 'Πατήστε για να ανεβάσετε εικόνα'}
                        </span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WEBP</span>
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Τίτλος <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                      placeholder="π.χ. Ημέρα Υγείας 2025"
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

      {/* ─── CONFIRM MODALS ───────────────────── */}
      <ConfirmModal
        open={showEnterConfirm}
        onClose={() => setShowEnterConfirm(false)}
        onConfirm={enterEditMode}
        title="Αλλαγή Σειράς"
        message="Κρατήστε πατημένη μια φωτογραφία και σύρετέ την στη νέα θέση. Οι αλλαγές θα εμφανιστούν στη δημόσια σελίδα μόνο αφού πατήσετε «Αποθήκευση Σειράς»."
        confirmLabel="Έναρξη"
        icon={IconArrowUpDown}
      />
      <ConfirmModal
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={exitEditMode}
        title="Ακύρωση Αλλαγών"
        message="Οι αλλαγές στη σειρά των φωτογραφιών δεν έχουν αποθηκευτεί. Αν συνεχίσετε, η αρχική σειρά θα επανέλθει."
        confirmLabel="Ναι, ακύρωση"
        tone="neutral"
        icon={IconX}
      />
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