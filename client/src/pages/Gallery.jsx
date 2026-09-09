import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setImages(data || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = images.filter(img =>
    img.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading full message="Φόρτωση gallery..." />;

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
      {/* ─── Header with search on right ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="text-sm text-slate-500 mt-1">Φωτογραφίες από δράσεις και εκδηλώσεις.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Αναζήτηση..."
              className="w-full sm:w-48 md:w-56 px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-200/50 focus:outline-none transition-all"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap"
            >
              ✕ Καθαρισμός
            </button>
          )}
        </div>
      </div>

      {/* ─── Gallery Grid ──────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg text-slate-500">
            {images.length === 0 ? 'Δεν υπάρχουν φωτογραφίες.' : 'Δεν βρέθηκαν αποτελέσματα.'}
          </p>
          {images.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">Δοκιμάστε να αλλάξετε τον όρο αναζήτησης.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-soft hover:shadow-md transition-shadow"
              onClick={() => setPreviewImage(img)}
            >
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-white text-sm font-medium truncate">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Lightbox Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-6"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full bg-white rounded-xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div>
                  <h3 className="font-semibold text-slate-900">{previewImage.title}</h3>
                  <p className="text-sm text-slate-500">{previewImage.description}</p>
                </div>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center p-2 bg-slate-50">
                <img
                  src={previewImage.image_url}
                  alt={previewImage.title}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;