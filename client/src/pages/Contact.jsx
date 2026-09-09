import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';

// ─── Icons ──────────────────────────────────────────────────────────
const IconEnvelope = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconPhone = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconMapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconFacebook = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M13.5 8.5c0-.8.6-1.5 1.4-1.5h2.1V3.5h-2.1C12.4 3.5 10.8 5.1 10.8 7.2V9h-1.8v2.5H10.8V20h2.8v-8.5h2.1L15.9 9h-2.4V8.5Z" />
  </svg>
);

const IconInstagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.3 1 .6 1.4 1 .4.4.7.8 1 1.4.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.3.6-.6 1-1 1.4-.4.4-.8.7-1.4 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.3-1-.6-1.4-1-.4-.4-.7-.8-1-1.4-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.3-.6.6-1 1-1.4.4-.4.8-.7 1.4-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.8A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────
const Contact = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.', 'error');
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ name, email, subject, message, is_read: false }]);
      if (error) throw error;
      showToast('Το μήνυμά σας στάλθηκε με επιτυχία!', 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      showToast('Αποτυχία αποστολής μηνύματος. Προσπαθήστε ξανά.', 'error');
    } finally {
      setSending(false);
    }
  };

  if (settingsLoading) return <Loading full message="Φόρτωση..." />;

  const showMap = settings?.show_map_contact !== 'false';

  return (
    <div className="container-padded py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Επικοινωνία</h1>
          <p className="text-sm text-slate-500 mt-1">Στείλτε μας μήνυμα ή βρείτε μας.</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ─── Form ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2">Στείλτε μήνυμα</h2>
          <p className="text-sm text-slate-500 mb-6">Θα απαντήσουμε το συντομότερο δυνατό.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Όνομα *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Θέμα</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Μήνυμα *</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="input resize-y min-h-[120px]"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full justify-center"
            >
              {sending ? 'Αποστολή...' : 'Αποστολή μηνύματος'}
            </button>
          </form>
        </motion.div>

        {/* ─── Contact Info ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Στοιχεία επικοινωνίας</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <IconPhone className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Τηλέφωνο</p>
                  <p className="text-sm text-slate-600">{settings?.support_phone || '+30 22310 12345'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconEnvelope className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p className="text-sm text-slate-600">{settings?.contact_email || 'info@tropaiwn-hc.gr'}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <IconMapPin className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Διεύθυνση</p>
                  <p className="text-sm text-slate-600">{settings?.address || 'Κέντρο Υγείας Τροπαίων'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          {(settings?.facebook_url || settings?.instagram_url) && (
            <div className="card p-6 md:p-8">
              <h3 className="font-semibold text-slate-900 mb-3">Social</h3>
              <div className="flex gap-3">
                {settings?.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors"
                  >
                    <IconFacebook className="h-4 w-4" />
                    Facebook
                  </a>
                )}
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition-colors"
                  >
                    <IconInstagram className="h-4 w-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Map */}
          {showMap && settings?.map_link && (
            <div className="card p-2 overflow-hidden">
              <iframe
                src={settings.map_link}
                title="Google Maps"
                loading="lazy"
                className="w-full h-64 rounded-lg"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;