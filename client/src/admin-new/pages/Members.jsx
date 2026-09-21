import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchApplications, updateApplication, deleteApplication, getSignatureSignedUrl,
} from '../services/adminService';
import { useToast } from '../../components/Toast';

// ─── Icons ─────────────────────────────────────────
const IconSearch = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
const IconX = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M5 13l4 4L19 7" /></svg>);
const IconTrash = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const IconUsers = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 011e1.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
const IconUserCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M9.75 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM3 20.25v-1.5a5.25 5.25 0 015.25-5.25h3a5.25 5.25 0 015.25 5.25v1.5" /></svg>);
const IconClock = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
const IconEye = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" /></svg>);
const IconCalendar = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
const IconPhone = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" /></svg>);
const IconMail = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" /></svg>);
const IconAlert = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>);
const IconPrinter = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5z" /></svg>);

// ─── Helpers ───────────────────────────────────────
const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const isMembershipExpired = (app) => {
  if (!app?.created_at || app.status !== 'accepted') return false;
  const expiryTime = new Date(app.created_at).getTime() + 31536000000; // 1 year
  return Date.now() > expiryTime;
};

// Print the signed application form
const printApplication = async (application) => {
  const signatureUrl = await getSignatureSignedUrl(application?.signature_url);

  const printWindow = window.open('', '_blank', 'width=1000,height=1200');
  if (!printWindow) return;

  const rows = [
    ['Ονοματεπώνυμο', application?.name || '—'],
    ['Όνομα πατρός', application?.father_name || '—'],
    ['Όνομα μητρός', application?.mother_name || '—'],
    ['Ημερομηνία γέννησης', application?.birth_date || '—'],
    ['Αριθμός Δελτίου Ταυτότητας', application?.id_number || '—'],
    ['Διεύθυνση κατοικίας', application?.address || '—'],
    ['Τ.Κ.', application?.postal_code || '—'],
    ['Περιοχή', application?.area || '—'],
    ['Τηλέφωνο', application?.phone || '—'],
    ['Email', application?.email || '—'],
    ['Ιδιότητα μέλους', application?.membership_type || 'Τακτικό Μέλος'],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #cbd5e1; font-weight: 700; width: 42%; background: #f8fafc; color: #0f172a; font-family: 'Times New Roman', serif; text-transform: uppercase; letter-spacing: 0.04em; font-size: 12px;">${label}</td>
      <td style="padding: 10px 12px; border: 1px solid #cbd5e1; color: #1e293b; font-family: 'Times New Roman', serif; font-size: 13px;">${value}</td>
    </tr>
  `).join('');

  const signatureMarkup = signatureUrl
    ? `<img src="${signatureUrl}" alt="Υπογραφή" style="max-width: 260px; max-height: 90px; object-fit: contain; display: block; margin: 0 auto;" />`
    : `<div style="height: 78px; display: flex; align-items: end; justify-content: center; font-size: 28px; color: #0f172a;">__________________</div>`;

  printWindow.document.write(`
    <html>
      <head>
        <title>Αίτηση Εγγραφής Μέλους</title>
        <style>
          body { font-family: 'Times New Roman', Georgia, serif; margin: 28px; color: #101828; background: #ffffff; }
          .official { max-width: 900px; margin: 0 auto; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #101828; padding-bottom: 16px; margin-bottom: 18px; }
          .logo-box { width: 116px; height: 116px; border: 2px solid #cbd5e1; border-radius: 18px; background: linear-gradient(135deg, #f8fbff 0%, #edf6ff 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .logo-box img { width: 88px; height: 88px; object-fit: contain; }
          .club-title { text-align: right; font-weight: 700; line-height: 1.35; font-size: 15px; letter-spacing: 0.06em; }
          .section-title { text-align: center; font-size: 29px; font-weight: 700; letter-spacing: 0.08em; margin: 18px 0 8px; }
          .subline { text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 16px; }
          .statement { font-size: 15px; line-height: 1.8; margin: 18px 0 14px; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; gap: 26px; }
          .signature-box, .date-box { flex: 1; border-top: 2px solid #101828; text-align: center; padding-top: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
          .signature-box label { display: block; margin-bottom: 10px; font-weight: 700; }
          .small-note { margin-top: 12px; font-size: 11px; color: #475467; text-align: center; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="official">
          <div class="header">
            <div class="logo-box"><img src="/logo.png" alt="Club Logo" /></div>
            <div class="club-title">
              <div>ΣΥΛΛΟΓΟΣ</div>
              <div>ΦΙΛΩΝ ΣΤΗΡΙΞΗΣ</div>
              <div>ΚΕΝΤΡΟΥ ΥΓΕΙΑΣ</div>
              <div>ΤΡΟΠΑΙΩΝ</div>
              <div>ΕΛΠΙΔΑ ΖΩΗΣ</div>
            </div>
          </div>
          <div class="section-title">ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ ΜΕΛΟΥΣ</div>
          <div class="subline">ΕΛΠΙΔΑ ΖΩΗΣ</div>
          <div class="statement">Παρακαλώ να με εγγράψετε ως μέλος του συλλόγου, αποδεχόμενος/η το καταστατικό και τους σκοπούς του.</div>
          <table>${tableRows}</table>
          <div class="statement"><strong>Ιδιότητα μέλους:</strong> ${application?.membership_type || 'Τακτικό Μέλος'}<br/>Δηλώνω υπεύθυνα ότι αποδέχομαι το καταστατικό του συλλόγου και τις αποφάσεις των οργάνων του.</div>
          <div class="footer">
            <div class="date-box">Ημερομηνία εγγραφής:<br/>${application?.created_at ? new Date(application.created_at).toLocaleDateString('el-GR') : new Date().toLocaleDateString('el-GR')}</div>
            <div class="signature-box"><label>Υπογραφή</label>${signatureMarkup}</div>
          </div>
          <div class="small-note">Έγγραφο υποβλήθηκε μέσω της ηλεκτρονικής διαδικασίας εγγραφής του συλλόγου.</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => printWindow.print(), 300);
};

// ─── Confirm Modal ────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Επιβεβαίωση', loading, tone = 'brand', icon: Icon = IconUsers }) {
  const isDanger = tone === 'danger';
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
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
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDanger ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'}`}>
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
                  isDanger
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                } disabled:opacity-50`}
              >
                <Icon className="h-3.5 w-3.5" />
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
export default function Members() {
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending'); // 'pending' | 'accepted'

  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null); // { type, app }
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      showToast('Σφάλμα φόρτωσης: ' + (err.message || 'Άγνωστο σφάλμα'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const pendingApplications = applications.filter(
    (app) => app.status === 'pending' || isMembershipExpired(app)
  );
  const acceptedMembers = applications.filter(
    (app) => app.status === 'accepted' && !isMembershipExpired(app)
  );

  const filterBySearch = (list) =>
    list.filter((a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search) ||
      a.id_number?.toLowerCase().includes(search.toLowerCase())
    );

  const visibleList = filterBySearch(tab === 'pending' ? pendingApplications : acceptedMembers);

  const openDetail = (app) => {
    setSelected(app);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setSelected(null);
    setDetailOpen(false);
  };

  // ─── Actions ────────────────────────────────────
  const requestAction = (type, app) => {
    setConfirmAction({ type, app });
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    const { type, app } = confirmAction;
    setConfirmLoading(true);
    try {
      if (type === 'accept') {
        await updateApplication(app.id, { status: 'accepted' });
        showToast('Η αίτηση εγκρίθηκε.', 'success');
      } else if (type === 'reject') {
        await updateApplication(app.id, { status: 'rejected' });
        showToast('Η αίτηση απορρίφθηκε.', 'success');
      } else if (type === 'pending') {
        await updateApplication(app.id, { status: 'pending' });
        showToast('Η αίτηση επέστρεψε σε εκκρεμότητα.', 'success');
      } else if (type === 'delete') {
        await deleteApplication(app.id);
        showToast('Η αίτηση διαγράφηκε.', 'success');
        if (selected && selected.id === app.id) closeDetail();
      }
      setConfirmAction(null);
      await loadData();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

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
      >
        <h1 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-slate-900">
          Μέλη
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Διαχειριστείτε τις αιτήσεις εγγραφής και τα εγκεκριμένα μέλη.
        </p>
      </motion.div>

      {/* TABS */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <button
          onClick={() => setTab('pending')}
          className={`group inline-flex items-center gap-2 rounded-full pl-2 pr-4 py-2 text-xs font-semibold transition-all ${
            tab === 'pending'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
            tab === 'pending' ? 'bg-white/15' : 'bg-amber-100 text-amber-700'
          }`}>
            <IconClock className="h-3.5 w-3.5" />
          </span>
          Εκκρεμείς
          {pendingApplications.length > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
            }`}>
              {pendingApplications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab('accepted')}
          className={`group inline-flex items-center gap-2 rounded-full pl-2 pr-4 py-2 text-xs font-semibold transition-all ${
            tab === 'accepted'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${
            tab === 'accepted' ? 'bg-white/15' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <IconUserCheck className="h-3.5 w-3.5" />
          </span>
          Εγκεκριμένα
          {acceptedMembers.length > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              tab === 'accepted' ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {acceptedMembers.length}
            </span>
          )}
        </button>
      </motion.div>

      {/* SEARCH */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative max-w-md"
      >
        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Αναζήτηση με όνομα, email, τηλέφωνο..."
          className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
        />
      </motion.div>

      {/* LIST */}
      {visibleList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/60 p-10 text-center"
             style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <IconUsers className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">
            {search
              ? 'Δεν βρέθηκαν αποτελέσματα.'
              : tab === 'pending'
                ? 'Δεν υπάρχουν εκκρεμείς αιτήσεις.'
                : 'Δεν υπάρχουν εγκεκριμένα μέλη.'}
          </p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {visibleList.map((app) => {
            const expired = isMembershipExpired(app);
            const isPending = app.status === 'pending' || expired;
            return (
              <motion.div
                key={app.id}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                className={`rounded-2xl border p-3 md:p-4 transition-all hover:shadow-md ${
                  isPending ? 'border-amber-200/70' : 'border-emerald-200/70'
                }`}
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  {/* Avatar */}
                  <div className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-display text-base font-bold ${
                    isPending
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {(app.name || '?').charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 truncate">{app.name}</p>
                      {expired ? (
                        <span className="bg-orange-100 text-orange-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Λήξη Συνδρομής
                        </span>
                      ) : isPending ? (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Εκκρεμής
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Εγκεκριμένο
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 truncate"><IconMail className="h-3 w-3" />{app.email}</span>
                      <span className="flex items-center gap-1"><IconPhone className="h-3 w-3" />{app.phone}</span>
                      <span className="flex items-center gap-1"><IconCalendar className="h-3 w-3" />{fmt(app.created_at)}</span>
                    </div>

                    {app.membership_type && (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5">
                        {app.membership_type}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <button
                      onClick={() => openDetail(app)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all"
                    >
                      <IconEye className="h-3.5 w-3.5" />
                      Προβολή
                    </button>

                    {isPending && (
                      <button
                        onClick={() => requestAction('accept', app)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-all"
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                        Αποδοχή
                      </button>
                    )}

                    {!isPending && (
                      <button
                        onClick={() => requestAction('pending', app)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
                      >
                        <IconClock className="h-3.5 w-3.5" />
                        Σε αναμονή
                      </button>
                    )}

                    <button
                      onClick={() => requestAction('delete', app)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                      aria-label="Διαγραφή"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─── DETAIL MODAL ─────────────────────── */}
      <AnimatePresence>
        {detailOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeDetail}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-4 md:my-8 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-5 md:px-6 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white font-display text-lg font-bold">
                    {(selected.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">Αίτηση Μέλους</p>
                    <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900 leading-tight truncate">
                      {selected.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Υποβολή: {fmt(selected.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDetail}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all shrink-0"
                  aria-label="Κλείσιμο"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 md:p-6 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    ['Ονοματεπώνυμο', selected.name],
                    ['Email', selected.email],
                    ['Όνομα πατρός', selected.father_name],
                    ['Όνομα μητρός', selected.mother_name],
                    ['Ημ/νία γέννησης', selected.birth_date],
                    ['Αρ. Ταυτότητας', selected.id_number],
                    ['Τηλέφωνο', selected.phone],
                    ['Ιδιότητα', selected.membership_type],
                    ['Διεύθυνση', selected.address, true],
                    ['Τ.Κ.', selected.postal_code],
                    ['Περιοχή', selected.area],
                    ['Σχέδιο κατάθεσης', selected.payment_reference],
                    ['Σημείωση admin', selected.admin_note, true],
                  ].map(([label, value, span], i) => (
                    value ? (
                      <div key={i} className={`rounded-2xl bg-slate-50 border border-slate-200/70 p-3 ${span ? 'md:col-span-2' : ''}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="text-sm text-slate-800 mt-0.5 break-words">{value}</p>
                      </div>
                    ) : null
                  ))}
                </div>

                {/* Signature preview */}
                {selected.signature_url && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Υπογραφή</p>
                    <SignaturePreview path={selected.signature_url} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-5 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => printApplication(selected)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3.5 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <IconPrinter className="h-3.5 w-3.5" />
                    Εκτύπωση
                  </button>
                  <button
                    type="button"
                    onClick={() => { setConfirmAction({ type: 'delete', app: selected }); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-red-200 px-3.5 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                    Διαγραφή
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selected.status === 'accepted' && !isMembershipExpired(selected) ? (
                    <button
                      type="button"
                      onClick={() => { setConfirmAction({ type: 'pending', app: selected }); }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-all"
                    >
                      <IconClock className="h-3.5 w-3.5" />
                      Σε αναμονή
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setConfirmAction({ type: 'reject', app: selected }); }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                      >
                        <IconX className="h-3.5 w-3.5" />
                        Απόρριψη
                      </button>
                      <button
                        type="button"
                        onClick={() => { setConfirmAction({ type: 'accept', app: selected }); }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-all"
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                        Αποδοχή
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── CONFIRM ACTION MODAL ─────────────── */}
      <ConfirmModal
        open={Boolean(confirmAction)}
        onClose={() => !confirmLoading && setConfirmAction(null)}
        onConfirm={executeAction}
        title={
          confirmAction?.type === 'accept' ? 'Αποδοχή Αίτησης'
          : confirmAction?.type === 'reject' ? 'Απόρριψη Αίτησης'
          : confirmAction?.type === 'pending' ? 'Επαναφορά σε Εκκρεμότητα'
          : 'Διαγραφή Αίτησης'
        }
        message={
          confirmAction?.type === 'accept' ? `Να εγκριθεί η αίτηση του/της «${confirmAction?.app?.name}»; Θα προστεθεί στα εγκεκριμένα μέλη.`
          : confirmAction?.type === 'reject' ? `Να απορριφθεί η αίτηση του/της «${confirmAction?.app?.name}»; Η ενέργεια μπορεί να αναιρεθεί.`
          : confirmAction?.type === 'pending' ? `Να επιστρέψει η αίτηση του/της «${confirmAction?.app?.name}» σε εκκρεμότητα;`
          : `Να διαγραφεί οριστικά η αίτηση του/της «${confirmAction?.app?.name}»; Η ενέργεια δεν μπορεί να αναιρεθεί.`
        }
        confirmLabel={
          confirmAction?.type === 'accept' ? 'Αποδοχή'
          : confirmAction?.type === 'reject' ? 'Απόρριψη'
          : confirmAction?.type === 'pending' ? 'Επαναφορά'
          : 'Διαγραφή'
        }
        loading={confirmLoading}
        tone={confirmAction?.type === 'delete' || confirmAction?.type === 'reject' ? 'danger' : 'brand'}
        icon={confirmAction?.type === 'accept' ? IconUserCheck : confirmAction?.type === 'delete' ? IconTrash : confirmAction?.type === 'pending' ? IconClock : IconAlert}
      />
    </div>
  );
}

// ─── Signature Preview Sub-component ──────────────
function SignaturePreview({ path }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const signed = await getSignatureSignedUrl(path);
      if (!cancelled) {
        setUrl(signed);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [path]);

  if (loading) {
    return <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />;
  }
  if (!url) {
    return <p className="text-xs text-slate-500 italic">Δεν ήταν δυνατή η φόρτωση της υπογραφής.</p>;
  }
  return (
    <img
      src={url}
      alt="Υπογραφή"
      className="max-w-full h-auto max-h-24 object-contain mx-auto bg-white rounded-lg p-2"
    />
  );
}