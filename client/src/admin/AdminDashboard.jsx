import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';

// ─── Icons ──────────────────────────────────────────────────────────
const IconOverview = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const IconAnnouncement = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconCategory = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const IconDocument = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconGallery = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const IconMessages = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconSettings = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconX = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconImage = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
  </svg>
);

const IconEye = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── Confirm Modal ──────────────────────────────────────────────
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Ναι', cancelLabel = 'Άκυρο', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-secondary text-sm px-4 py-2"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-primary text-sm px-4 py-2 bg-red-600 hover:bg-red-700"
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Detail Modal ──────────────────────────────────────
function MessageDetailModal({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{message.subject || 'Χωρίς θέμα'}</h3>
            <p className="text-sm text-slate-500">
              από {message.name} ({message.email})
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <IconX className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          {new Date(message.created_at).toLocaleString('el-GR')}
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailModal({ application, onClose, onOpenFile, onPay, onReject }) {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
        <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{application.name}</h3>
            <p className="text-sm text-slate-500">Αίτηση εγγραφής μέλους</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <IconX className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Email:</span> {application.email || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Τηλέφωνο:</span> {application.phone || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Όνομα πατρός:</span> {application.father_name || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Όνομα μητρός:</span> {application.mother_name || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Γέννηση:</span> {application.birth_date || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Δελτίο ταυτότητας:</span> {application.id_number || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3 md:col-span-2"><span className="font-semibold">Διεύθυνση:</span> {application.address || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Τ.Κ.:</span> {application.postal_code || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Περιοχή:</span> {application.area || '—'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Ιδιότητα:</span> {application.membership_type || 'Μέλος'}</div>
          <div className="rounded-xl bg-slate-50 p-3"><span className="font-semibold">Κατάθεση:</span> {application.payment_reference || '—'}</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={() => onOpenFile(application)} className="btn-primary text-sm">Προβολή Αρχείου</button>
          <button type="button" onClick={() => onPay(application)} className="btn-secondary text-sm">Πληρώθηκε</button>
          <button type="button" onClick={() => onReject(application)} className="btn-secondary text-sm text-red-600">Απόρριψη</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Component ─────────────────────────────────────────
function Sidebar({ active, setActive, unreadCount, memberCount, mobile = false, onSelect }) {
  const items = [
    { label: 'Επισκόπηση', icon: IconOverview },
    { label: 'Ανακοινώσεις', icon: IconAnnouncement },
    { label: 'Κατηγορίες', icon: IconCategory },
    { label: 'Έγγραφα', icon: IconDocument },
    { label: 'Γκαλερί', icon: IconGallery },
    { label: 'Μηνύματα', icon: IconMessages, badge: unreadCount },
    { label: 'Διοίκηση & Μέλη', icon: IconImage },
    { label: 'Μέλη', icon: IconDocument, badge: memberCount },
    { label: 'Ρυθμίσεις', icon: IconSettings },
  ];

  return (
    <aside className={`${mobile ? 'w-full' : 'w-full lg:w-56 shrink-0'}`}>
      <nav className={`${mobile ? 'bg-white rounded-r-2xl border-r border-slate-200/80 p-2 shadow-xl h-full' : 'bg-white rounded-xl border border-slate-200/80 p-2 shadow-soft'}`}>
        {items.map(({ label, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => {
              setActive(label);
              if (onSelect) onSelect();
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2.5 ${
              active === label
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ─── Helper Functions ──────────────────────────────────────────
function createEmptyAnnouncement() {
  return {
    title: '',
    summary: '',
    description: '',
    category: '',
    pinned: false,
    publish_date: new Date().toISOString().slice(0, 10),
    event_date: '',
    expiry_date: '',
    deletion_mode: 'auto',
    is_permanent: false,
    images: [],
  };
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Main Component ──────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState('Επισκόπηση');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const { refreshSettings } = useSettings();
  const { showToast } = useToast();

  // Confirm modal state
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Ναι',
    onConfirm: null,
    loading: false,
  });

  // Message detail modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationReadOnly, setApplicationReadOnly] = useState(false);

  // Data states
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [settings, setSettings] = useState({});

  // Form states
  const [announceForm, setAnnounceForm] = useState(createEmptyAnnouncement());
  const [editingAnnounce, setEditingAnnounce] = useState(null);
  const [step, setStep] = useState(0);
  const [catForm, setCatForm] = useState({ name: '', emoji: '✨', accent: 'bg-brand-100 text-brand-700' });
  const [docForm, setDocForm] = useState({ title: '', file_path: '' });
  const [docUploadMethod, setDocUploadMethod] = useState('url');
  const [docFile, setDocFile] = useState(null);
  const [galleryForm, setGalleryForm] = useState({ title: '', description: '', image_url: '' });
  const [galleryImage, setGalleryImage] = useState('');
  const [memberForm, setMemberForm] = useState({ name: '', role: 'Πρόεδρος', phone: '' });
  const [editingMember, setEditingMember] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // ─── Auth check ──────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin/login'); return; }
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      if (error || !profile?.is_admin) {
        showToast('Δεν είστε διαχειριστής.', 'error');
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }
      setAdmin({ id: profile.user_id, name: profile.name, email: profile.email });
      await fetchAll();
    };
    checkAuth();
  }, []);

  // ─── Fetch all data ──────────────────────────────────────────
  async function fetchAll() {
    try {
      setLoading(true);
      const [ann, cat, doc, gal, msg, mem, apps, set] = await Promise.all([
        supabase.from('announcements').select('*').order('publish_date', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('documents').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('club_members').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('membership_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('key, value'),
      ]);      if (ann.error) throw ann.error;
      if (cat.error) throw cat.error;
      if (doc.error) throw doc.error;
      if (gal.error) throw gal.error;
      if (msg.error) throw msg.error;
      if (mem.error) throw mem.error;
      if (set.error) throw set.error;
      setAnnouncements(ann.data || []);
      setCategories(cat.data || []);
      setDocuments(doc.data || []);
      setGallery(gal.data || []);
      setMessages(msg.data || []);
      setMembers(mem.data || []);
      setApplications(apps.data || []);
      if (set.data) {
        const obj = Object.fromEntries(set.data.map(row => [row.key, row.value]));
        setSettings(obj);
      }
    } catch (err) {
      showToast('Σφάλμα φόρτωσης δεδομένων: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  // ─── Status message helper ──────────────────────────────────
  function showStatus(msg, type = 'success') {
    showToast(msg, type);
  }

  // ─── Logout ──────────────────────────────────────────────────
  async function logout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  // ─── Confirm modal helper ──────────────────────────────────
  function confirmAction(title, message, onConfirm, confirmLabel = 'Ναι') {
    setConfirm({
      isOpen: true,
      title,
      message,
      confirmLabel,
      onConfirm: async () => {
        setConfirm(prev => ({ ...prev, loading: true }));
        await onConfirm();
        setConfirm(prev => ({ ...prev, isOpen: false, loading: false }));
      },
      loading: false,
    });
  }

  // ─── Announcement: Upload images ──────────────────────────
  async function uploadImages(files) {
    const urls = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `announcements/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (error) { showToast('Σφάλμα upload εικόνας: ' + error.message, 'error'); continue; }
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      urls.push(urlData.publicUrl);
    }
    return urls;
  }

  async function handleAnnounceImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await uploadImages(files);
    setAnnounceForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
  }

  function removeAnnounceImage(index) {
    setAnnounceForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  // ─── Announcement: Save ──────────────────────────────────────
  async function saveAnnouncement(e) {
    e.preventDefault();
    const errors = {};
    if (!announceForm.title.trim()) errors.title = 'Ο τίτλος απαιτείται.';
    if (!announceForm.description.trim()) errors.description = 'Το κείμενο απαιτείται.';
    if (Object.keys(errors).length) {
      setAnnounceErrors(errors);
      if (errors.title) setStep(0);
      if (errors.description) setStep(1);
      return;
    }
    const payload = {
      title: announceForm.title.trim(),
      summary: announceForm.summary || '',
      description: announceForm.description.trim(),
      category: announceForm.category || categories[0]?.name || 'Γενικό',
      pinned: Boolean(announceForm.pinned),
      publish_date: announceForm.publish_date || new Date().toISOString().slice(0, 10),
      event_date: announceForm.event_date || null,
      expiry_date: announceForm.deletion_mode === 'auto' ? (announceForm.expiry_date || null) : null,
      deletion_mode: announceForm.deletion_mode || 'auto',
      is_permanent: Boolean(announceForm.is_permanent),
      images: announceForm.images || [],
    };

    try {
      let result;
      if (editingAnnounce) {
        result = await supabase.from('announcements').update(payload).eq('id', editingAnnounce.id).select().single();
      } else {
        result = await supabase.from('announcements').insert([payload]).select().single();
      }
      if (result.error) throw result.error;
      showStatus(editingAnnounce ? 'Ανακοίνωση ενημερώθηκε.' : 'Ανακοίνωση δημιουργήθηκε.', 'success');
      setAnnounceForm(createEmptyAnnouncement());
      setEditingAnnounce(null);
      setStep(0);
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα αποθήκευσης: ' + err.message, 'error');
    }
  }

  function editAnnouncement(item) {
    setEditingAnnounce(item);
    setAnnounceForm({
      title: item.title || '',
      summary: item.summary || '',
      description: item.description || '',
      category: item.category || '',
      pinned: Boolean(item.pinned),
      publish_date: item.publish_date || new Date().toISOString().slice(0, 10),
      event_date: item.event_date || '',
      expiry_date: item.expiry_date || '',
      deletion_mode: item.deletion_mode || 'auto',
      is_permanent: Boolean(item.is_permanent),
      images: item.images || [],
    });
    setStep(0);
    setActive('Ανακοινώσεις');
  }

  async function deleteAnnouncement(id) {
    confirmAction(
      'Διαγραφή Ανακοίνωσης',
      'Θέλετε να διαγράψετε αυτή την ανακοίνωση;',
      async () => {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
        showStatus('Ανακοίνωση διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  // ─── Categories ──────────────────────────────────────────────
  async function saveCategory(e) {
    e.preventDefault();
    if (!catForm.name.trim()) { showToast('Το όνομα κατηγορίας απαιτείται.', 'error'); return; }
    try {
      const { error } = await supabase.from('categories').insert([catForm]);
      if (error) throw error;
      showStatus('Κατηγορία προστέθηκε.', 'success');
      setCatForm({ name: '', emoji: '✨', accent: 'bg-brand-100 text-brand-700' });
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  async function deleteCategory(id) {
    confirmAction(
      'Διαγραφή Κατηγορίας',
      'Θέλετε να διαγράψετε αυτή την κατηγορία;',
      async () => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        showStatus('Κατηγορία διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  // ─── Documents ──────────────────────────────────────────────
  async function uploadDocumentFile(file) {
    const ext = file.name.split('.').pop();
    const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { throw error; }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    return urlData.publicUrl;
  }

  async function saveDocument(e) {
    e.preventDefault();
    if (!docForm.title.trim()) {
      showToast('Ο τίτλος απαιτείται.', 'error');
      return;
    }
    let filePath = docForm.file_path.trim();
    if (docUploadMethod === 'upload' && docFile) {
      try {
        filePath = await uploadDocumentFile(docFile);
      } catch (err) {
        showToast('Σφάλμα upload: ' + err.message, 'error');
        return;
      }
    }
    if (!filePath) {
      showToast('Παρακαλώ δώστε URL ή επιλέξτε αρχείο.', 'error');
      return;
    }
    try {
      const { error } = await supabase.from('documents').insert([{ title: docForm.title, file_path: filePath }]);
      if (error) throw error;
      showStatus('Έγγραφο προστέθηκε.', 'success');
      setDocForm({ title: '', file_path: '' });
      setDocFile(null);
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  async function deleteDocument(id) {
    confirmAction(
      'Διαγραφή Εγγράφου',
      'Θέλετε να διαγράψετε αυτό το έγγραφο;',
      async () => {
        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (error) throw error;
        showStatus('Έγγραφο διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  // ─── Gallery ──────────────────────────────────────────────────
  async function handleGalleryImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { showToast('Σφάλμα upload: ' + error.message, 'error'); return; }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    setGalleryImage(urlData.publicUrl);
  }

  async function saveGalleryItem(e) {
    e.preventDefault();
    const imageUrl = galleryForm.image_url || galleryImage;
    if (!galleryForm.title.trim() || !imageUrl) {
      showToast('Τίτλος και εικόνα απαιτούνται.', 'error');
      return;
    }
    try {
      const { error } = await supabase.from('gallery').insert([{ title: galleryForm.title, description: galleryForm.description, image_url: imageUrl }]);
      if (error) throw error;
      showStatus('Φωτογραφία προστέθηκε.', 'success');
      setGalleryForm({ title: '', description: '', image_url: '' });
      setGalleryImage('');
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  async function deleteGalleryItem(id) {
    confirmAction(
      'Διαγραφή Φωτογραφίας',
      'Θέλετε να διαγράψετε αυτή τη φωτογραφία;',
      async () => {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
        showStatus('Φωτογραφία διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  function normalizeBoolean(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  // ─── Messages ──────────────────────────────────────────────────
  async function deleteMessage(id) {
    confirmAction(
      'Διαγραφή Μηνύματος',
      'Θέλετε να διαγράψετε αυτό το μήνυμα;',
      async () => {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) throw error;
        showStatus('Μήνυμα διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  async function toggleMessageRead(id, read) {
    try {
      const { error } = await supabase.from('messages').update({ is_read: Boolean(read) }).eq('id', id);
      if (error) throw error;
      showStatus(read ? 'Σημειώθηκε ως αναγνωσμένο.' : 'Σημειώθηκε ως μη αναγνωσμένο.', 'success');
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  // ─── Club leadership ───────────────────────────────────────────
  async function saveMember(e) {
    e.preventDefault();
    const cleanName = memberForm.name.trim();
    const cleanPhone = memberForm.phone.replace(/\D/g, '').slice(0, 10);
    const roleOrder = ['Πρόεδρος', 'Αντιπρόεδρος', 'Γραμματέας', 'Ταμίας', 'Μέλος', 'Τακτικό Μέλος'];

    if (!cleanName || !cleanPhone) {
      showToast('Όνομα και έγκυρο τηλέφωνο απαιτούνται.', 'error');
      return;
    }
    if (cleanPhone.length !== 10) {
      showToast('Το τηλέφωνο πρέπει να έχει ακριβώς 10 αριθμούς.', 'error');
      return;
    }

    try {
      const payload = {
        name: cleanName,
        role: memberForm.role || 'Μέλος',
        phone: cleanPhone,
        sort_order: roleOrder.indexOf(memberForm.role) >= 0 ? roleOrder.indexOf(memberForm.role) : 99,
      };

      if (editingMember) {
        const { error } = await supabase.from('club_members').update(payload).eq('id', editingMember.id);
        if (error) throw error;
        showStatus('Το μέλος ενημερώθηκε.', 'success');
      } else {
        const { error } = await supabase.from('club_members').insert([payload]);
        if (error) throw error;
        showStatus('Το μέλος προστέθηκε.', 'success');
      }

      setMemberForm({ name: '', role: 'Πρόεδρος', phone: '' });
      setEditingMember(null);
      await fetchAll();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  async function deleteMember(id) {
    confirmAction(
      'Διαγραφή Μέλους',
      'Θέλετε να διαγράψετε αυτό το μέλος της διοίκησης;',
      async () => {
        const { error } = await supabase.from('club_members').delete().eq('id', id);
        if (error) throw error;
        showStatus('Το μέλος διαγράφηκε.', 'success');
        await fetchAll();
      }
    );
  }

  function editMember(member) {
    setEditingMember(member);
    setMemberForm({
      name: member.name || '',
      role: member.role || 'Πρόεδρος',
      phone: member.phone || '',
    });
    setActive('Διοίκηση & Μέλη');
  }

  const emptyApplicationForm = {
    name: '',
    father_name: '',
    mother_name: '',
    birth_date: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    area: '',
    id_number: '',
    membership_type: 'Τακτικό Μέλος',
    payment_reference: '',
    admin_note: '',
    status: 'pending',
  };

  const [applicationForm, setApplicationForm] = useState(emptyApplicationForm);

  function openApplicationDetail(application, readOnly = false) {
    setSelectedApplication(application);
    setApplicationReadOnly(readOnly);
    setApplicationForm({
      name: application?.name || '',
      father_name: application?.father_name || '',
      mother_name: application?.mother_name || '',
      birth_date: application?.birth_date || '',
      email: application?.email || '',
      phone: application?.phone || '',
      address: application?.address || '',
      postal_code: application?.postal_code || '',
      area: application?.area || '',
      id_number: application?.id_number || '',
      membership_type: application?.membership_type || 'Τακτικό Μέλος',
      payment_reference: application?.payment_reference || '',
      admin_note: application?.admin_note || '',
      status: application?.status || 'pending',
    });
  }

  function handleApplicationFieldChange(field, value) {
    const next = { ...applicationForm, [field]: value };
    if (field === 'name') next.name = value.toUpperCase();
    if (field === 'phone') next.phone = value.replace(/\D/g, '').slice(0, 10);
    setApplicationForm(next);
  }

  function openApplicationFile(application) {
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

    const signatureMarkup = application?.signature_url
      ? `<img src="${application.signature_url}" alt="Υπογραφή" style="max-width: 260px; max-height: 90px; object-fit: contain; display: block; margin: 0 auto; filter: contrast(1.05);" />`
      : `<div style="height: 78px; display: flex; align-items: end; justify-content: center; font-size: 28px; color: #0f172a;">__________________</div>`;

    printWindow.document.write(`
      <html>
        <head>
          <title>Αίτηση Εγγραφής Μέλους</title>
          <style>
            :root { --ink: #101828; --muted: #475467; --line: #cbd5e1; --panel: #f8fafc; }
            body { font-family: 'Times New Roman', Georgia, serif; margin: 28px; color: var(--ink); background: #ffffff; }
            .official { max-width: 900px; margin: 0 auto; }
            .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid var(--ink); padding-bottom: 16px; margin-bottom: 18px; }
            .logo-box { width: 116px; height: 116px; border: 2px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, #f8fbff 0%, #edf6ff 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.06); }
            .logo-box img { width: 88px; height: 88px; object-fit: contain; }
            .club-title { text-align: right; font-weight: 700; line-height: 1.35; font-size: 15px; letter-spacing: 0.06em; }
            .section-title { text-align: center; font-size: 29px; font-weight: 700; letter-spacing: 0.08em; margin: 18px 0 8px; }
            .subline { text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 16px; }
            .statement { font-size: 15px; line-height: 1.8; margin: 18px 0 14px; color: #111827; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; gap: 26px; }
            .signature-box, .date-box { flex: 1; border-top: 2px solid var(--ink); text-align: center; padding-top: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            .signature-box label { display: block; margin-bottom: 10px; font-weight: 700; }
            .small-note { margin-top: 12px; font-size: 11px; color: var(--muted); text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="official">
            <div class="header">
              <div class="logo-box">
                <img src="/logo.png" alt="Club Logo" />
              </div>
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

            <div class="statement">
              <strong>Ιδιότητα μέλους:</strong> ${application?.membership_type || 'Τακτικό Μέλος'}<br />
              Δηλώνω υπεύθυνα ότι αποδέχομαι το καταστατικό του συλλόγου και τις αποφάσεις των οργάνων του.
            </div>

            <div class="footer">
              <div class="date-box">Ημερομηνία εγγραφής:<br />${application?.created_at ? new Date(application.created_at).toLocaleDateString('el-GR') : new Date().toLocaleDateString('el-GR')}</div>
              <div class="signature-box">
                <label>Υπογραφή</label>
                ${signatureMarkup}
              </div>
            </div>
            <div class="small-note">Έγγραφο υποβλήθηκε μέσω της ηλεκτρονικής διαδικασίας εγγραφής του συλλόγου.</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  }

  async function saveApplicationChanges(e) {
    e.preventDefault();
    if (!selectedApplication) return;

    const cleanPhone = applicationForm.phone.replace(/\D/g, '').slice(0, 10);
    if (!applicationForm.name.trim() || !applicationForm.email.trim() || !cleanPhone) {
      showToast('Συμπληρώστε όνομα, email και έγκυρο τηλέφωνο.', 'error');
      return;
    }
    if (cleanPhone.length !== 10) {
      showToast('Το τηλέφωνο πρέπει να έχει 10 αριθμούς.', 'error');
      return;
    }

    try {
      const payload = {
        name: applicationForm.name.trim(),
        father_name: applicationForm.father_name.trim(),
        mother_name: applicationForm.mother_name.trim(),
        birth_date: applicationForm.birth_date,
        email: applicationForm.email.trim(),
        phone: cleanPhone,
        address: applicationForm.address.trim(),
        postal_code: applicationForm.postal_code.trim(),
        area: applicationForm.area.trim(),
        id_number: applicationForm.id_number.trim(),
        membership_type: applicationForm.membership_type || 'Τακτικό Μέλος',
        payment_reference: applicationForm.payment_reference.trim(),
        admin_note: applicationForm.admin_note.trim(),
        status: applicationForm.status || 'pending',
      };

      const { error } = await supabase.from('membership_applications').update(payload).eq('id', selectedApplication.id);
      if (error) throw error;
      await fetchAll();
      setSelectedApplication(prev => prev ? { ...prev, ...payload } : prev);
      showStatus('Η αίτηση ενημερώθηκε.', 'success');
    } catch (err) {
      showToast('Σφάλμα αποθήκευσης αίτησης: ' + err.message, 'error');
    }
  }

  // ─── Settings ──────────────────────────────────────────────────
  async function savePresidentMessage(e) {
    e.preventDefault();
    const keys = ['president_name', 'president_title', 'president_image_url', 'president_message'];
    try {
      for (const key of keys) {
        const value = settings[key] ?? '';
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: String(value) }, { onConflict: 'key' });
        if (error) throw error;
      }
      showStatus('Το μήνυμα προέδρου αποθηκεύτηκε.', 'success');
      refreshSettings();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  async function saveSettings(e) {
    e.preventDefault();
    const entries = Object.entries(settings).filter(([key]) => !['president_name', 'president_title', 'president_image_url', 'president_message'].includes(key));
    try {
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: String(value) }, { onConflict: 'key' });
        if (error) throw error;
      }
      showStatus('Ρυθμίσεις αποθηκεύτηκαν.', 'success');
      refreshSettings();
    } catch (err) {
      showToast('Σφάλμα: ' + err.message, 'error');
    }
  }

  // ─── Change Password ──────────────────────────────────────────
  async function changePassword(e) {
    e.preventDefault();
    setPasswordError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Συμπληρώστε όλα τα πεδία.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }
    setChangingPassword(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setPasswordError('Δεν βρέθηκε χρήστης.');
        setChangingPassword(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: oldPassword,
      });
      if (signInError) {
        setPasswordError('Ο τρέχων κωδικός είναι λανθασμένος.');
        setChangingPassword(false);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      showStatus('Ο κωδικός άλλαξε επιτυχώς.', 'success');
      setPasswordModalOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError('Αποτυχία αλλαγής κωδικού.');
    } finally {
      setChangingPassword(false);
    }
  }

  // ─── Computed stats ────────────────────────────────────────────
  const total = announcements.length;
  const pinned = announcements.filter(a => a.pinned).length;
  const recent = announcements.slice(0, 5);
  const unreadMessages = messages.filter(m => !normalizeBoolean(m.is_read)).length;
  const totalMessages = messages.length;
  const totalGallery = gallery.length;
  const totalDocs = documents.length;
  const boardRoles = ['Πρόεδρος', 'Αντιπρόεδρος', 'Γραμματέας', 'Ταμίας', 'Μέλος'];
  const boardMembers = members.filter(member => boardRoles.includes(member.role || ''));
  const regularMembers = [];
  const isMembershipExpired = (application) => {
    if (!application?.created_at || application.status !== 'accepted') return false;
    const expiryTime = new Date(application.created_at).getTime() + 31536000000;
    return Date.now() > expiryTime;
  };
  const acceptedMembers = (applications || []).filter(app => app.status === 'accepted' && !isMembershipExpired(app));
  const pendingApplications = (applications || []).filter(app => app.status === 'pending' || isMembershipExpired(app));
  const newPendingMembersCount = pendingApplications.length;

  // ─── Rendering ──────────────────────────────────────────────────
  if (loading) return <Loading full message="Φόρτωση πίνακα διαχείρισης..." />;

  return (
    <div className="container-padded py-6 md:py-10">
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        loading={confirm.loading}
      />

      {/* Message Detail Modal */}
      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Πίνακας Διαχείρισης</h1>
            {admin && <p className="text-sm text-slate-500">Συνδεδεμένος ως {admin.name}</p>}
          </div>
        </div>
        <button onClick={logout} className="btn-secondary text-sm px-4 py-2">Αποσύνδεση</button>
      </div>

      {statusMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {statusMsg}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block">
          <Sidebar active={active} setActive={setActive} unreadCount={unreadMessages} memberCount={newPendingMembersCount} />
        </div>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
            <div className="absolute inset-y-0 right-0 w-[82%] max-w-sm bg-white shadow-2xl p-3 transform transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <h2 className="font-bold text-slate-800">Μενού</h2>
                <button type="button" onClick={() => setMobileSidebarOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar active={active} setActive={setActive} unreadCount={unreadMessages} memberCount={newPendingMembersCount} mobile onSelect={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          {/* ─── Overview ──────────────────────────────────────── */}
          {active === 'Επισκόπηση' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-brand-600">{total}</p>
                  <p className="text-xs text-slate-500">Ανακοινώσεις</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-cyan-600">{categories.length}</p>
                  <p className="text-xs text-slate-500">Κατηγορίες</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{totalDocs}</p>
                  <p className="text-xs text-slate-500">Έγγραφα</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{totalGallery}</p>
                  <p className="text-xs text-slate-500">Φωτογραφίες</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                    <IconMessages className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Μηνύματα</p>
                    <p className="text-xs text-slate-500">{totalMessages} συνολικά, {unreadMessages} μη αναγνωσμένα</p>
                  </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <IconEye className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Κορυφαίες</p>
                    <p className="text-xs text-slate-500">{pinned} από {total} ανακοινώσεις</p>
                  </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <IconGallery className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Πρόσφατη δραστηριότητα</p>
                    <p className="text-xs text-slate-500">{recent.length} νέες ανακοινώσεις</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3">Πρόσφατες ανακοινώσεις</h3>
                {recent.length === 0 ? (
                  <p className="text-sm text-slate-500">Δεν υπάρχουν ανακοινώσεις.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {recent.map(a => (
                      <li key={a.id} className="py-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{a.title}</p>
                          <p className="text-xs text-slate-400">{formatDate(a.publish_date)}</p>
                        </div>
                        {a.pinned && <span className="badge badge-amber text-xs">Κορυφαία</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ─── Announcements ────────────────────────────────── */}
          {active === 'Ανακοινώσεις' && (
            <div>
              <div className="card p-6 mb-6">
                <h3 className="font-bold mb-4">{editingAnnounce ? 'Επεξεργασία Ανακοίνωσης' : 'Νέα Ανακοίνωση'}</h3>
                <div className="flex gap-2 mb-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-brand-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <form onSubmit={saveAnnouncement}>
                  {step === 0 && (
                    <div>
                      <label className="text-sm font-medium">Τίτλος *</label>
                      <input className="input mt-1" value={announceForm.title} onChange={e => setAnnounceForm({...announceForm, title: e.target.value})} required />
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <label className="text-sm font-medium">Περιγραφή *</label>
                      <textarea className="input mt-1" rows={3} value={announceForm.description} onChange={e => setAnnounceForm({...announceForm, description: e.target.value})} required />
                      <label className="inline-flex items-center gap-2 mt-3 text-sm">
                        <input type="checkbox" checked={announceForm.pinned} onChange={e => setAnnounceForm({...announceForm, pinned: e.target.checked})} />
                        Κολλημένη (pinned)
                      </label>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <label className="text-sm font-medium">Εικόνες</label>
                      <input type="file" multiple accept="image/*" onChange={handleAnnounceImageUpload} className="block w-full text-sm text-slate-500 mt-1" />
                      {announceForm.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {announceForm.images.map((url, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeAnnounceImage(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5"><IconX className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {step === 3 && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Κατηγορία</label>
                        <select className="select mt-1" value={announceForm.category} onChange={e => setAnnounceForm({...announceForm, category: e.target.value})}>
                          <option value="">Επιλέξτε</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Ημ/νία δημοσίευσης</label>
                        <input type="date" className="input mt-1" value={announceForm.publish_date} onChange={e => setAnnounceForm({...announceForm, publish_date: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Ημ/νία συμβάντος</label>
                        <input type="date" className="input mt-1" value={announceForm.event_date} onChange={e => setAnnounceForm({...announceForm, event_date: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Τρόπος διαγραφής</label>
                        <select className="select mt-1" value={announceForm.deletion_mode} onChange={e => setAnnounceForm({...announceForm, deletion_mode: e.target.value})}>
                          <option value="auto">Αυτόματα</option>
                          <option value="admin">Μόνο admin</option>
                        </select>
                      </div>
                      {announceForm.deletion_mode === 'auto' && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium">Ημ/νία λήξης (αυτόματη διαγραφή)</label>
                          <input type="date" className="input mt-1" value={announceForm.expiry_date} onChange={e => setAnnounceForm({...announceForm, expiry_date: e.target.value})} />
                        </div>
                      )}
                      <div className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={announceForm.is_permanent} onChange={e => setAnnounceForm({...announceForm, is_permanent: e.target.checked})} />
                        <label className="text-sm">Μόνιμη</label>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <div className="flex gap-2">
                      {step > 0 && <button type="button" onClick={() => setStep(step-1)} className="btn-secondary text-sm">Πίσω</button>}
                      {step < 3 && <button type="button" onClick={() => setStep(step+1)} className="btn-primary text-sm">Επόμενο</button>}
                    </div>
                    {step === 3 && (
                      <button type="submit" className="btn-primary text-sm">
                        {editingAnnounce ? 'Ενημέρωση' : 'Δημιουργία'}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="space-y-2">
                {announcements.map(a => (
                  <div key={a.id} className="card p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {a.images && a.images.length > 0 ? (
                        <img src={a.images[0]} alt={a.title} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                          <IconImage className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm">{a.title}</h4>
                        <p className="text-xs text-slate-500">{formatDate(a.publish_date)} {a.pinned && '⭐'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editAnnouncement(a)} className="btn-secondary text-xs px-3 py-1.5">Επεξεργασία</button>
                      <button onClick={() => deleteAnnouncement(a.id)} className="btn-secondary text-xs px-3 py-1.5 text-red-600">Διαγραφή</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Categories ────────────────────────────────────── */}
          {active === 'Κατηγορίες' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <h3 className="font-bold mb-4">Νέα Κατηγορία</h3>
                <input className="input mb-2" placeholder="Όνομα" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
                <input className="input mb-2" placeholder="Emoji" value={catForm.emoji} onChange={e => setCatForm({...catForm, emoji: e.target.value})} />
                <input className="input mb-2" placeholder="Accent class" value={catForm.accent} onChange={e => setCatForm({...catForm, accent: e.target.value})} />
                <button onClick={saveCategory} className="btn-primary text-sm">Προσθήκη</button>
              </div>
              <div className="space-y-2">
                {categories.map(c => (
                  <div key={c.id} className="card p-3 flex justify-between items-center">
                    <span>{c.emoji} {c.name}</span>
                    <button onClick={() => deleteCategory(c.id)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Documents ────────────────────────────────────── */}
          {active === 'Έγγραφα' && (
            <div>
              <div className="card p-6 mb-6">
                <h3 className="font-bold mb-4">Προσθήκη Εγγράφου</h3>
                <div className="mb-3 flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="docMethod" value="url" checked={docUploadMethod === 'url'} onChange={() => setDocUploadMethod('url')} />
                    URL
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="docMethod" value="upload" checked={docUploadMethod === 'upload'} onChange={() => setDocUploadMethod('upload')} />
                    Αποστολή αρχείου
                  </label>
                </div>
                <input className="input mb-2" placeholder="Τίτλος" value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})} />
                {docUploadMethod === 'url' ? (
                  <input className="input mb-2" placeholder="URL αρχείου" value={docForm.file_path} onChange={e => setDocForm({...docForm, file_path: e.target.value})} />
                ) : (
                  <input type="file" accept=".pdf" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-500 mb-2" />
                )}
                <button onClick={saveDocument} className="btn-primary text-sm">Προσθήκη</button>
              </div>
              <div className="space-y-2">
                {documents.map(d => (
                  <div key={d.id} className="card p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">PDF</div>
                      <span>{d.title}</span>
                    </div>
                    <button onClick={() => deleteDocument(d.id)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Gallery ────────────────────────────────────────── */}
          {active === 'Γκαλερί' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card p-6">
                <h3 className="font-bold mb-4">Προσθήκη Φωτογραφίας</h3>
                <input className="input mb-2" placeholder="Τίτλος" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} />
                <textarea className="input mb-2" placeholder="Περιγραφή" rows={2} value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} />
                <input className="input mb-2" placeholder="URL εικόνας" value={galleryForm.image_url} onChange={e => setGalleryForm({...galleryForm, image_url: e.target.value})} />
                <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="block w-full text-sm text-slate-500 mb-2" />
                {galleryImage && <img src={galleryImage} alt="Preview" className="h-32 w-full object-cover rounded-lg mb-2" />}
                <button onClick={saveGalleryItem} className="btn-primary text-sm">Προσθήκη</button>
              </div>
              <div className="space-y-2">
                {gallery.map(g => (
                  <div key={g.id} className="card p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={g.image_url} alt={g.title} className="w-12 h-12 rounded object-cover" />
                      <div>
                        <p className="text-sm font-medium">{g.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{g.description}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteGalleryItem(g.id)} className="text-red-500 text-sm">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Messages ──────────────────────────────────────── */}
          {active === 'Μηνύματα' && (
            <div className="space-y-3">
              {messages.length === 0 && <div className="card p-6 text-center text-slate-500">Δεν υπάρχουν μηνύματα.</div>}
              {messages.map(m => {
                const unread = !normalizeBoolean(m.is_read);
                const preview = m.message?.length > 120 ? m.message.slice(0, 120) + '...' : m.message;
                return (
                  <div
                    key={m.id}
                    className={`card p-4 cursor-pointer hover:shadow-md transition-shadow ${unread ? 'border-amber-200 bg-amber-50' : 'border-slate-200'}`}
                    onClick={() => setSelectedMessage(m)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${unread ? 'text-amber-800' : 'text-slate-700'}`}>
                            {m.name}
                          </span>
                          {unread && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Νέο</span>
                          )}
                          <span className="text-xs text-slate-400 truncate">({m.email})</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 mt-1">{m.subject || 'Χωρίς θέμα'}</p>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{preview}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(m.created_at).toLocaleString('el-GR')}</p>
                      </div>
                      <div className="flex gap-2 shrink-0 mt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleMessageRead(m.id, unread ? true : false); }}
                          className="text-xs text-brand-600 hover:text-brand-800"
                        >
                          {unread ? 'Σημείωση ως αναγνωσμένο' : 'Μη αναγνωσμένο'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMessage(m.id); }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Διαγραφή
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── Leadership & Members ────────────────────────────────── */}
          {active === 'Διοίκηση & Μέλη' && (
            <div className="grid gap-6">
              <div className="card p-6">
                <h3 className="font-bold mb-4">{editingMember ? 'Επεξεργασία Μέλους' : 'Προσθήκη Μέλους Διοίκησης'}</h3>
                <form onSubmit={saveMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ονοματεπώνυμο</label>
                    <input
                      className="input mt-1"
                      value={memberForm.name}
                      onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ρόλος</label>
                    <select
                      className="input mt-1"
                      value={memberForm.role}
                      onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                    >
                      <option value="Πρόεδρος">Πρόεδρος</option>
                      <option value="Αντιπρόεδρος">Αντιπρόεδρος</option>
                      <option value="Γραμματέας">Γραμματέας</option>
                      <option value="Ταμίας">Ταμίας</option>
                      <option value="Μέλος">Μέλος</option>
                      <option value="Τακτικό Μέλος">Τακτικό Μέλος</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Τηλέφωνο</label>
                    <input
                      className="input mt-1"
                      value={memberForm.phone}
                      onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-3 flex gap-2">
                    <button type="submit" className="btn-primary">
                      {editingMember ? 'Ενημέρωση' : 'Προσθήκη'}
                    </button>
                    {editingMember && (
                      <button type="button" className="btn-secondary" onClick={() => {
                        setEditingMember(null);
                        setMemberForm({ name: '', role: 'Πρόεδρος', phone: '' });
                      }}>
                        Άκυρο
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="card p-6">
                <h3 className="font-bold mb-4">Μήνυμα Προέδρου</h3>
                <form onSubmit={savePresidentMessage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Όνομα Προέδρου</label>
                    <input
                      className="input mt-1"
                      value={settings.president_name || ''}
                      onChange={e => setSettings({ ...settings, president_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Θέση / Τίτλος</label>
                    <input
                      className="input mt-1"
                      value={settings.president_title || ''}
                      onChange={e => setSettings({ ...settings, president_title: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">URL Φωτογραφίας</label>
                    <input
                      className="input mt-1"
                      value={settings.president_image_url || ''}
                      onChange={e => setSettings({ ...settings, president_image_url: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Κείμενο Μηνύματος</label>
                    <textarea
                      className="input mt-1 min-h-[180px]"
                      value={settings.president_message || ''}
                      onChange={e => setSettings({ ...settings, president_message: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="btn-primary">Αποθήκευση μηνύματος</button>
                  </div>
                </form>
              </div>

              <div className="card p-6">
                <h3 className="font-bold mb-4">Καταχωρημένα Μέλη</h3>
                <div className="space-y-5">
                  {members.length === 0 ? (
                    <p className="text-sm text-slate-500">Δεν υπάρχουν μέλη ακόμη.</p>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">Διοικητικό Συμβούλιο</p>
                      <div className="space-y-2">
                        {boardMembers.length === 0 ? (
                          <p className="text-sm text-slate-500">Δεν έχουν καταχωρηθεί μέλη διοίκησης.</p>
                        ) : (
                          boardMembers.map((member) => (
                            <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                              <div>
                                <p className="font-semibold text-slate-800">{member.name}</p>
                                <p className="text-sm text-slate-600">{member.role} • {member.phone}</p>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => editMember(member)} className="btn-secondary text-xs px-3 py-1.5">Επεξεργασία</button>
                                <button type="button" onClick={() => deleteMember(member.id)} className="btn-secondary text-xs px-3 py-1.5 text-red-600">Διαγραφή</button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Members (applications / accepted) ────────────────────────────────────────── */}
          {active === 'Μέλη' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold mb-4">Αιτήσεις Εγγραφής (Εκκρεμείς)</h3>
                {pendingApplications.length === 0 && <div className="text-sm text-slate-500">Δεν υπάρχουν εκκρεμείς αιτήσεις.</div>}
                <div className="space-y-2">
                  {pendingApplications.map(app => (
                    <div key={app.id} className="card overflow-hidden">
                      <button type="button" onClick={() => openApplicationDetail(app, false)} className="w-full text-left p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-base">{app.name}</p>
                            <p className="text-sm text-slate-600">{app.email} • {app.phone}</p>
                            <p className="text-xs text-slate-500 mt-1">Ημερομηνία: {new Date(app.created_at).toLocaleDateString('el-GR')}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${isMembershipExpired(app) ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'}`}>
                              {isMembershipExpired(app) ? 'Λήξη συνδρομής' : 'Εκκρεμής'}
                            </span>
                            {app.membership_type && (
                              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-medium">{app.membership_type}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-500 mb-1">Σχέδιο κατάθεσης</p>
                          <p className="text-sm text-slate-700">{app.payment_reference || '—'}</p>
                        </div>
                      </button>
                      <div className="border-t border-slate-200 p-3 flex justify-end">
                        <button onClick={async () => {
                          confirmAction('Αποδοχή Μέλους', 'Θέλετε να αποδεχτείτε αυτό το μέλος;', async () => {
                            const { error } = await supabase.from('membership_applications').update({ status: 'accepted' }).eq('id', app.id);
                            if (error) throw error;
                            await fetchAll();
                            showStatus('Μέλος αποδεκτό και προστέθηκε στη λίστα.', 'success');
                          });
                        }} className="btn-secondary text-sm">Αποδοχή</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-4">
                  <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Αίτηση μέλους</p>
                        <h3 className="text-2xl font-bold text-slate-900">{selectedApplication.name}</h3>
                      </div>
                      <button type="button" onClick={() => setSelectedApplication(null)} className="btn-secondary text-sm">Κλείσιμο</button>
                    </div>

                    <div className="p-6">
                      <form onSubmit={applicationReadOnly ? undefined : saveApplicationChanges} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Ονοματεπώνυμο</label>
                          <input className="input mt-1" value={applicationForm.name} onChange={e => handleApplicationFieldChange('name', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <input type="email" className="input mt-1" value={applicationForm.email} onChange={e => handleApplicationFieldChange('email', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Όνομα πατρός</label>
                          <input className="input mt-1" value={applicationForm.father_name} onChange={e => handleApplicationFieldChange('father_name', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Όνομα μητρός</label>
                          <input className="input mt-1" value={applicationForm.mother_name} onChange={e => handleApplicationFieldChange('mother_name', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ημερομηνία γέννησης</label>
                          <input type="date" className="input mt-1" value={applicationForm.birth_date} onChange={e => handleApplicationFieldChange('birth_date', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Αριθμός Δελτίου Ταυτότητας</label>
                          <input className="input mt-1" value={applicationForm.id_number} onChange={e => handleApplicationFieldChange('id_number', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Τηλέφωνο</label>
                          <input className="input mt-1" value={applicationForm.phone} onChange={e => handleApplicationFieldChange('phone', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ιδιότητα</label>
                          <select className="input mt-1" value={applicationForm.membership_type} onChange={e => handleApplicationFieldChange('membership_type', e.target.value)} disabled={applicationReadOnly}>
                            <option value="Τακτικό Μέλος">Τακτικό Μέλος</option>
                            <option value="Μέλος">Μέλος</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Διεύθυνση</label>
                          <input className="input mt-1" value={applicationForm.address} onChange={e => handleApplicationFieldChange('address', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Τ.Κ.</label>
                          <input className="input mt-1" value={applicationForm.postal_code} onChange={e => handleApplicationFieldChange('postal_code', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Περιοχή</label>
                          <input className="input mt-1" value={applicationForm.area} onChange={e => handleApplicationFieldChange('area', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Σχέδιο κατάθεσης</label>
                          <input className="input mt-1" value={applicationForm.payment_reference} onChange={e => handleApplicationFieldChange('payment_reference', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Κατάσταση</label>
                          <select className="input mt-1" value={applicationForm.status} onChange={e => handleApplicationFieldChange('status', e.target.value)} disabled={applicationReadOnly}>
                            <option value="pending">Εκκρεμής</option>
                            <option value="accepted">Εγκεκριμένη</option>
                            <option value="rejected">Απορρίφθηκε</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium">Σημείωση διαχειριστή</label>
                          <textarea className="input mt-1 min-h-[100px]" value={applicationForm.admin_note} onChange={e => handleApplicationFieldChange('admin_note', e.target.value)} readOnly={applicationReadOnly} disabled={applicationReadOnly} />
                        </div>

                        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => openApplicationFile(selectedApplication)} className="btn-secondary text-sm">Προβολή αρχείου</button>
                            <button
                              type="button"
                              onClick={() => {
                                confirmAction(
                                  'Επαναφορά σε αναμονή',
                                  'Θέλετε να επιστρέψετε αυτό το μέλος ξανά στη λίστα αναμονής;',
                                  async () => {
                                    const { error } = await supabase.from('membership_applications').update({ status: 'pending' }).eq('id', selectedApplication.id);
                                    if (error) throw error;
                                    setSelectedApplication(null);
                                    await fetchAll();
                                    showStatus('Το μέλος μετακινήθηκε ξανά στην αναμονή.', 'success');
                                  }
                                );
                              }}
                              className="btn-secondary text-sm border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                              Τοποθέτηση σε λίστα αναμονής
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                confirmAction(
                                  'Διαγραφή Αίτησης',
                                  'Θέλετε να διαγράψετε οριστικά αυτή την αίτηση από τη βάση δεδομένων;',
                                  async () => {
                                    const { error } = await supabase.from('membership_applications').delete().eq('id', selectedApplication.id);
                                    if (error) throw error;
                                    setSelectedApplication(null);
                                    await fetchAll();
                                    showStatus('Η αίτηση διαγράφηκε από τη βάση δεδομένων.', 'success');
                                  }
                                );
                              }}
                              className="btn-secondary text-sm border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Διαγραφή
                            </button>
                          </div>
                          {!applicationReadOnly && <button type="submit" className="btn-primary text-sm">Αποθήκευση αλλαγών</button>}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="card p-6">
                <h3 className="font-bold mb-4">Εγκεκριμένα Μέλη</h3>
                {acceptedMembers.length === 0 && <div className="text-sm text-slate-500">Δεν υπάρχουν εγκεκριμένα μέλη.</div>}
                <div className="space-y-2">
                  {acceptedMembers.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => openApplicationDetail(m, true)}
                      className="w-full text-left rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">{m.name}</p>
                          <p className="text-sm text-slate-600">{m.membership_type || 'Μέλος'} • {m.phone}</p>
                        </div>
                        <div className="text-sm text-slate-500">Εγγεγραμμένο: {new Date(m.created_at).toLocaleDateString('el-GR')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Settings ────────────────────────────────────────── */}
          {active === 'Ρυθμίσεις' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold mb-4">Ρυθμίσεις Ιστότοπου</h3>
                <form onSubmit={saveSettings}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.keys(settings)
                      .filter(key => !['president_name', 'president_title', 'president_image_url', 'president_message'].includes(key))
                      .map(key => (
                        <div key={key}>
                          <label className="text-xs font-medium capitalize">{key.replace(/_/g, ' ')}</label>
                          <input
                            className="input"
                            value={settings[key] || ''}
                            onChange={e => setSettings({...settings, [key]: e.target.value})}
                          />
                        </div>
                      ))}
                  </div>
                  <button type="submit" className="btn-primary mt-4">Αποθήκευση</button>
                </form>
              </div>

              <div className="card p-6">
                <h3 className="font-bold mb-4">Αλλαγή Κωδικού</h3>
                <button onClick={() => setPasswordModalOpen(true)} className="btn-primary text-sm">
                  Αλλαγή κωδικού
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── Password Modal ──────────────────────────────────────── */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4">Αλλαγή Κωδικού</h3>
            <form onSubmit={changePassword}>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Τρέχων κωδικός</label>
                  <input
                    type="password"
                    className="input mt-1"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Νέος κωδικός</label>
                  <input
                    type="password"
                    className="input mt-1"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Επιβεβαίωση νέου κωδικού</label>
                  <input
                    type="password"
                    className="input mt-1"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn-secondary text-sm">Άκυρο</button>
                <button type="submit" disabled={changingPassword} className="btn-primary text-sm">
                  {changingPassword ? 'Αποστολή...' : 'Αλλαγή'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}