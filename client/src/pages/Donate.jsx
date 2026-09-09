import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import Loading from '../components/Loading';

// ─── Inline SVG Icons ─────────────────────────────────────────────
const IconBank = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75L3 18.75M3 18.75H21M3 18.75L3.75 18.75M21 18.75L21.75 18.75M21 18.75L20.25 18.75M4.5 18.75L4.5 9M9 18.75L9 9M14.25 18.75L14.25 9M19.5 18.75L19.5 9M2.25 6.75L12 3L21.75 6.75L12 10.5L2.25 6.75Z" />
  </svg>
);

const IconCopy = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375h-6.75a1.125 1.125 0 01-1.125-1.125v-9.5" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconHeart = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────
const Donate = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [copied, setCopied] = useState(false);

  const iban = settings?.donation_iban || '';
  const accountName = settings?.donation_account_name || '';
  const instructions = settings?.donation_instructions || '';
  const otherMethods = settings?.donation_other || '';

  const handleCopy = async () => {
    if (!iban) return;
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('Δεν ήταν δυνατή η αντιγραφή. Παρακαλώ αντιγράψτε χειροκίνητα.');
    }
  };

  if (settingsLoading) return <Loading full message="Φόρτωση..." />;

  return (
    <div className="container-padded py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Υποστήριξε τον σύλλογο</h1>
          <p className="text-sm text-slate-500 mt-1">Η δωρεά σας βοηθά να συνεχίσουμε το έργο μας.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <IconHeart className="h-3.5 w-3.5" />
          Εθελοντική προσφορά
        </span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* ─── Bank Transfer ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
              <IconBank className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Τραπεζικός λογαριασμός</h2>
          </div>

          {iban ? (
            <div className="space-y-4">
              {accountName && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Δικαιούχος</p>
                  <p className="text-sm text-slate-600">{accountName}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-700">IBAN</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-800 break-all">
                    {iban}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Αντιγραφή IBAN"
                  >
                    {copied ? (
                      <IconCheck className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <IconCopy className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                    <IconCheck className="h-3.5 w-3.5" />
                    Αντιγράφηκε στο πρόχειρο
                  </p>
                )}
              </div>

              {instructions && (
                <div>
                  <p className="text-sm font-medium text-slate-700">Οδηγίες</p>
                  <p className="text-sm text-slate-600">{instructions}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Δεν έχει καταχωρηθεί IBAN. Επικοινωνήστε με τον διαχειριστή.
            </p>
          )}
        </motion.div>

        {/* ─── Other Methods ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="card p-6 md:p-8 flex flex-col"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Άλλοι τρόποι</h2>
          {otherMethods ? (
            <div className="flex-1">
              <p className="text-sm text-slate-600 leading-relaxed">{otherMethods}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 flex-1">
              Δεν υπάρχουν άλλες επιλογές αυτή τη στιγμή. Μπορείτε να επικοινωνήσετε μαζί μας για περισσότερες πληροφορίες.
            </p>
          )}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Για περισσότερες πληροφορίες,{' '}
              <a href="/contact" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
                επικοινωνήστε μαζί μας
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─── Footer message ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10 text-center text-sm text-slate-500"
      >
        <p>Η δωρεά σας είναι πολύτιμη και συμβάλλει στην υλοποίηση των δράσεών μας.</p>
        <p className="mt-1">Σας ευχαριστούμε για την υποστήριξή σας.</p>
      </motion.div>
    </div>
  );
};

export default Donate;