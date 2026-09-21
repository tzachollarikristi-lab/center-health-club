import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Public pages ─────────────────────────────────
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Documents from './pages/Documents';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import PresidentMessage from './pages/PresidentMessage';
import Join from './pages/Join';
import MemberStatus from './pages/MemberStatus';
import Page404 from './pages/Page404';

// ─── Admin ────────────────────────────────────────
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin-new/layout/AdminLayout';
import Overview from './admin-new/pages/Overview';
import AnnouncementsPage from './admin-new/pages/Announcements';
import MessagesPage from './admin-new/pages/Messages';
import GalleryPage from './admin-new/pages/Gallery';
import DocumentsPage from './admin-new/pages/Documents';
import LeadershipPage from './admin-new/pages/Leadership';
import MembersPage from './admin-new/pages/Members';
import SettingsPage from './admin-new/pages/Settings';

// ─── Layout ───────────────────────────────────────
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <SettingsProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            <Routes>
              {/* ═══ Public routes ═══ */}
              <Route path="/" element={<Home />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/president-message" element={<PresidentMessage />} />
              <Route path="/join" element={<Join />} />
              <Route path="/member-login" element={<Join mode="login" />} />
              <Route path="/member-status" element={<MemberStatus />} />

              {/* ═══ Admin login ═══ */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ═══ Admin panel — nested routes ═══ */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Overview />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="leadership" element={<LeadershipPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* ═══ 404 ═══ */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        {!isAdminRoute && <Footer />}
      </div>
    </SettingsProvider>
  );
}

export default App;