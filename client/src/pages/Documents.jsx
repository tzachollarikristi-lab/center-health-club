import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { documents as fallbackDocuments } from '../data/content';
import SEO from '../components/SEO';

// ─── Icons ────────────────────────────────────────────────────────
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const FileIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);
const DownloadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const ArrowRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 5l7 7-7 7" />
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
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Documents ───────────────────────────────────────────────────
const Documents = () => {
  const [documents, setDocuments] = useState(fallbackDocuments);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error) setDocuments(data || []);
        }
      } catch (err) { console.warn(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const fmtLong = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filtered = documents.filter(doc =>
    doc.title?.toLowerCase().includes(search.toLowerCase()) ||
    doc.description?.toLowerCase().includes(search.toLowerCase())
  );

  const openPreview = (doc) => {
    setPreview(doc);
    document.body.style.overflow = 'hidden';
  };
  const closePreview = () => {
    setPreview(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => { if (e.key === 'Escape') closePreview(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  // Extract file extension for the badge
  const getExt = (path) => {
    if (!path) return 'PDF';
    const m = path.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
    return m ? m[1].toUpperCase().slice(0, 4) : 'FILE';
  };

  if (loading) {
  return (
    <div className="bg-[#faf8f4] min-h-screen animate-pulse">
      <section className="container-padded pt-8 pb-8 md:pt-10 md:pb-10">
        <div className="h-3 w-32 rounded-full bg-slate-200/60 mb-6" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="h-8 w-40 rounded-2xl bg-slate-200/60" />
            <div className="h-3 w-64 rounded-full bg-slate-200/50" />
          </div>
          <div className="h-10 w-full md:w-72 rounded-full bg-slate-200/50" />
        </div>
      </section>

      <section className="container-padded pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200/40" />
          ))}
        </div>
      </section>
    </div>
  );
}

  const hasFilters = Boolean(search);

  return (
   <SEO title="Έγγραφα" description="Ενημερωτικά φυλλάδια, οδηγίες και επίσημα έγγραφα του συλλόγου." url="/documents" />,

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

            {/* Back */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Πίσω στην αρχική
            </Link>

            {/* Title + Search row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
              <div className="min-w-0">
                <h1 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.02em] text-slate-900">
                  Έγγραφα
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Ενημερωτικά φυλλάδια, οδηγίες και επίσημα έγγραφα του συλλόγου.
                </p>
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Αναζήτηση εγγράφου..."
                  className="w-full h-10 rounded-full bg-white border border-slate-200 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    aria-label="Καθαρισμός"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            {hasFilters && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>
                  {filtered.length} {filtered.length === 1 ? 'έγγραφο' : 'έγγραφα'}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Καθαρισμός
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════ */}
      <section className="pt-10 md:pt-14 pb-20 md:pb-24">
        <div className="container-padded">

          {filtered.length === 0 ? (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-md mx-auto text-center py-16">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-slate-900/8">
                <FileIcon className="h-7 w-7 text-slate-300" />
              </div>
              <h3 className="font-display text-lg text-slate-900">
                {documents.length === 0 ? 'Δεν υπάρχουν έγγραφα' : 'Δεν βρέθηκαν αποτελέσματα'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {documents.length === 0
                  ? 'Επιστρέψτε σύντομα για νέα έγγραφα.'
                  : 'Δοκιμάστε να αλλάξετε τον όρο αναζήτησης.'}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 pl-5 pr-2 py-1.5 text-white transition-all hover:bg-brand-600 group"
                >
                  <span className="text-xs font-semibold">Καθαρισμός</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:rotate-[-45deg]">
                    <XIcon className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {filtered.map((doc, i) => {
                const ext = getExt(doc.file_path);
                return (
                  <motion.div key={doc.id} variants={fadeUp} custom={i}>
                    <div
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
                    >
                      {/* Header row */}
                      <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm">
                            <span className="text-[10px] font-black tracking-[0.1em]">{ext}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-base md:text-lg leading-snug text-slate-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                              {doc.title}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                              <CalendarIcon className="h-3 w-3" />
                              {fmt(doc.created_at)}
                            </div>
                          </div>
                        </div>

                        <p className="mt-3.5 text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
                          {doc.description || 'Χωρίς περιγραφή'}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPreview(doc)}
                          className="group/btn flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-700 active:scale-[0.98]"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          Προεπισκόπηση
                        </button>
                        <a
                          href={doc.file_path}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
                          title="Λήψη"
                          onClick={(e) => {
                            e.preventDefault();
                            const link = document.createElement('a');
                            link.href = doc.file_path;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            link.download = doc.title || 'document';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <DownloadIcon className="h-3.5 w-3.5" />
                          Λήψη
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PREVIEW MODAL
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 md:p-6"
            onClick={closePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-5 md:p-6 border-b border-slate-200 shrink-0">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-sm">
                    <span className="text-[9px] font-black tracking-[0.1em]">{getExt(preview.file_path)}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base md:text-lg text-slate-900 leading-snug truncate">
                      {preview.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {fmtLong(preview.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={preview.file_path}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-700"
                  >
                    <DownloadIcon className="h-3.5 w-3.5" />
                    Λήψη
                  </a>
                  <button
                    type="button"
                    onClick={closePreview}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all"
                    aria-label="Κλείσιμο"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 bg-slate-100 min-h-0">
                <iframe
                  src={preview.file_path}
                  title={preview.title}
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Documents;