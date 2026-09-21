import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchClubMembers, createClubMember, updateClubMember, deleteClubMember,
  fetchPresidentSettings, savePresidentSettings, uploadPresidentImage,
} from '../services/adminService';
import { useToast } from '../../components/Toast';
import { useSettings } from '../../contexts/SettingsContext';

// ─── Icons ─────────────────────────────────────────
const IconPlus = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconEdit = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconUsers = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
const IconPhone = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" /></svg>);
const IconImage = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></svg>);
const IconQuote = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M9.5 4.5c-3 0-5.5 2.5-5.5 5.5v8c0 1.1.9 2 2 2h3.5c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H6.5V10c0-1.7 1.3-3 3-3V4.5zm10 0c-3 0-5.5 2.5-5.5 5.5v8c0 1.1.9 2 2 2H19.5c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-3V10c0-1.7 1.3-3 3-3V4.5z"/></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M5 13l4 4L19 7" /></svg>);
const IconStar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>);

// ─── Constants ─────────────────────────────────────
const ROLES = ['Πρόεδρος', 'Αντιπρόεδρος', 'Γραμματέας', 'Ταμίας', 'Μέλος', 'Τακτικό Μέλος'];
const ROLE_ORDER = { 'Πρόεδρος': 0, 'Αντιπρόεδρος': 1, 'Γραμματέας': 2, 'Ταμίας': 3, 'Μέλος': 4, 'Τακτικό Μέλος': 5 };

const emptyMember = () => ({ name: '', role: 'Μέλος', phone: '' });

// ─── Confirm Delete ───────────────────────────────
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
              <h3 className="font-display text-lg text-slate-900">Διαγραφή Μέλους</h3>
            </div>
            <p className="text-sm text-slate-600">
              Θέλετε σίγουρα να διαγράψετε το μέλος <strong>«{title}»</strong>;
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
export default function Leadership() {
  const { showToast } = useToast();
  const { refreshSettings } = useSettings();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Members modal
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState(emptyMember());
  const [savingMember, setSavingMember] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // President
  const [president, setPresident] = useState({ president_name: '', president_title: '', president_image_url: '', president_message: '' });
  const [savingPresident, setSavingPresident] = useState(false);
  const [uploadingPresidentImage, setUploadingPresidentImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mem, pres] = await Promise.all([fetchClubMembers(), fetchPresidentSettings()]);
      setMembers(mem);
      setPresident({
        president_name: pres.president_name || '',
        president_title: pres.president_title || '',
        president_image_url: pres.president_image_url || '',
        president_message: pres.president_message || '',
      });
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Member handlers ──────────────────────────
  const openNewMember = () => {
    setEditingMember(null);
    setMemberForm(emptyMember());
    setMemberModalOpen(true);
  };

  const openEditMember = (m) => {
    setEditingMember(m);
    setMemberForm({
      name: m.name || '',
      role: m.role || 'Μέλος',
      phone: m.phone || '',
    });
    setMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    if (savingMember) return;
    setMemberModalOpen(false);
  };

  const updateMemberForm = (field, value) => {
    let v = value;
    if (field === 'name') v = value.toUpperCase();
    if (field === 'phone') v = value.replace(/\D/g, '').slice(0, 10);
    setMemberForm((prev) => ({ ...prev, [field]: v }));
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    const cleanName = memberForm.name.trim();
    const cleanPhone = memberForm.phone.replace(/\D/g, '').slice(0, 10);

    if (!cleanName) { showToast('Το όνομα απαιτείται.', 'error'); return; }
    if (!cleanPhone || cleanPhone.length !== 10) { showToast('Το τηλέφωνο πρέπει να έχει 10 ψηφία.', 'error'); return; }

    const payload = {
      name: cleanName,
      role: memberForm.role || 'Μέλος',
      phone: cleanPhone,
      sort_order: ROLE_ORDER[memberForm.role] ?? 99,
    };

    setSavingMember(true);
    try {
      if (editingMember) {
        await updateClubMember(editingMember.id, payload);
        showToast('Το μέλος ενημερώθηκε.', 'success');
      } else {
        await createClubMember(payload);
        showToast('Το μέλος προστέθηκε.', 'success');
      }
      setMemberModalOpen(false);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteClubMember(deleteTarget.id);
      showToast('Το μέλος διαγράφηκε.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ─── President handlers ────────────────────────
  const updatePresident = (field, value) => setPresident((prev) => ({ ...prev, [field]: value }));

  const handlePresidentImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPresidentImage(true);
    try {
      const url = await uploadPresidentImage(file);
      updatePresident('president_image_url', url);
      showToast('Η φωτογραφία ανέβηκε.', 'success');
    } catch (err) {
      showToast('Σφάλμα upload: ' + err.message, 'error');
    } finally {
      setUploadingPresidentImage(false);
    }
  };

  const handleSavePresident = async (e) => {
    e.preventDefault();
    setSavingPresident(true);
    try {
      await savePresidentSettings(president);
      showToast('Το μήνυμα αποθηκεύτηκε.', 'success');
      refreshSettings();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSavingPresident(false);
    }
  };

  // ─── Derived: board members split ──────────────
  const boardMembers = members.filter((m) => ['Πρόεδρος', 'Αντιπρόεδρος', 'Γραμματέας', 'Ταμίας', 'Μέλος'].includes(m.role));
  const regularMembers = members.filter((m) => m.role === 'Τακτικό Μέλος');

  if (loading) {
    return (
      <div className="space-y-5 md:space-y-6 animate-pulse">
        <div className="h-8 w-56 rounded-full bg-slate-200/60" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-slate-200/50" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div className="min-w-0">
          <h1 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-slate-900">
            Διοίκηση & Μέλη
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Διαχειριστείτε τα μέλη του συμβουλίου και το μήνυμα του Προέδρου.
          </p>
        </div>
        <button
          onClick={openNewMember}
          className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0 self-start"
        >
          <span className="text-xs font-semibold tracking-wide">Νέο Μέλος</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-90">
            <IconPlus className="h-3.5 w-3.5" />
          </span>
        </button>
      </motion.div>

      {/* ─── SECTION 1: BOARD MEMBERS ─────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconStar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Διοικητικό Συμβούλιο</p>
            <h2 className="font-display text-base md:text-lg text-slate-900 leading-tight">
              Μέλη Διοίκησης <span className="text-slate-400 font-normal">({boardMembers.length})</span>
            </h2>
          </div>
        </div>

        {boardMembers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 p-8 text-center"
               style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <IconUsers className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">
              Δεν έχουν καταχωρηθεί μέλη διοίκησης ακόμη.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
          >
            {boardMembers.map((m) => (
              <motion.div
                key={m.id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                className="group relative rounded-2xl border border-slate-200/60 p-4 md:p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex items-start gap-3.5">
                  {/* Avatar */}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-base font-bold shadow-sm ${
                    m.role === 'Πρόεδρος'
                      ? 'bg-gradient-to-br from-brand-500 to-cyan-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {(m.name || '?').charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{m.name}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider mt-1 ${
                      m.role === 'Πρόεδρος'
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {m.role === 'Πρόεδρος' && <IconStar className="h-2.5 w-2.5" />}
                      {m.role}
                    </span>
                    {m.phone && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                        <IconPhone className="h-3 w-3" />
                        {m.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openEditMember(m)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white border border-slate-200 py-2 text-[11px] font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                  >
                    <IconEdit className="h-3.5 w-3.5" />
                    Επεξεργασία
                  </button>
                  <button
                    onClick={() => setDeleteTarget(m)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                    aria-label="Διαγραφή"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        </motion.section>

      {/* ─── SECTION 2: PRESIDENT MESSAGE ─────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <IconQuote className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Μήνυμα</p>
            <h2 className="font-display text-base md:text-lg text-slate-900 leading-tight">
              Μήνυμα Προέδρου
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleSavePresident}
          className="rounded-3xl border border-slate-200/60 p-5 md:p-6 space-y-5"
          style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Όνομα Προέδρου</label>
              <input
                value={president.president_name}
                onChange={(e) => updatePresident('president_name', e.target.value)}
                className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                placeholder="π.χ. Ιωάννης Παπαδόπουλος"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Τίτλος / Θέση</label>
              <input
                value={president.president_title}
                onChange={(e) => updatePresident('president_title', e.target.value)}
                className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                placeholder="π.χ. Πρόεδρος Δ.Σ."
              />
            </div>
          </div>

          {/* President photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Φωτογραφία Προέδρου</label>
            {president.president_image_url ? (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3">
                <img
                  src={president.president_image_url}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-900/5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700">Φωτογραφία σε χρήση</p>
                  <p className="text-[10px] text-slate-500 truncate">{president.president_image_url}</p>
                </div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handlePresidentImageUpload} className="hidden" disabled={uploadingPresidentImage} />
                  <span className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
                    {uploadingPresidentImage ? 'Ανέβασμα...' : 'Αλλαγή'}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => updatePresident('president_image_url', '')}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all"
                  aria-label="Αφαίρεση"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all">
                <input type="file" accept="image/*" onChange={handlePresidentImageUpload} className="hidden" disabled={uploadingPresidentImage} />
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <IconImage className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {uploadingPresidentImage ? 'Ανέβασμα...' : 'Πατήστε για να ανεβάσετε φωτογραφία'}
                </span>
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Κείμενο Μηνύματος</label>
            <textarea
              rows={8}
              value={president.president_message}
              onChange={(e) => updatePresident('president_message', e.target.value)}
              className="w-full rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none resize-none leading-relaxed"
              placeholder="Το μήνυμα του Προέδρου προς τα μέλη και την κοινότητα..."
            />
            <p className="text-[10px] text-slate-400 mt-1.5 pl-3">
              {president.president_message.length} χαρακτήρες
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingPresident}
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 pl-5 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-700 disabled:opacity-50"
            >
              <span className="text-xs font-semibold">{savingPresident ? 'Αποθήκευση...' : 'Αποθήκευση Μηνύματος'}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <IconCheck className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </form>
      </motion.section>

      {/* ─── MEMBER MODAL ──────────────────────── */}
      <AnimatePresence>
        {memberModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeMemberModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md my-4 md:my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-slate-200">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    {editingMember ? 'Επεξεργασία' : 'Νέο Μέλος'}
                  </p>
                  <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900">
                    {editingMember ? 'Ενημέρωση Μέλους' : 'Προσθήκη Μέλους'}
                  </h3>
                </div>
                <button
                  onClick={closeMemberModal}
                  disabled={savingMember}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shrink-0"
                  aria-label="Κλείσιμο"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMember}>
                <div className="p-5 md:p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ονοματεπώνυμο <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={memberForm.name}
                      onChange={(e) => updateMemberForm('name', e.target.value)}
                      className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                      placeholder="π.χ. ΙΩΑΝΝΗΣ ΠΑΠΑΔΟΠΟΥΛΟΣ"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Ρόλος <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={memberForm.role}
                      onChange={(e) => updateMemberForm('role', e.target.value)}
                      className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none appearance-none"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Τηλέφωνο <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={memberForm.phone}
                      onChange={(e) => updateMemberForm('phone', e.target.value)}
                      className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                      placeholder="10 ψηφία"
                      inputMode="numeric"
                      maxLength={10}
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5 pl-3">
                      Μόνο ψηφία, ακριβώς 10 χαρακτήρες.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={closeMemberModal}
                    disabled={savingMember}
                    className="btn-secondary text-sm px-5 py-2"
                  >
                    Άκυρο
                  </button>
                  <button
                    type="submit"
                    disabled={savingMember}
                    className="btn-primary text-sm px-5 py-2 disabled:opacity-50"
                  >
                    {savingMember ? 'Αποθήκευση...' : (editingMember ? 'Ενημέρωση' : 'Προσθήκη')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteMember}
        title={deleteTarget?.name || ''}
        loading={deleting}
      />
    </div>
  );
}