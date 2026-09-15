import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';
import { gallery as fallbackGallery } from '../data/content';

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
const ImageIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
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
const ExpandIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── Gallery ─────────────────────────────────────────────────────
const Gallery = () => {
  const [images, setImages] = useState(fallbackGallery);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const preloadRef = useRef(new Set());

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data?.length) setImages(data);
        }
      } catch (err) { console.warn(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = images.filter(img =>
    img.title?.toLowerCase().includes(search.toLowerCase()) ||
    img.description?.toLowerCase().includes(search.toLowerCase())
  );

  const hasFilters = Boolean(search);
  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  // ─── Open/close lightbox ──────────────────────────────────────
  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setIsLoadingImage(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => {
      if (prev === null) return prev;
      setIsLoadingImage(true);
      return prev === 0 ? filtered.length - 1 : prev - 1;
    });
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex(prev => {
      if (prev === null) return prev;
      setIsLoadingImage(true);
      return prev === filtered.length - 1 ? 0 : prev + 1;
    });
  }, [filtered.length]);

  // ─── Keyboard navigation ──────────────────────────────────────
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  // ─── Preload adjacent images ──────────────────────────────────
  useEffect(() => {
    if (lightboxIndex === null || filtered.length < 2) return;
    const next = filtered[lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1];
    const prev = filtered[lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1];

    [next, prev].forEach(img => {
      if (img?.image_url && !preloadRef.current.has(img.image_url)) {
        const el = new Image();
        el.src = img.image_url;
        preloadRef.current.add(img.image_url);
      }
    });
  }, [lightboxIndex, filtered]);

  if (loading) return <Loading full message="Φόρτωση gallery..." />;

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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
              <div className="min-w-0">
                <h1 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.02em] text-slate-900">
                  Gallery
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  Φωτογραφίες από δράσεις, εκδηλώσεις και στιγμές του συλλόγου.
                </p>
              </div>

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

            {hasFilters && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span>
                  {filtered.length} {filtered.length === 1 ? 'φωτογραφία' : 'φωτογραφίες'}
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
                <ImageIcon className="h-7 w-7 text-slate-300" />
              </div>
              <h3 className="font-display text-lg text-slate-900">
                {images.length === 0 ? 'Δεν υπάρχουν φωτογραφίες' : 'Δεν βρέθηκαν αποτελέσματα'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {images.length === 0
                  ? 'Επιστρέψτε σύντομα για νέες φωτογραφίες.'
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
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 [column-fill:_balance]"
            >
              {filtered.map((img, idx) => (
                <motion.div
                  key={img.id}
                  variants={fadeUp}
                  custom={idx}
                  className="break-inside-avoid mb-3 md:mb-4"
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/6 transition-all hover:ring-slate-900/15 hover:shadow-lg"
                  >
                    {/* Image */}
                    <img
                      src={img.image_url}
                      alt={img.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover content */}
                    <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-xs md:text-sm font-semibold leading-tight truncate">
                            {img.title}
                          </p>
                          {img.description && (
                            <p className="mt-0.5 text-white/70 text-[11px] leading-tight truncate">
                              {img.description}
                            </p>
                          )}
                        </div>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                          <ExpandIcon className="h-3 w-3 text-white" />
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col"
            onClick={closeLightbox}
          >
            {/* ─── Top bar ───────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-3 md:py-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base font-semibold truncate">
                  {current.title}
                </p>
                {current.description && (
                  <p className="text-xs text-white/60 truncate">
                    {current.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-flex items-center text-xs font-mono tabular-nums text-white/60">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  aria-label="Κλείσιμο"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ─── Main image area ───────────────────── */}
            <div
              className="flex-1 min-h-0 relative flex items-center justify-center px-4 md:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev */}
              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all active:scale-95"
                  aria-label="Προηγούμενη"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              )}

              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: isLoadingImage ? 0 : 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  src={current.image_url}
                  alt={current.title}
                  onLoad={() => setIsLoadingImage(false)}
                  onError={() => setIsLoadingImage(false)}
                  className="max-h-full max-w-full object-contain rounded-lg select-none"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Loading spinner inside lightbox */}
              {isLoadingImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <p className="text-white/60 text-xs">Φόρτωση...</p>
                  </div>
                </div>
              )}

              {/* Next */}
              {filtered.length > 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all active:scale-95"
                  aria-label="Επόμενη"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* ─── Bottom bar (counter + dots) ───────── */}
            {filtered.length > 1 && (
              <div
                className="shrink-0 flex items-center justify-center gap-4 px-4 py-3 md:py-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile counter */}
                <span className="sm:hidden text-xs font-mono tabular-nums text-white/60">
                  {lightboxIndex + 1} / {filtered.length}
                </span>

                {/* Dots for small galleries */}
                {filtered.length <= 12 && (
                  <div className="hidden sm:flex gap-1.5">
                    {filtered.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setLightboxIndex(idx); setIsLoadingImage(true); }}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === lightboxIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Εικόνα ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Keyboard hint — desktop only */}
            <div className="hidden md:flex shrink-0 items-center justify-center gap-4 pb-4 text-[10px] uppercase tracking-[0.15em] text-white/40">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono">→</kbd>
                Πλοήγηση
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono">ESC</kbd>
                Κλείσιμο
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;