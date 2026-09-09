import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Loading from '../components/Loading';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Σύντομα';
    const d = new Date(date);
    if (isNaN(d)) return 'Σύντομα';
    return d.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filtered = documents.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading full message="Φόρτωση εγγράφων..." />;

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
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Έγγραφα</h1>
          <p className="text-sm text-slate-500 mt-1">Προβολή και λήψη σημαντικών αρχείων.</p>
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

      {/* ─── Document Grid ────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg text-slate-500">
            {documents.length === 0 ? 'Δεν υπάρχουν έγγραφα.' : 'Δεν βρέθηκαν αποτελέσματα.'}
          </p>
          {documents.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">Δοκιμάστε να αλλάξετε τον όρο αναζήτησης.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card p-5 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-xs">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{doc.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(doc.created_at)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600 flex-1 line-clamp-2">{doc.description || 'Χωρίς περιγραφή'}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="btn-primary-sm flex-1 text-center"
                >
                  Προεπισκόπηση
                </button>
                <a
                  href={doc.file_path}
                  download
                  className="btn-secondary px-3 py-1.5 text-sm flex items-center justify-center"
                  title="Λήψη"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Preview Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">{previewDoc.title}</h3>
                <div className="flex gap-2">
                  <a href={previewDoc.file_path} download className="btn-primary-sm">Λήψη</a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <iframe
                src={previewDoc.file_path}
                title={previewDoc.title}
                className="w-full h-[60vh]"
                frameBorder="0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;