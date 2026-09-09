import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';

// ─── Icons ──────────────────────────────────────────────────────────
const IconSearch = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const IconCalendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconX = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconChevronLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const IconChevronRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const IconDocument = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────
const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selected, setSelected] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, catRes] = await Promise.all([
          supabase.from('announcements').select('*').order('publish_date', { ascending: false }).order('pinned', { ascending: false }),
          supabase.from('categories').select('*').order('name'),
        ]);
        if (annRes.error) throw annRes.error;
        if (catRes.error) throw catRes.error;
        setAnnouncements(annRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
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

  const filtered = announcements.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinned = filtered.find(a => a.pinned) || null;
  const rest = filtered.filter(a => a !== pinned);

  // ─── Modal handlers ────────────────────────────────────────────
  const openModal = (item) => {
    setSelected(item);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelected(null);
    setCurrentImageIndex(0);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selected || !selected.images || selected.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selected.images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!selected || !selected.images || selected.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === selected.images.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <Loading full message="Φόρτωση ανακοινώσεων..." />;

  if (error) {
    return (
      <div className="container-padded py-16">
        <div className="card p-6 bg-red-50 border-red-200 text-red-700">
          <p className="font-semibold">Σφάλμα φόρτωσης</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-padded py-10 md:py-16">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Ανακοινώσεις</h1>
          <p className="text-sm text-slate-500 mt-1">Ενημερωθείτε για τα τελευταία νέα του συλλόγου.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Αναζήτηση..."
              className="w-full sm:w-48 md:w-56 px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-200/50 focus:outline-none transition-all pl-9"
            />
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-200/50 focus:outline-none transition-all appearance-none"
          >
            <option value="all">Όλες οι κατηγορίες</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</option>
            ))}
          </select>
          {(search || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <IconX className="h-3 w-3" />
              Καθαρισμός
            </button>
          )}
        </div>
      </div>

      {/* ─── Results ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <IconDocument className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg text-slate-500">
            {announcements.length === 0 ? 'Δεν υπάρχουν ανακοινώσεις.' : 'Δεν βρέθηκαν αποτελέσματα.'}
          </p>
          {announcements.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης.</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* ─── Pinned Announcement ────────────────────────────── */}
          {pinned && (
            <div
              className="card p-6 md:p-8 bg-gradient-to-br from-white to-brand-50/30 border-brand-100/30 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openModal(pinned)}
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-brand">{pinned.category || 'Γενικό'}</span>
                    <span className="badge badge-amber">⭐ Κορυφαία</span>
                  </div>
                  <h2 className="text-2xl font-bold mt-3">{pinned.title}</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed line-clamp-3">{pinned.description}</p>
                  {pinned.summary && <p className="mt-1 text-sm text-slate-500">{pinned.summary}</p>}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <IconCalendar className="h-4 w-4" />
                      {formatDate(pinned.publish_date || pinned.created_at)}
                    </span>
                    {pinned.event_date && (
                      <span className="flex items-center gap-1.5">
                        <IconCalendar className="h-4 w-4" />
                        {formatDate(pinned.event_date)}
                      </span>
                    )}
                  </div>
                </div>
                {pinned.images && pinned.images.length > 0 && (
                  <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={pinned.images[0]} alt={pinned.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Regular Announcements ────────────────────────────── */}
          <div className="grid gap-4">
            {rest.map((item) => (
              <div
                key={item.id}
                className="card p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openModal(item)}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-brand text-xs">{item.category || 'Γενικό'}</span>
                    </div>
                    <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.description}</p>
                    <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                      <IconCalendar className="h-3.5 w-3.5" />
                      {formatDate(item.publish_date || item.created_at)}
                    </p>
                  </div>
                  {item.images && item.images.length > 0 && (
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Detailed Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              >
                <IconX className="h-6 w-6" />
              </button>

              <div className="flex flex-col md:flex-row overflow-y-auto flex-1">
                {/* ─── Left: Text ────────────────────────────────── */}
                <div className="p-6 md:p-8 md:w-1/2 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-brand">{selected.category || 'Γενικό'}</span>
                    {selected.pinned && <span className="badge badge-amber">⭐ Κορυφαία</span>}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{selected.title}</h2>
                  {selected.summary && (
                    <p className="mt-2 text-sm text-brand-600 font-medium">{selected.summary}</p>
                  )}
                  <div className="mt-4 text-slate-600 leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto">
                    {selected.description}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200 text-sm text-slate-400 space-y-1">
                    <p className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      Δημοσίευση: {formatDate(selected.publish_date || selected.created_at)}
                    </p>
                    {selected.event_date && (
                      <p className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4" />
                        Συμβάν: {formatDate(selected.event_date)}
                      </p>
                    )}
                    {selected.expiry_date && (
                      <p className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4" />
                        Λήξη: {formatDate(selected.expiry_date)}
                      </p>
                    )}
                  </div>
                </div>

                {/* ─── Right: Image Carousel ────────────────────── */}
                <div className="md:w-1/2 bg-slate-100 flex items-center justify-center relative min-h-[250px] md:min-h-[300px]">
                  {selected.images && selected.images.length > 0 ? (
                    <>
                      <img
                        src={selected.images[currentImageIndex]}
                        alt={selected.title}
                        className="w-full h-full max-h-[60vh] object-contain p-4"
                      />
                      {selected.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                          >
                            <IconChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                          >
                            <IconChevronRight className="h-6 w-6" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {selected.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-slate-400 text-sm flex items-center justify-center h-full">
                      Δεν υπάρχουν εικόνες
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;