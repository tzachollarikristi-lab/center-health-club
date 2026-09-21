import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchAllSiteSettings, saveSiteSettings, changeAdminPassword,
} from '../services/adminService';
import { useToast } from '../../components/Toast';
import { useSettings } from '../../contexts/SettingsContext';

// ─── Icons ─────────────────────────────────────────
const IconGlobe = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>);
const IconPhone = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" /></svg>);
const IconShare = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>);
const IconMap = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const IconHeart = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>);
const IconLock = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M5 13l4 4L19 7" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconText = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 6h16M4 12h16M4 18h10" /></svg>);

// ─── Section Card ──────────────────────────────────
function SectionCard({ icon: Icon, eyebrow, title, description, accent = 'brand', children, delay = 0 }) {
  const accentClasses = {
    brand:   'bg-brand-50 text-brand-600',
    cyan:    'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50 text-amber-600',
    rose:    'bg-rose-50 text-rose-600',
    slate:   'bg-slate-100 text-slate-600',
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl border border-slate-200/60 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
    >
      <div className="p-5 md:p-6 border-b border-slate-100 flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentClasses[accent] || accentClasses.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${accent === 'brand' ? 'text-brand-700' : `text-${accent}-700`}`}>
            {eyebrow}
          </p>
          <h2 className="mt-0.5 font-display text-base md:text-lg text-slate-900 leading-tight">{title}</h2>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="p-5 md:p-6 space-y-4">
        {children}
      </div>
    </motion.section>
  );
}

// ─── Field ─────────────────────────────────────────
function Field({ label, value, onChange, placeholder, hint, textarea = false, rows = 4, mono = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none resize-none leading-relaxed"
        />
      ) : (
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none ${mono ? 'font-mono' : ''}`}
        />
      )}
      {hint && <p className="text-[10px] text-slate-400 mt-1.5 pl-3">{hint}</p>}
    </div>
  );
}

// ─── Toggle ────────────────────────────────────────
function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        {hint && <p className="text-[10px] text-slate-500 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-300'
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}

// ─── Change Password Modal ─────────────────────────
function PasswordModal({ open, onClose }) {
  const { showToast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const close = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Συμπληρώστε όλα τα πεδία.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }
    setLoading(true);
    try {
      await changeAdminPassword(oldPassword, newPassword);
      showToast('Ο κωδικός άλλαξε επιτυχώς.', 'success');
      reset();
      onClose();
    } catch (err) {
      setError(err.message || 'Αποτυχία αλλαγής κωδικού.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <IconLock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Ασφάλεια</p>
                  <h3 className="font-display text-base text-slate-900">Αλλαγή Κωδικού</h3>
                </div>
              </div>
              <button
                onClick={close}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shrink-0"
                aria-label="Κλείσιμο"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="p-5 md:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Τρέχων κωδικός</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Νέος κωδικός</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                    autoComplete="new-password"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 pl-3">Τουλάχιστον 6 χαρακτήρες.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Επιβεβαίωση νέου κωδικού</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                    autoComplete="new-password"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <button type="button" onClick={close} disabled={loading} className="btn-secondary text-sm px-5 py-2">
                  Άκυρο
                </button>
                <button type="submit" disabled={loading} className="btn-primary text-sm px-5 py-2 disabled:opacity-50">
                  {loading ? 'Αλλαγή...' : 'Αλλαγή Κωδικού'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────
export default function Settings() {
  const { showToast } = useToast();
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSiteSettings();
      setSettings(data);
      setOriginal(data);
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const dirty = JSON.stringify(settings) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      setOriginal(settings);
      refreshSettings();
      showToast('Οι ρυθμίσεις αποθηκεύτηκαν.', 'success');
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(original);
    showToast('Οι αλλαγές ακυρώθηκαν.', 'info');
  };

  if (loading) {
    return (
      <div className="space-y-5 md:space-y-6 animate-pulse">
        <div className="h-8 w-56 rounded-full bg-slate-200/60" />
        <div className="h-10 w-72 rounded-full bg-slate-200/50" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 rounded-3xl bg-slate-200/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6 pb-28">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-slate-900">
          Ρυθμίσεις
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Διαχειριστείτε τα στοιχεία του ιστότοπου, την επικοινωνία και τις δωρεές.
        </p>
      </motion.div>

      {/* SECTION 1 — Site Info */}
      <SectionCard icon={IconGlobe} eyebrow="Ταυτότητα" title="Στοιχεία Ιστότοπου" description="Όνομα, tagline και hero κείμενα." accent="brand" delay={0.05}>
        <Field
          label="Όνομα Ιστότοπου"
          value={settings.site_name}
          onChange={(v) => update('site_name', v)}
          placeholder="π.χ. Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων"
        />
        <Field
          label="Tagline"
          value={settings.site_tagline}
          onChange={(v) => update('site_tagline', v)}
          placeholder="Σύντομη περιγραφή του συλλόγου"
        />
        <Field
          label="Τίτλος Hero (αρχική)"
          value={settings.hero_title}
          onChange={(v) => update('hero_title', v)}
          placeholder="π.χ. Ελπίδα ζωής για τη Δυτική Γορτυνία"
        />
        <Field
          label="Υπότιτλος Hero"
          value={settings.hero_subtitle}
          onChange={(v) => update('hero_subtitle', v)}
          placeholder="Σύντομο μήνυμα κάτω από τον τίτλο"
          textarea
          rows={3}
        />
        <Field
          label="Κείμενο Footer"
          value={settings.footer_text}
          onChange={(v) => update('footer_text', v)}
          placeholder="Κείμενο που εμφανίζεται στο υποσέλιδο"
          textarea
          rows={2}
        />
      </SectionCard>

      {/* SECTION 2 — Contact */}
      <SectionCard icon={IconPhone} eyebrow="Επικοινωνία" title="Στοιχεία Επικοινωνίας" description="Τηλέφωνο, email και διεύθυνση." accent="cyan" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Email Επικοινωνίας"
            value={settings.contact_email}
            onChange={(v) => update('contact_email', v)}
            placeholder="info@example.com"
          />
          <Field
            label="Τηλέφωνο Υποστήριξης"
            value={settings.support_phone}
            onChange={(v) => update('support_phone', v)}
            placeholder="+30 22310 12345"
          />
        </div>
        <Field
          label="Διεύθυνση"
          value={settings.address}
          onChange={(v) => update('address', v)}
          placeholder="Κέντρο Υγείας Τροπαίων, Δυτική Γορτυνία"
        />
      </SectionCard>

      {/* SECTION 3 — Social */}
      <SectionCard icon={IconShare} eyebrow="Social" title="Κοινωνικά Δίκτυα" description="Σύνδεσμοι προς τις σελίδες σας." accent="slate" delay={0.15}>
        <Field
          label="Facebook URL"
          value={settings.facebook_url}
          onChange={(v) => update('facebook_url', v)}
          placeholder="https://facebook.com/yours"
        />
        <Field
          label="Instagram URL"
          value={settings.instagram_url}
          onChange={(v) => update('instagram_url', v)}
          placeholder="https://instagram.com/yours"
        />
      </SectionCard>

      {/* SECTION 4 — Map */}
      <SectionCard icon={IconMap} eyebrow="Χάρτης" title="Χάρτης & Τοποθεσία" description="Εμφάνιση χάρτη και σύνδεσμος οδηγιών." accent="emerald" delay={0.2}>
        <Field
          label="Σύνδεσμος Χάρτη (Google Maps)"
          value={settings.map_link}
          onChange={(v) => update('map_link', v)}
          placeholder="https://www.google.com/maps/..."
          hint="Χρησιμοποιείται από τα κουμπιά 'Οδηγίες'."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <Toggle
            label="Χάρτης στην Αρχική"
            hint="Εμφάνιση του χάρτη στη σελίδα Home."
            checked={settings.show_map_home === 'true'}
            onChange={(v) => update('show_map_home', String(v))}
          />
          <Toggle
            label="Χάρτης στην Επικοινωνία"
            hint="Εμφάνιση του χάρτη στη σελίδα Contact."
            checked={settings.show_map_contact === 'true'}
            onChange={(v) => update('show_map_contact', String(v))}
          />
        </div>
      </SectionCard>

      {/* SECTION 5 — Donations */}
      <SectionCard icon={IconHeart} eyebrow="Δωρεές" title="Στοιχεία Δωρεών" description="IBAN και οδηγίες για τα μέλη." accent="rose" delay={0.25}>
        <Field
          label="IBAN"
          value={settings.donation_iban}
          onChange={(v) => update('donation_iban', v)}
          placeholder="GR00 0000 0000 0000 0000 0000 000"
          hint="Εμφανίζεται στη σελίδα Δωρεάς και στις αιτήσεις μέλους."
          mono
        />
        <Field
          label="Δικαιούχος Λογαριασμού"
          value={settings.donation_account_name}
          onChange={(v) => update('donation_account_name', v)}
          placeholder="Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων"
        />
        <Field
          label="Οδηγίες Κατάθεσης"
          value={settings.donation_instructions}
          onChange={(v) => update('donation_instructions', v)}
          placeholder="π.χ. Γράψτε το όνομά σας στο σχόλιο της κατάθεσης."
          textarea
          rows={2}
        />
        <Field
          label="Άλλοι Τρόποι Δωρεάς"
          value={settings.donation_other}
          onChange={(v) => update('donation_other', v)}
          placeholder="Περιγράψτε άλλους τρόπους υποστήριξης."
          textarea
          rows={3}
        />
      </SectionCard>

      {/* SECTION 6 — Security */}
      <SectionCard icon={IconLock} eyebrow="Ασφάλεια" title="Κωδικός Πρόσβασης" description="Αλλάξτε τον κωδικό διαχειριστή." accent="slate" delay={0.3}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Για λόγους ασφαλείας, συνιστάται να αλλάζετε τον κωδικό σας τακτικά.
          </p>
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 bg-white pl-2 pr-4 py-1.5 text-slate-700 text-xs font-semibold transition-all hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-700 shrink-0"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-600">
              <IconLock className="h-3.5 w-3.5" />
            </span>
            Αλλαγή Κωδικού
          </button>
        </div>
      </SectionCard>

      {/* ─── FLOATING SAVE BAR ────────────────── */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-40 p-3 pointer-events-none"
          >
            <div className="pointer-events-auto mx-auto max-w-3xl rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 px-4 py-2.5 flex items-center gap-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                <p className="text-xs font-medium truncate">Έχετε μη αποθηκευμένες αλλαγές.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-white/70 hover:text-white transition-colors px-3 py-1.5"
                >
                  Άκυρο
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-500 pl-4 pr-1.5 py-1.5 text-white transition-all disabled:opacity-50"
                >
                  <span className="text-xs font-semibold">{saving ? 'Αποθήκευση...' : 'Αποθήκευση'}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <PasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
}