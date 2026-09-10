import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import Loading from '../components/Loading';

// ─── Inline SVG Icons ─────────────────────────────────────────────
const IconArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const IconDocument = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconMapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconPhone = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconEnvelope = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconDownload = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────
const Home = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [announcements, setAnnouncements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [membershipStatus, setMembershipStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [annRes, docRes, catRes] = await Promise.all([
          supabase.from('announcements').select('*').order('publish_date', { ascending: false }).limit(5),
          supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('categories').select('*').order('name'),
        ]);
        if (annRes.error) throw annRes.error;
        if (docRes.error) throw docRes.error;
        if (catRes.error) throw catRes.error;
        setAnnouncements(annRes.data || []);
        setDocuments(docRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        setError('Δεν ήταν δυνατή η φόρτωση των δεδομένων.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const savedStatus = localStorage.getItem('clubMembershipStatus');
    if (savedStatus) {
      try {
        setMembershipStatus(JSON.parse(savedStatus));
      } catch (err) {
        console.error('Invalid membership status in localStorage', err);
      }
    }

    const savedMemberSession = localStorage.getItem('clubMemberSession');
    if (savedMemberSession) {
      try {
        const parsed = JSON.parse(savedMemberSession);
        if (parsed?.id_number) {
          setMembershipStatus(prev => ({ ...prev, status: 'member', expiresAt: prev?.expiresAt || null, member: parsed }));
        }
      } catch (err) {
        console.error('Invalid remembered member session in localStorage', err);
      }
    }

    fetchData();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Σύντομα';
    const d = new Date(date);
    if (isNaN(d)) return 'Σύντομα';
    return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const truncateText = (text, max = 100) => {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  if (loading || settingsLoading) return <Loading full message="Φόρτωση..." />;
  if (error) {
    return (
      <div className="container-padded py-16">
        <div className="card p-6 bg-red-50 border-red-200 text-red-700">
          <p className="font-semibold">Σφάλμα</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const featured = announcements.find(a => a.pinned) || announcements[0] || null;
  const recentAnnouncements = announcements.filter(a => a !== featured).slice(0, 3);

  const getPaymentCountdown = () => {
    if (!membershipStatus?.expiresAt) return null;
    const target = new Date(membershipStatus.expiresAt);
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return 'Η συνδρομή έχει λήξει';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `Επόμενη πληρωμή σε ${days} ημέρες`;
  };

  return (
    <div className="relative overflow-hidden">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_32%),linear-gradient(135deg,_#f8fffb_0%,_#ffffff_28%,_#f4fbff_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute left-[-4rem] top-12 h-64 w-64 rounded-full border border-emerald-200/80 bg-emerald-100/20" />
          <div className="absolute right-[-3rem] top-20 h-72 w-72 rounded-full border border-cyan-200/80 bg-cyan-100/20" />
          <div className="absolute left-1/4 bottom-6 h-40 w-40 rounded-full border border-slate-200/80 bg-white/40" />
          <div className="absolute right-1/5 bottom-10 h-52 w-52 rounded-full border border-emerald-200/70 bg-emerald-50/50" />
          <div className="absolute inset-x-10 top-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <div className="absolute inset-x-20 bottom-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        <div className="container-padded relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-4">
                Μαζί για την Υγεία
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
                {settings?.hero_title || 'Μια κοινότητα που νοιάζεται για εσάς'}
              </h1>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings?.hero_subtitle || 'Ενημερωθείτε για δράσεις, κατεβάστε χρήσιμα έγγραφα και επικοινωνήστε με το Κέντρο Υγείας σας.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/announcements" className="btn-primary group">
                  <span>Ανακοινώσεις</span>
                  <IconArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/documents" className="btn-secondary">
                  <IconDocument className="w-4 h-4 mr-2" />
                  Έγγραφα
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="hidden sm:block rounded-3xl border border-slate-200/80 bg-white/85 p-4 md:p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[
                    { label: 'Ανακοινώσεις', value: announcements.length, tone: 'brand' },
                    { label: 'Έγγραφα', value: documents.length, tone: 'cyan' },
                    { label: 'Κορυφαία', value: announcements.filter(a => a.pinned).length, tone: 'amber' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-2xl border border-slate-200/80 px-3 py-4 text-center bg-gradient-to-br ${
                        item.tone === 'brand'
                          ? 'from-brand-50 to-emerald-50'
                          : item.tone === 'cyan'
                            ? 'from-cyan-50 to-sky-50'
                            : 'from-amber-50 to-orange-50'
                      }`}
                    >
                      <p className={`text-2xl md:text-3xl font-extrabold ${
                        item.tone === 'brand'
                          ? 'text-brand-700'
                          : item.tone === 'cyan'
                            ? 'text-cyan-700'
                            : 'text-amber-700'
                      }`}>{item.value}</p>
                      <p className="mt-1 text-[11px] md:text-xs font-medium text-slate-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/president-message" className="group block">
                <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.08)] p-4 md:p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(15,23,42,0.12)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-200/80">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700">Μήνυμα Προέδρου</p>
                      <h3 className="mt-1 font-bold text-slate-900 text-base md:text-lg">{settings?.president_name || 'Ο Πρόεδρος του Συλλόγου'}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {settings?.president_message || 'Η υγεία είναι θεμέλιο της κοινωνίας μας...'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-brand-700">
                    <span>Διαβάστε το μήνυμα</span>
                    <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ANNOUNCEMENTS ────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-tag"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 8.25a2.25 2.25 0 012.25-2.25h12a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25h-2.625l-2.625 2.625a.75.75 0 01-1.125 0L9.375 17.25H6a2.25 2.25 0 01-2.25-2.25V8.25z" /></svg> Τελευταία νέα</span>
              <h2 className="section-title mt-1">Πρόσφατες ανακοινώσεις</h2>
            </div>
            <Link to="/announcements" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              Δείτε όλα →
            </Link>
          </div>

          {featured ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Featured */}
              <div className="card p-6 md:p-8 lg:col-span-2 hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-brand">{featured.category || 'Γενικό'}</span>
                      {featured.pinned && <span className="badge badge-amber">⭐ Κορυφαία</span>}
                    </div>
                    <h3 className="text-2xl font-bold mt-3">{featured.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">{featured.description}</p>
                    {featured.summary && <p className="mt-1 text-sm text-slate-500">{featured.summary}</p>}
                    <div className="mt-4 text-sm text-slate-400">
                      <IconCalendar className="inline w-4 h-4 mr-1" />
                      {formatDate(featured.publish_date || featured.created_at)}
                    </div>
                  </div>
                  {featured.images && featured.images.length > 0 && (
                    <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={featured.images[0]} alt={featured.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Link to="/announcements" className="btn-primary-sm">Διαβάστε περισσότερα</Link>
                </div>
              </div>

              {/* Recent Announcements */}
              {recentAnnouncements.length > 0 && (
                <div className="lg:col-span-2 grid gap-4 md:grid-cols-3">
                  {recentAnnouncements.map((a) => (
                    <div key={a.id} className="card p-4 hover:shadow-md transition-shadow">
                      <span className="badge badge-brand text-xs">{a.category || 'Γενικό'}</span>
                      <h4 className="font-semibold mt-1 truncate">{a.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mt-1">{truncateText(a.description, 60)}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        <IconCalendar className="inline w-3 h-3 mr-1" />
                        {formatDate(a.publish_date || a.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-500">Δεν υπάρχουν ανακοινώσεις.</div>
          )}
        </div>
      </section>

      {/* ─── DOCUMENTS ────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50/70">
        <div className="container-padded">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-tag"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> Έγγραφα & Πληροφορίες</span>
              <h2 className="section-title mt-1">Χρήσιμα αρχεία</h2>
            </div>
            <Link to="/documents" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              Όλα τα έγγραφα →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="group relative overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-rose-50/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.1)] flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200">
                    <span className="text-[10px] font-black tracking-[0.12em]">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      <IconCalendar className="inline w-3 h-3 mr-1" />
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 flex-1 line-clamp-2">{doc.description || 'Περιγραφή αρχείου'}</p>

                <div className="mt-5 flex gap-2">
                  <a
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl bg-red-600 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                  >
                    Προεπισκόπηση
                  </a>
                  <a
                    href={doc.file_path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-3 py-2.5 text-red-600 transition hover:bg-red-50"
                    title="Λήψη"
                    onClick={(e) => {
                      e.preventDefault();
                      const link = document.createElement('a');
                      link.href = doc.file_path;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      link.download = doc.title || 'document.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <IconDownload className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          {documents.length === 0 && (
            <div className="card p-12 text-center text-slate-500">Δεν υπάρχουν έγγραφα.</div>
          )}
        </div>
      </section>

      {/* ─── CTA BANNER ────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-padded">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-cyan-600 p-8 md:p-12 text-center text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold">Μείνετε συντονισμένοι</h2>
            <p className="mt-2 text-white/80 max-w-xl mx-auto text-sm md:text-base">
              Ενημερωθείτε για νέες ανακοινώσεις και δράσεις.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/announcements" className="bg-white text-brand-700 hover:bg-slate-50 px-6 py-2.5 rounded-full text-sm font-semibold transition-all">
                Δείτε Ανακοινώσεις
              </Link>
              <Link to="/contact" className="border border-white/40 text-white hover:bg-white/10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all">
                Επικοινωνήστε
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HEALTH CENTER / MAP — VISUAL REDESIGN ─────────────────── */}
      {settings?.show_map_home !== 'false' && settings?.map_link && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container-padded">
            <style>{`
              @keyframes membershipFloat {
                0% { transform: translate3d(0, 0, 0) rotate(0deg); }
                18% { transform: translate3d(2px, -4px, 0) rotate(-0.8deg); }
                42% { transform: translate3d(-2px, 3px, 0) rotate(0.8deg); }
                66% { transform: translate3d(3px, -2px, 0) rotate(-0.5deg); }
                100% { transform: translate3d(0, 0, 0) rotate(0deg); }
              }
            `}</style>
            <div className="grid gap-8 lg:grid-cols-3 items-start">
              {/* Floating register button (right side, elevated) */}
              <div className="lg:col-span-3">
                <div className="fixed right-3 bottom-4 z-40">
                  <a
                    href="/join"
                    className="group inline-flex flex-col items-start gap-1 rounded-2xl border border-white/40 px-3.5 py-2.5 text-left text-xs font-semibold text-white shadow-[0_14px_32px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02]"
                    style={{
                      background: membershipStatus?.status === 'member'
                        ? 'linear-gradient(135deg, #dcfce7 0%, #86efac 18%, #16a34a 52%, #14532d 100%)'
                        : 'linear-gradient(135deg, #dbeafe 0%, #60a5fa 18%, #2563eb 52%, #0f172a 100%)',
                      boxShadow: '0 14px 32px rgba(37, 99, 235, 0.25)',
                      animation: 'membershipFloat 5s ease-in-out infinite',
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 18.75a7.5 7.5 0 0115 0" />
                        </svg>
                      </span>
                      <span>{membershipStatus?.status === 'member' ? 'Είστε μέλος' : membershipStatus?.status === 'pending' ? 'Αίτηση σε εξέλιξη' : 'Εγγραφή μέλους'}</span>
                    </span>
                    {membershipStatus?.status === 'member' && (
                      <span className="text-[10px] font-medium text-emerald-950/80">
                        {getPaymentCountdown() || 'Πιστοποιητικό μέλους'}
                      </span>
                    )}
                    {membershipStatus?.status === 'pending' && (
                      <span className="text-[10px] font-medium text-white/80">Πληρώστε στο IBAN και περιμένετε έγκριση</span>
                    )}
                  </a>
                </div>
              </div>

              {/* Left / Main card */}
              <div className="lg:col-span-2">
                <div className="card p-8 md:p-10 rounded-2xl bg-white shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <IconMapPin className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">Κέντρο Υγείας Τροπαίων</h3>
                      <p className="mt-1 text-sm text-slate-600">Σημείο αναφοράς για την υγεία της περιοχής — ιστορία, ανάγκες και στόχοι αναβάθμισης.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 p-4 bg-white">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 text-xs">•</span>
                        Τρέχουσες ανάγκες
                      </h4>
                      <ul className="mt-3 text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Εξοπλισμός εργαστηρίου</li>
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Προσωπικό για πρωινά ιατρεία</li>
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Βελτιώσεις προσβασιμότητας</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-100 p-4 bg-white">
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-cyan-100 text-cyan-700 text-xs">•</span>
                        Στόχοι αναβάθμισης
                      </h4>
                      <ul className="mt-3 text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Μονάδα πρώτων βοηθειών & τηλεϊατρική</li>
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Κινητές μονάδες προληπτικού ελέγχου</li>
                        <li className="flex items-start gap-3"><span className="mt-1 inline-block w-2 h-2 rounded-full bg-slate-300"/>Συνεργασίες με νοσοκομεία</li>
                      </ul>
                    </div>

                    <div className="md:col-span-2">
                      <div className="mt-4">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Το Κέντρο Υγείας αντιμετωπίζει καθημερινά προκλήσεις που επηρεάζουν την ποιότητα της περίθαλψης: περιορισμένες ώρες λειτουργίας,
                          έλλειψη ειδικών ιατρικών εξετάσεων στην περιοχή, περιορισμένος εξοπλισμός για επείγοντα περιστατικά και ανάγκη για στενή
                          συνεργασία με περιφερειακά νοσοκομεία για παραπομπές. Η προτεραιότητά μας είναι να καλύψουμε αυτά τα κενά με ρεαλιστικά,
                          κοστολογημένα βήματα που βελτιώνουν άμεσα την πρόσβαση και την ασφάλεια των κατοίκων.
                        </p>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full inline-block">Αγορά βασικού εργαστηριακού εξοπλισμού</span>
                          <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full inline-block">Τοπικά πρωινά ιατρεία & σταθερό προσωπικό</span>
                          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full inline-block">Πρόσβαση ΑμεΑ & ασφάλεια κτιρίου</span>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <Link to="/about" className="text-sm text-brand-600 font-medium hover:underline">Μάθετε περισσότερα</Link>
                          <Link to="/donate" className="btn-primary text-sm">Υποστηρίξτε</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings?.address || 'Κέντρο Υγείας Τροπαίων')}&output=embed`}
                  title="Χάρτης"
                  loading="lazy"
                  className="w-full h-48 md:h-64 lg:h-[320px]"
                />
                <div className="p-3 flex items-center justify-between gap-2 bg-white/60">
                  <span className="text-xs text-slate-500">Πηγή: Χάρτες Google</span>
                  <a
                    href={settings?.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-brand-600 text-white text-sm px-3 py-1.5 hover:bg-brand-700 transition"
                  >
                    <IconMapPin className="w-4 h-4" />
                    Οδηγίες
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;