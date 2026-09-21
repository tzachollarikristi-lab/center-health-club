import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

// ─── Icons ─────────────────────────────────────────
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M4.5 12.75l6 6 9-13.5" /></svg>);
const IconClock = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
const IconBank = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>);
const IconCopy = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375h-6.75a1.125 1.125 0 01-1.125-1.125v-9.5" /></svg>);
const IconLogout = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>);
const IconUser = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const IconCalendar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>);
const IconSparkle = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>);

// ─── Helpers ───────────────────────────────────────
const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
};
const daysBetween = (futureIso) => {
  if (!futureIso) return 0;
  const diff = new Date(futureIso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// ─── Loading State ────────────────────────────────
function LoadingState() {
  return (
    <div className="container-padded py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/60 bg-white shadow-xl p-12 text-center"
        >
          <div className="mx-auto h-12 w-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
          <p className="mt-5 text-sm font-medium text-slate-600">Φόρτωση στοιχείων μέλους...</p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── PENDING STATE ────────────────────────────────
function PendingView({ member, settings, onExit }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  // Determine if the user has already indicated they paid
  const hasPaid = Boolean(member?.payment_reference && member.payment_reference.trim());

  const handleCopyIban = async () => {
    const iban = member?.iban || settings?.donation_iban;
    if (!iban) return;
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      showToast('Το IBAN αντιγράφηκε!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Δεν ήταν δυνατή η αντιγραφή.', 'error');
    }
  };

  const iban = member?.iban || settings?.donation_iban || '';

  const steps = hasPaid
    ? [
        { num: 1, label: 'Υποβολή', desc: 'Η αίτησή σας καταχωρήθηκε', state: 'done' },
        { num: 2, label: 'Πληρωμή', desc: 'Δηλώθηκε η κατάθεση', state: 'done' },
        { num: 3, label: 'Έγκριση', desc: 'Περιμένουμε τον διαχειριστή', state: 'active' },
      ]
    : [
        { num: 1, label: 'Υποβολή', desc: 'Η αίτησή σας καταχωρήθηκε', state: 'done' },
        { num: 2, label: 'Πληρωμή', desc: 'Καταβάλλετε τη συνδρομή των 10€', state: 'active' },
        { num: 3, label: 'Έγκριση', desc: 'Γίνεται αυτόματα μετά την πληρωμή', state: 'idle' },
      ];

  return (
    <div className="container-padded py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* STATUS HEADER */}
        {hasPaid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 shadow-xl"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
            <div className="relative p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                >
                  <IconCheck className="h-10 w-10" />
                </motion.div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    </span>
                    Σε αναμονή έγκρισης
                  </span>
                  <h1 className="mt-2 font-display text-2xl md:text-3xl text-slate-900 leading-tight">
                    Γεια σου, <span className="italic font-normal text-emerald-700">{member?.name}</span>
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Λάβαμε την πληρωμή σου. <strong>Ο διαχειριστής θα επιβεβαιώσει την κατάθεση και θα σε εγκρίνει το συντομότερο δυνατό.</strong> Συνήθως εντός 1-2 εργάσιμων ημερών.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-xl"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
            <div className="relative p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                >
                  <IconClock className="h-10 w-10" />
                </motion.div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-600" />
                    </span>
                    Απαιτείται πληρωμή
                  </span>
                  <h1 className="mt-2 font-display text-2xl md:text-3xl text-slate-900 leading-tight">
                    Γεια σου, <span className="italic font-normal text-amber-700">{member?.name}</span>
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Η αίτησή σου καταχωρήθηκε. <strong>Για να ολοκληρωθεί η εγγραφή, κατάβαλε τη συνδρομή των 10€ στο παρακάτω IBAN.</strong> Μετά την κατάθεση, ο διαχειριστής θα σε εγκρίνει αυτόματα.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROGRESS STEPS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-slate-200/60 bg-white shadow-lg p-6 md:p-8"
        >
          <h2 className="font-display text-lg text-slate-900 mb-6 text-center">Πορεία αίτησης</h2>
          <div className="flex items-start justify-between gap-2">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex-1 flex flex-col items-center text-center min-w-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className={`relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full font-bold transition-all ${
                      step.state === 'done'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : step.state === 'active'
                          ? hasPaid
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100'
                            : 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-100'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.state === 'done' ? <IconCheck className="h-5 w-5 md:h-6 md:w-6" /> : step.num}
                    {step.state === 'active' && (
                      <motion.span
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full ${hasPaid ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      />
                    )}
                  </motion.div>
                  <p className={`mt-3 text-xs md:text-sm font-semibold ${
                    step.state === 'done' || step.state === 'active' ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[10px] md:text-xs text-slate-500 max-w-[110px] leading-tight">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mt-6 md:mt-7 h-0.5 flex-1 max-w-[60px] rounded-full transition-colors ${
                    steps[i + 1].state === 'done' || steps[i + 1].state === 'active' ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* PAYMENT CARD */}
        {hasPaid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <IconCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Πληρωμή</p>
                <h3 className="mt-0.5 font-display text-lg text-slate-900 leading-tight">
                  Η κατάθεση έχει δηλωθεί
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Δηλώσατε ότι έχετε πραγματοποιήσει την κατάθεση με αναφορά:
                </p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  «{member.payment_reference}»
                </p>
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Τι γίνεται τώρα;</strong> Ο διαχειριστής θα ελέγξει την τράπεζα και θα επιβεβαιώσει την κατάθεσή σας. 
                  Δεν χρειάζεται να κάνετε κάτι άλλο — θα ενημερωθείτε αυτόματα μόλις ολοκληρωθεί η έγκριση.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-cyan-600 p-6 md:p-8 text-white shadow-2xl shadow-brand-500/25"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <IconBank className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Βήμα 2 · Πληρωμή</p>
                  <p className="font-display text-xl md:text-2xl text-white">Καταβάλλετε 10,00 €</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">IBAN</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-mono text-base md:text-lg font-semibold text-white break-all">
                    {iban || 'Δεν έχει οριστεί IBAN'}
                  </p>
                  {iban && (
                    <button
                      type="button"
                      onClick={handleCopyIban}
                      className="group inline-flex items-center gap-2 self-start rounded-full bg-white text-brand-700 px-4 py-2 text-xs font-bold transition-all hover:bg-brand-50 active:scale-[0.97] shrink-0"
                    >
                      {copied ? <IconCheck className="h-4 w-4 text-emerald-600" /> : <IconCopy className="h-4 w-4" />}
                      {copied ? 'Αντιγράφηκε!' : 'Αντιγραφή IBAN'}
                    </button>
                  )}
                </div>
                {settings?.donation_account_name && (
                  <p className="mt-3 text-xs text-white/80">
                    <span className="font-semibold">Δικαιούχος:</span> {settings.donation_account_name}
                  </p>
                )}
              </div>

              <div className="mt-5 space-y-2 text-xs text-white/90">
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>Στο σχόλιο της κατάθεσης γράψτε <strong>οπωσδήποτε το ονοματεπώνυμό σας</strong> για ταυτοποίηση.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>Ποσό κατάθεσης: <strong>10,00€</strong> — καλύπτει 1 έτος μέλους.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>Μετά την κατάθεση, ο διαχειριστής θα εγκρίνει την αίτησή σας <strong>αυτόματα</strong>.</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MEMBER INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-slate-200/60 bg-white shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <IconUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Στοιχεία</p>
              <h3 className="font-display text-base md:text-lg text-slate-900 leading-tight">Τα στοιχεία σας</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ονοματεπώνυμο</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.name || '—'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Αρ. Ταυτότητας</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.id_number || '—'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Τηλέφωνο</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.phone || '—'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Κατάσταση</p>
              <p className={`mt-1 font-semibold ${hasPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hasPaid ? 'Σε αναμονή έγκρισης' : 'Σε αναμονή πληρωμής'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* FOOTER ACTIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
        >
          <Link to="/contact" className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
            Έχετε απορίες; Επικοινωνήστε μαζί μας →
          </Link>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <IconLogout className="h-3.5 w-3.5" />
            Αποσύνδεση
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── MEMBER STATE ─────────────────────────────────
function MemberView({ member, settings, onExit }) {
  const nextPaymentDate = member?.expiresAt ? fmt(member.expiresAt) : '—';
  const daysLeft = daysBetween(member?.expiresAt);
  const memberSince = member?.paymentDate ? fmt(member.paymentDate) : '—';

  return (
    <div className="container-padded py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
            </span>
            Ενεργό Μέλος
          </span>
          <h1 className="mt-3 font-display text-2xl md:text-3xl text-slate-900 leading-tight">
            Καλώς ήρθες, <span className="italic font-normal text-emerald-700">{member?.name}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">Ευχαριστούμε για την υποστήριξή σου!</p>
        </motion.div>

        {/* Membership Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotateY: -10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 md:p-8 text-white shadow-2xl shadow-emerald-500/25"
          style={{ perspective: 1000 }}
        >
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">Membership Card</p>
                <p className="mt-1 font-display text-lg md:text-xl text-white leading-tight">Σύλλογος Φίλων</p>
                <p className="text-xs text-white/70">Κέντρου Υγείας Τροπαίων</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <IconSparkle className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 shadow-inner" />
              <p className="font-mono text-base md:text-lg tracking-wider text-white/90">
                {String(member?.id_number || '000000').toUpperCase()}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Μέλος από</p>
                <p className="mt-0.5 font-semibold text-white">{memberSince}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Λήξη</p>
                <p className="mt-0.5 font-semibold text-white">{nextPaymentDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
              <IconCheck className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Κατάσταση</p>
            <p className="mt-1 font-display text-base text-slate-900 leading-tight">Ενεργή συνδρομή</p>
          </div>

          <div className="rounded-3xl border border-brand-200/60 bg-gradient-to-br from-brand-50 via-white to-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 mb-3">
              <IconCalendar className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Επόμενη πληρωμή</p>
            <p className="mt-1 font-display text-base text-slate-900 leading-tight">{nextPaymentDate}</p>
          </div>

          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-3">
              <IconClock className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">Υπόλοιπο</p>
            <p className="mt-1 font-display text-base text-slate-900 leading-tight">
              {daysLeft} {daysLeft === 1 ? 'ημέρα' : 'ημέρες'}
            </p>
          </div>
        </motion.div>

        {/* Member Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-3xl border border-slate-200/60 bg-white shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <IconUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Στοιχεία Μέλους</p>
              <h3 className="font-display text-base md:text-lg text-slate-900 leading-tight">Το προφίλ σας</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ονοματεπώνυμο</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.name || '—'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Αρ. Ταυτότητας</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.id_number || '—'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Τηλέφωνο</p>
              <p className="mt-1 font-semibold text-slate-800">{member?.phone || '—'}</p>
            </div>
            {member?.birth_date && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ημ. Γέννησης</p>
                <p className="mt-1 font-semibold text-slate-800">{member.birth_date}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
        >
          <Link to="/contact" className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors">
            Χρειάζεστε βοήθεια; Επικοινωνήστε μαζί μας →
          </Link>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <IconLogout className="h-3.5 w-3.5" />
            Αποσύνδεση
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────
export default function MemberStatus() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [status, setStatus] = useState(null); // null = loading
  const [member, setMember] = useState(null);

  const handleExit = () => {
    localStorage.removeItem('clubMemberSession');
    localStorage.removeItem('clubMembershipStatus');
    navigate('/');
  };

  useEffect(() => {
    async function syncMembershipSession() {
      const rawSession = localStorage.getItem('clubMemberSession');
      const rawStatus = localStorage.getItem('clubMembershipStatus');
      const raw = rawSession || rawStatus;

      if (!raw) {
        navigate('/join');
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const idNumber = parsed?.id_number || '';
        const phone = parsed?.phone || '';

        if (!idNumber || !phone) {
          navigate('/join');
          return;
        }

        const { data, error } = await supabase.rpc('lookup_membership', {
          p_id_number: idNumber,
          p_phone: phone,
        });

        if (error) throw error;

        const match = (data && data[0]) || null;

        if (match) {
          const acceptedAt = match.created_at;
          const expired = acceptedAt && Date.now() > new Date(acceptedAt).getTime() + 31536000000;

          if (match.status === 'accepted' && !expired) {
            const memberSession = {
              status: 'member',
              name: match.name || parsed.name,
              id_number: match.id_number || parsed.id_number,
              phone: match.phone || parsed.phone,
              birth_date: match.birth_date || parsed.birth_date,
              paymentDate: acceptedAt,
              expiresAt: new Date(new Date(acceptedAt).getTime() + 31536000000).toISOString(),
            };
            localStorage.setItem('clubMemberSession', JSON.stringify(memberSession));
            localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'member', expiresAt: memberSession.expiresAt }));
            setStatus('member');
            setMember(memberSession);
            return;
          }

          const pendingSession = {
            status: 'pending',
            name: match.name || parsed.name,
            id_number: match.id_number || parsed.id_number,
            phone: match.phone || parsed.phone,
            expiresAt: null,
            iban: settings?.donation_iban || '',
            submittedAt: acceptedAt,
            payment_reference: match.payment_reference || parsed.payment_reference || '',
          };
          localStorage.setItem('clubMemberSession', JSON.stringify(pendingSession));
          setStatus('pending');
          setMember(pendingSession);
          return;
        }

        setStatus(parsed?.status === 'member' ? 'member' : 'pending');
        setMember(parsed);
      } catch (error) {
        console.error('MemberStatus error:', error);
        try {
          const parsed = JSON.parse(raw);
          setStatus(parsed?.status === 'member' ? 'member' : 'pending');
          setMember(parsed);
        } catch {
          navigate('/join');
        }
      }
    }

    syncMembershipSession();
  }, [navigate, settings?.donation_iban]);

  if (status === null) {
    return (
      <>
        <SEO title="Φόρτωση..." noIndex />
        <LoadingState />
      </>
    );
  }

  return (
    <>
      <SEO title="Το προφίλ μου" noIndex />
      {status === 'member' ? (
        <MemberView member={member} settings={settings} onExit={handleExit} />
      ) : (
        <PendingView member={member} settings={settings} onExit={handleExit} />
      )}
    </>
  );
}