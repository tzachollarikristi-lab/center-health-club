import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO = '/logo.png';

const links = [
  { label: 'Αρχική', to: '/' },
  { label: 'Ανακοινώσεις', to: '/announcements' },
  { label: 'Έγγραφα', to: '/documents' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Σχετικά', to: '/about' },
  { label: 'Επικοινωνία', to: '/contact' },
  { label: 'Δωρεά', to: '/donate' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-2.5 lg:py-3">

          {/* ─── Logo + Brand ──────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src={LOGO}
              alt="ΕΛΠΙΔΑ ΖΩΗΣ"
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[80px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="block min-w-0">
              <h1 className="text-[10px] sm:text-xs font-extrabold text-slate-900 leading-tight tracking-tight">
                <span className="block truncate">ΣΥΛΛΟΓΟΣ ΦΙΛΩΝ ΣΤΗΡΙΞΗΣ ΚΕΝΤΡΟΥ</span>
                <span className="block text-[9px] sm:text-[11px] font-bold text-slate-800 truncate">
                  ΥΓΕΙΑΣ ΤΡΟΠΑΙΩΝ ΔΥΤΙΚΗΣ ΓΟΡΤΥΝΙΑΣ
                </span>
              </h1>
              <p className="club-subtitle text-[9px] sm:text-[10px] md:text-[12px] text-brand-600 mt-0.5 tracking-widest font-bold">
                ΕΛΠΙΔΑ ΖΩΗΣ
              </p>
            </div>
          </Link>

          {/* ─── Desktop Navigation — pill container, pushed right ─── */}
          <nav className="hidden lg:flex items-center ml-auto">
            <div className="flex items-center gap-0.5 rounded-full bg-white/70 backdrop-blur-sm border border-slate-900/8 p-1 shadow-sm">
              {links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* ─── Mobile menu button ─────────────────────── */}
          <button
            type="button"
            className="lg:hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ─── Mobile Navigation ────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-slate-200"
            >
              <ul className="flex flex-col gap-1 py-4">
                {links.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Navbar;