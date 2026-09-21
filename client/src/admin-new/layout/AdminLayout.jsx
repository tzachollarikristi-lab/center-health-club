import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import Loading from '../../components/Loading';
import Sidebar from './Sidebar';
import { useToast } from '../../components/Toast';

// Icons
const IconMenu = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const IconX = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const startTime = Date.now();
    const MIN_DISPLAY_MS = 800; // Loading stays visible for at least 2s

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

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      setUnreadCount(count || 0);

      // Wait until at least MIN_DISPLAY_MS have passed since mount
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => setLoading(false), remaining);
    };

    checkAuth();
  }, [navigate, showToast]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return <Loading full message="Φόρτωση πίνακα διαχείρισης..." />;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="container-padded py-6 md:py-10">

        {/* Floating Mobile Menu Button (top-right) */}
        <motion.button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="lg:hidden fixed top-20 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg"
          aria-label="Άνοιγμα μενού"
        >
          <IconMenu className="h-5 w-5" />
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <Sidebar unreadCount={unreadCount} onLogout={logout} />
          </div>

          {/* Mobile Drawer with Animation */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                  className="fixed inset-y-0 right-0 z-50 w-[82%] max-w-sm bg-white shadow-2xl p-3 lg:hidden flex flex-col"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 shrink-0">
                    <h2 className="font-display font-bold text-slate-800 text-lg">Μενού</h2>
                    <motion.button
                      type="button"
                      onClick={() => setMobileSidebarOpen(false)}
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      aria-label="Κλείσιμο μενού"
                    >
                      <IconX className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <Sidebar
                      unreadCount={unreadCount}
                      mobile
                      onSelect={() => setMobileSidebarOpen(false)}
                      onLogout={logout}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 min-w-0">
            <Outlet context={{ admin, unreadCount, setUnreadCount, logout }} />
          </main>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────
export const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const markMessageRead = async (id, isRead) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: Boolean(isRead) })
    .eq('id', id);
  if (error) throw error;
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
};