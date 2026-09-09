import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Documents from './pages/Documents';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import Page404 from './pages/Page404';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [appReady, setAppReady] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onLoad() {
      setTimeout(() => setAppReady(true), 300);
    }
    if (document.readyState === 'complete') {
      setTimeout(() => setAppReady(true), 300);
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  useEffect(() => {
    setPageLoading(true);
    const timer = window.setTimeout(() => setPageLoading(false), 300);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  if (!appReady) {
    return <Loading full message="Προετοιμασία της εμπειρίας σας..." />;
  }

  return (
    <SettingsProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
        {pageLoading && <Loading message="Φόρτωση..." />}
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </SettingsProvider>
  );
}

export default App;