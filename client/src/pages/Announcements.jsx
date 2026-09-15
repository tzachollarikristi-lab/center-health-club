import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import { announcements as fallbackAnnouncements, categories as fallbackCategories } from '../data/content';

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
const BellIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10.3 21a2 2 0 003.4 0" />
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
const ArrowUpRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

// ─── Announcements ───────────────────────────────────────────────
const Announcements = () => {
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements);
  const [categories, setCategories] = useState(fallbackCategories);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (supabase) {
          const [annRes, catRes] = await Promise.all([
            supabase.from('announcements').select('*').order('publish_date', { ascending: false }).order('pinned', { ascending: false }),
            supabase.from('categories').select('*').order('name'),
          ]);
          if (!annRes.error && annRes.data?.length) setAnnouncements(annRes.data);
          if (!catRes.error && catRes.data?.length) setCategories(catRes.data);
        }
      } catch (err) { console.warn(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const fmt = (d) => {
    if (!d) return 'Σύντομα';
    const dt = new Date(d);
    if (isNaN(dt)) return 'Σύντομα';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const fmtLong = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filtered = announcements.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinned = filtered.find(a => a.pinned) || null;
  const rest = filtered.filter(a => a !== pinned);
  const hasFilters = Boolean(search) || selectedCategory !== 'all';

  const openModal = (item) => {
    setSelected(item);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setSelected(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = '';
  };
  const prevImage = (e) => {
    e.stopPropagation();
    if (!selected?.images?.length) return;
    setCurrentImageIndex(prev => prev === 0 ? selected.images.length - 1 : prev - 1);
  };
  const nextImage = (e) => {
    e.stopPropagation();
    if (!selected?.images?.length) return;
    setCurrentImageIndex(prev => prev === selected.images.length - 1 ? 0 : prev + 1);
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  if (loading) return <Loading full message="Φόρτωση ανακοινώσεων..." />;

  const clearFilters = () => { setSearch(''); setSelectedCategory('all'); };

  return (
    <div className="bg-[#faf8f4] text-slate-900 min-h-screen">

      {/* ══════════════════════════════════════════════════
          PAGE HEADER — small title + minimal search
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

            {/* Back button */}
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
                  Ανακοινώσεις
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Νέα, δράσεις και εκδηλώσεις του συλλόγου.
                </p>
              </div>

              {/* Minimal search */}
              <div className="relative w-full md:w-72 shrink-0">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Αναζήτηση..."
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

            {/* Category chips — small, inline */}
            <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/70 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                Όλες
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.name)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-all flex items-center gap-1 ${
                    selectedCategory === c.name
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/70 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {c.emoji && <span>{c.emoji}</span>}
                  {c.name}
                </button>
              ))}
            </div>

            {/* Results count */}
            {hasFilters && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span>
                  {filtered.length} {filtered.length === 1 ? 'αποτέλεσμα' : 'αποτελέσματα'}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <button
                  type="button"
                  onClick={clearFilters}
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
                <BellIcon className="h-7 w-7 text-slate-300" />
              </div>
              <h3 className="font-display text-lg text-slate-900">
                {announcements.length === 0 ? 'Δεν υπάρχουν ανακοινώσεις' : 'Δεν βρέθηκαν αποτελέσματα'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {announcements.length === 0
                  ? 'Επιστρέψτε σύντομα για νέα του συλλόγου.'
                  : 'Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης.'}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 pl-5 pr-2 py-1.5 text-white transition-all hover:bg-brand-600 group"
                >
                  <span className="text-xs font-semibold">Καθαρισμός φίλτρων</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:rotate-[-45deg]">
                    <XIcon className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8 md:space-y-10">

              {/* Featured / Pinned */}
              {pinned && (
                <motion.div variants={fadeUp} custom={0}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                      <StarIcon className="h-3 w-3" />
                      Κορυφαία
                    </span>
                    <span className="h-px flex-1 bg-slate-900/10" />
                  </div>

                  <button
                    type="button"
                    onClick={() => openModal(pinned)}
                    className="group block w-full text-left overflow-hidden rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #fdfdfc 0%, #f4f9fd 60%, #eaf2fb 100%)' }}
                  >
                    <div className={`grid ${pinned.images?.length ? 'md:grid-cols-5' : ''}`}>
                      {pinned.images && pinned.images.length > 0 && (
                        <div className="md:col-span-3 aspect-[16/10] md:aspect-auto md:min-h-[300px] overflow-hidden bg-slate-100">
                          <img
                            src={pinned.images[0]}
                            alt={pinned.title}
                            className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className={`p-5 sm:p-7 md:p-8 flex flex-col justify-center ${pinned.images?.length ? 'md:col-span-2' : ''}`}>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="badge badge-neutral">{pinned.category || 'Γενικό'}</span>
                        </div>

                        <h2 className="font-display text-xl md:text-2xl leading-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                          {pinned.title}
                        </h2>

                        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {pinned.description}
                        </p>

                        {pinned.summary && (
                          <p className="mt-2 text-xs text-slate-500 italic">{pinned.summary}</p>
                        )}

                        <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {fmt(pinned.publish_date || pinned.created_at)}
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5 transition-all group-hover:bg-slate-900 group-hover:text-white">
                            <ArrowUpRightIcon className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div>
                  {pinned && (
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900/50">
                        Όλες οι ανακοινώσεις
                      </span>
                      <span className="h-px flex-1 bg-slate-900/10" />
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {rest.map((item, i) => {
                      const hasImage = item.images && item.images.length > 0;
                      return (
                        <motion.div key={item.id} variants={fadeUp} custom={i + 1}>
                          <button
                            type="button"
                            onClick={() => openModal(item)}
                            className="group block w-full text-left h-full overflow-hidden rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
                            style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
                          >
                            {hasImage && (
                              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                                <img
                                  src={item.images[0]}
                                  alt={item.title}
                                  className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06]"
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <div className={`p-5 md:p-6 flex flex-col flex-1 ${hasImage ? '' : 'min-h-[180px]'}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="badge badge-brand">{item.category || 'Γενικό'}</span>
                              </div>

                              <h3 className="font-display text-base md:text-lg leading-snug text-slate-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
                                {item.title}
                              </h3>

                              <p className="mt-2.5 text-sm text-slate-500 line-clamp-3 flex-1">
                                {item.description}
                              </p>

                              <div className="mt-4 pt-3.5 border-t border-slate-200/60 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <CalendarIcon className="h-3 w-3" />
                                  {fmt(item.publish_date || item.created_at)}
                                </span>
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/5 transition-all group-hover:bg-slate-900 group-hover:text-white">
                                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                                </span>
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DETAIL MODAL
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full ${selected.images?.length ? 'max-w-4xl' : 'max-w-2xl'} bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/8 text-slate-700 hover:bg-white hover:text-slate-900 transition-all"
                aria-label="Κλείσιμο"
              >
                <XIcon className="h-4 w-4" />
              </button>

              <div className={`flex flex-col ${selected.images?.length ? 'md:flex-row' : ''} overflow-y-auto flex-1`}>
                <div className={`p-6 md:p-9 ${selected.images?.length ? 'md:w-1/2' : 'w-full'} flex flex-col`}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-neutral">{selected.category || 'Γενικό'}</span>
                    {selected.pinned && (
                      <span className="badge badge-gold inline-flex items-center gap-1">
                        <StarIcon className="h-2.5 w-2.5" />
                        Κορυφαία
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-xl md:text-2xl leading-tight text-slate-900 pr-10">
                    {selected.title}
                  </h2>

                  {selected.summary && (
                    <p className="mt-3 text-sm text-brand-600 font-medium italic">
                      {selected.summary}
                    </p>
                  )}

                  <div className="mt-5 text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap flex-1">
                    {selected.description}
                  </div>

                  <div className="mt-7 pt-5 border-t border-slate-200 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong className="font-semibold text-slate-700">Δημοσίευση:</strong>{' '}
                        {fmtLong(selected.publish_date || selected.created_at)}
                      </span>
                    </div>
                    {selected.event_date && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          <strong className="font-semibold text-slate-700">Συμβάν:</strong>{' '}
                          {fmtLong(selected.event_date)}
                        </span>
                      </div>
                    )}
                    {selected.expiry_date && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          <strong className="font-semibold text-slate-700">Λήξη:</strong>{' '}
                          {fmtLong(selected.expiry_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selected.images && selected.images.length > 0 && (
                  <div className="md:w-1/2 bg-slate-100 flex items-center justify-center relative min-h-[280px] md:min-h-[420px]">
                    <img
                      src={selected.images[currentImageIndex]}
                      alt={selected.title}
                      className="w-full h-full max-h-[60vh] object-contain p-4"
                    />

                    {selected.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/8 text-slate-700 hover:bg-white hover:text-slate-900 transition-all"
                          aria-label="Προηγούμενη εικόνα"
                        >
                          <ArrowLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/8 text-slate-700 hover:bg-white hover:text-slate-900 transition-all"
                          aria-label="Επόμενη εικόνα"
                        >
                          <ArrowRightIcon className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selected.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                              className={`h-1.5 rounded-full transition-all ${
                                idx === currentImageIndex ? 'w-5 bg-slate-900' : 'w-1.5 bg-slate-400/60'
                              }`}
                              aria-label={`Εικόνα ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
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

export default Announcements;