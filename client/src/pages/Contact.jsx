import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';

// ─── Icons ────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const SendIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const PinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 8.5c0-.8.6-1.5 1.4-1.5h2.1V3.5h-2.1C12.4 3.5 10.8 5.1 10.8 7.2V9h-1.8v2.5H10.8V20h2.8v-8.5h2.1L15.9 9h-2.4V8.5Z" />
  </svg>
);
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.3 1 .6 1.4 1 .4.4.7.8 1 1.4.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.3.6-.6 1-1 1.4-.4.4-.8.7-1.4 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.3-1-.6-1.4-1-.4-.4-.7-.8-1-1.4-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.3-.6.6-1 1-1.4.4-.4.8-.7 1.4-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.8A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2z" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);
const AlertIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── Contact ─────────────────────────────────────────────────────
const Contact = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return 'Συμπληρώστε το όνομά σας.';
    if (!form.email.trim()) return 'Συμπληρώστε το email σας.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Εισάγετε έγκυρο email.';
    if (!form.message.trim()) return 'Γράψτε το μήνυμά σας.';
    if (form.message.trim().length < 10) return 'Το μήνυμα πρέπει να έχει τουλάχιστον 10 χαρακτήρες.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      showToast(validationError, 'error');
      return;
    }

    if (!supabase) {
      const msg = 'Το σύστημα δεν είναι διαθέσιμο αυτή τη στιγμή.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert([{
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          is_read: false,
        }]);

      if (insertError) throw insertError;

      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      showToast('Το μήνυμά σας στάλθηκε με επιτυχία!', 'success');
    } catch (err) {
      console.error(err);
      const msg = 'Αποτυχία αποστολής. Προσπαθήστε ξανά σε λίγο.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (settingsLoading) return <Loading full message="Φόρτωση..." />;

  const phone = settings?.support_phone || '+30 22310 12345';
  const email = settings?.contact_email || 'info@tropaiwn-hc.gr';
  const address = settings?.address || 'Κέντρο Υγείας Τροπαίων, Δυτική Γορτυνία';
  const facebook = settings?.facebook_url || '';
  const instagram = settings?.instagram_url || '';
  const showMap = settings?.show_map_contact !== 'false' && settings?.map_link;

  const phoneDigits = phone.replace(/\D/g, '');
  const phoneHref = phoneDigits.startsWith('30') ? `tel:+${phoneDigits}` : `tel:+30${phoneDigits}`;

  return (
    <div className="bg-[#faf8f4] text-slate-900 min-h-screen">

      {/* ══════════════════════════════════════════════════
          PAGE HEADER
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-slate-900/8">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, #fdfdfc 0%, #f4f9fd 45%, #eaf0f7 100%)',
        }} />
        <div
          className="absolute -top-32 right-1/4 h-[280px] w-[380px] rounded-full opacity-[0.1] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
        />

        <div className="container-padded relative z-10 pt-8 pb-8 md:pt-10 md:pb-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Πίσω στην αρχική
            </Link>

            <h1 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.02em] text-slate-900">
              Επικοινωνία
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
              Στείλτε μας μήνυμα ή βρείτε μας με όποιον τρόπο σας εξυπηρετεί.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAIN — Form + Contact info side by side
      ══════════════════════════════════════════════════ */}
      <section className="pt-10 md:pt-14 pb-16 md:pb-20">
        <div className="container-padded">
          <div className="grid lg:grid-cols-5 gap-5 md:gap-6 items-start">

            {/* ─── FORM — 3/5 ─────────────────────────── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              <div
                className="rounded-2xl border border-slate-200/60 p-6 md:p-8"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <SendIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                      Φόρμα μηνύματος
                    </p>
                    <h2 className="font-display text-lg md:text-xl text-slate-900 leading-tight">
                      Στείλτε μας μήνυμα
                    </h2>
                  </div>
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                      <CheckIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg text-slate-900">
                      Ευχαριστούμε!
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Το μήνυμά σας λήφθηκε. Θα λάβετε απάντηση το συντομότερο δυνατό.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 pl-5 pr-2 py-1.5 text-white transition-all hover:bg-brand-600 group"
                    >
                      <span className="text-xs font-semibold">Νέο μήνυμα</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:rotate-[-45deg]">
                        <SendIcon className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Όνομα <span className="text-brand-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          placeholder="Το όνομά σας"
                          className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email <span className="text-brand-600">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          placeholder="example@email.com"
                          className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Θέμα
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        placeholder="Για ποιο θέμα επικοινωνείτε;"
                        className="w-full h-11 rounded-full bg-white border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Μήνυμα <span className="text-brand-600">*</span>
                      </label>
                      <textarea
                        rows={6}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Γράψτε το μήνυμά σας..."
                        className="w-full rounded-2xl bg-white border border-slate-200 p-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none resize-none"
                        required
                      />
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Ελάχιστο 10 χαρακτήρες
                        </span>
                        <span className={`tabular-nums ${form.message.length > 2000 ? 'text-red-500' : 'text-slate-400'}`}>
                          {form.message.length} / 2000
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                        <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="group inline-flex items-center justify-between gap-3 rounded-full bg-slate-900 pl-6 pr-2 py-2 text-white transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        <span className="text-sm font-semibold">
                          {submitting ? 'Αποστολή...' : 'Αποστολή μηνύματος'}
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-[-45deg]">
                          {submitting ? (
                            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          ) : (
                            <SendIcon className="h-4 w-4" />
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* ─── CONTACT INFO — 2/5 ────────────────── */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={1}
              className="lg:col-span-2 space-y-4 md:space-y-5"
            >
              {/* Info card */}
              <div
                className="rounded-2xl border border-slate-200/60 p-6 md:p-7"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                  Στοιχεία επικοινωνίας
                </p>
                <h3 className="mt-1.5 font-display text-lg md:text-xl text-slate-900 leading-tight">
                  Βρείτε μας
                </h3>

                <ul className="mt-5 space-y-4">
                  {/* Phone */}
                  <li>
                    <a
                      href={phoneHref}
                      className="group flex items-start gap-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <PhoneIcon className="h-4 w-4" />
                      </span>
                      <div className="pt-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Τηλέφωνο
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                          {phone}
                        </p>
                      </div>
                    </a>
                  </li>

                  {/* Email */}
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-start gap-3.5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <MailIcon className="h-4 w-4" />
                      </span>
                      <div className="pt-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Email
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate group-hover:text-brand-700 transition-colors">
                          {email}
                        </p>
                      </div>
                    </a>
                  </li>

                  {/* Address */}
                  <li>
                    <div className="flex items-start gap-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                        <PinIcon className="h-4 w-4" />
                      </span>
                      <div className="pt-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Διεύθυνση
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-900">
                          {address}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social */}
              {(facebook || instagram) && (
                <div
                  className="rounded-2xl border border-slate-200/60 p-6 md:p-7"
                  style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    Social
                  </p>
                  <h3 className="mt-1.5 font-display text-base md:text-lg text-slate-900 leading-tight">
                    Ακολουθήστε μας
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white ring-1 ring-slate-900/8 pl-3 pr-4 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-900 hover:text-white hover:ring-slate-900"
                      >
                        <FacebookIcon className="h-3.5 w-3.5" />
                        Facebook
                      </a>
                    )}
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full bg-white ring-1 ring-slate-900/8 pl-3 pr-4 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600 hover:text-white hover:ring-pink-600"
                      >
                        <InstagramIcon className="h-3.5 w-3.5" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAP
      ══════════════════════════════════════════════════ */}
      {showMap && (
        <section className="pb-20 md:pb-24">
          <div className="container-padded">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200/60 overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
            >
              {/* Header */}
              <div className="p-6 md:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <PinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Τοποθεσία
                    </p>
                    <h3 className="mt-1 font-display text-lg md:text-xl text-slate-900 leading-tight">
                      Κέντρο Υγείας Τροπαίων
                    </h3>
                  </div>
                </div>

                <a
                  href={settings.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-5 pr-2 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0"
                >
                  <span className="text-xs font-semibold">Οδηγίες χάρτη</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:rotate-[-45deg]">
                    <PinIcon className="h-3.5 w-3.5" />
                  </span>
                </a>
              </div>

              {/* Map iframe */}
              <div className="aspect-[16/10] md:aspect-[21/8] bg-slate-100">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                  title="Χάρτης Κέντρου Υγείας Τροπαίων"
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
          </motion.div>
        </div>
      </section>
      )}

    </div>
  );
};

export default Contact;