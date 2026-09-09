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

  return (
    <div className="relative overflow-hidden">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-white to-cyan-50/20 -z-10" />
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

            {/* Stats Card - visible on all devices */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xl">
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-brand-600">{announcements.length}</p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">Ανακοινώσεις</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-cyan-600">{documents.length}</p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">Έγγραφα</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-amber-600">{announcements.filter(a => a.pinned).length}</p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">Κορυφαία</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs md:text-sm text-slate-600">Όλες οι ενημερώσεις σε ένα μέρος</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-12 bg-slate-50/60">
          <div className="container-padded">
            <div className="text-center mb-8">
              <span className="section-tag">🏷️ Κατηγορίες</span>
              <h2 className="section-title mt-1">Ανακαλύψτε ανά θέμα</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <span key={cat.id} className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:shadow-md transition-all">
                  {cat.emoji} {cat.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ANNOUNCEMENTS ────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container-padded">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="section-tag">📢 Τελευταία νέα</span>
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
              <span className="section-tag">📄 Έγγραφα & Πληροφορίες</span>
              <h2 className="section-title mt-1">Χρήσιμα αρχεία</h2>
            </div>
            <Link to="/documents" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              Όλα τα έγγραφα →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div key={doc.id} className="card p-5 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">PDF</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{doc.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      <IconCalendar className="inline w-3 h-3 mr-1" />
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 flex-1 line-clamp-2">{doc.description || 'Περιγραφή αρχείου'}</p>
                <div className="mt-4 flex gap-2">
                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="btn-primary-sm flex-1 text-center">Προεπισκόπηση</a>
                  <a href={doc.file_path} download className="btn-secondary px-3 py-1.5 text-sm flex items-center justify-center" title="Λήψη">
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

      {/* ─── MAP ────────────────────────────────────────────────────── */}
      {settings?.show_map_home !== 'false' && settings?.map_link && (
        <section className="py-16 bg-slate-50/60 border-t border-slate-200">
          <div className="container-padded">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="section-tag">📍 Τοποθεσία</span>
                <h2 className="section-title mt-1">Βρείτε μας</h2>
                <p className="mt-3 text-slate-600">{settings?.address || 'Κέντρο Υγείας, Κεντρική Πλατεία, Αθήνα'}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => window.open(settings.map_link, '_blank')} className="btn-primary">
                    <IconMapPin className="w-4 h-4 mr-2" />
                    Λήψη οδηγιών
                  </button>
                  {settings?.support_phone && (
                    <a href={`tel:${settings.support_phone}`} className="btn-secondary">
                      <IconPhone className="w-4 h-4 mr-2" />
                      {settings.support_phone}
                    </a>
                  )}
                </div>
                {settings?.contact_email && (
                  <p className="mt-3 text-sm text-slate-500 flex items-center gap-2">
                    <IconEnvelope className="w-4 h-4" />
                    {settings.contact_email}
                  </p>
                )}
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-soft">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings?.address || 'Κέντρο Υγείας Τροπαίων')}&output=embed`}
                  title="Χάρτης"
                  loading="lazy"
                  className="w-full h-64 md:h-72"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;