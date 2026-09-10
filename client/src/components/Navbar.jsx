import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const logo = '/logo.png';

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

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 lg:py-3">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src={logo} 
              alt="Σύλλογος Κέντρου Υγείας" 
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[80px] rounded-xl object-contain shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
            <div className="block min-w-0">
              <h1 className="text-[10px] sm:text-xs font-extrabold text-slate-900 leading-tight tracking-tight">
                <span className="block truncate">ΣΥΛΛΟΓΟΣ ΦΙΛΩΝ ΣΤΗΡΙΞΗΣ ΚΕΝΤΡΟΥ</span>
                <span className="block text-[9px] sm:text-[11px] font-bold text-slate-800 truncate">ΥΓΕΙΑΣ ΤΡΟΠΑΙΩΝ ΔΥΤΙΚΗΣ ΓΟΡΤΥΝΙΑΣ</span>
              </h1>
              <p className="club-subtitle text-[9px] sm:text-[10px] md:text-[12px] text-emerald-600 mt-0.5 tracking-widest font-bold">
                ΕΛΠΙΔΑ ΖΩΗΣ
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            open ? 'max-h-96 py-4 border-t border-slate-200' : 'max-h-0'
          }`}
        >
          <ul className="flex flex-col gap-1">
            {links.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;