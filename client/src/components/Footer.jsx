import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const LOGO = '/logo.png';

// ─── Icons ────────────────────────────────────────────────────────
const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const PinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 8.5c0-.8.6-1.5 1.4-1.5h2.1V3.5h-2.1C12.4 3.5 10.8 5.1 10.8 7.2V9h-1.8v2.5H10.8V20h2.8v-8.5h2.1L15.9 9h-2.4V8.5Z" />
  </svg>
);
const ArrowUpRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);
const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);

function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const siteName = settings?.site_name || 'Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων';
  const phone = settings?.support_phone || '+30 22310 12345';
  const email = settings?.contact_email || 'info@tropaiwn-hc.gr';
  const address = settings?.address || 'Κέντρο Υγείας Τροπαίων, Δυτική Γορτυνία';
  const facebook = settings?.facebook_url || '';
  const tagline = settings?.footer_text || 'Ενημερώσεις, δράσεις και στήριξη για το Κέντρο Υγείας της περιοχής μας.';

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* ─── Main content ─────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10">

          {/* ─── Brand — 5 cols ─────────────────────── */}
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0 mb-4">
              <img
                src={LOGO}
                alt="ΕΛΠΙΔΑ ΖΩΗΣ"
                className="h-11 sm:h-12 w-auto max-w-[70px] object-contain bg-white/5 rounded-lg p-1 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="block min-w-0">
                <h3 className="text-[10px] sm:text-xs font-extrabold text-white leading-tight tracking-tight">
                  <span className="block truncate">ΣΥΛΛΟΓΟΣ ΦΙΛΩΝ ΣΤΗΡΙΞΗΣ ΚΕΝΤΡΟΥ</span>
                  <span className="block text-[9px] sm:text-[11px] font-bold text-slate-300 truncate">
                    ΥΓΕΙΑΣ ΤΡΟΠΑΙΩΝ ΔΥΤΙΚΗΣ ΓΟΡΤΥΝΙΑΣ
                  </span>
                </h3>
                <p className="club-subtitle text-[9px] sm:text-[10px] text-brand-400 mt-0.5 tracking-widest font-bold">
                  ΕΛΠΙΔΑ ΖΩΗΣ
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {tagline}
            </p>

            {facebook && (
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white hover:text-slate-900 hover:ring-white"
                >
                  <FacebookIcon className="h-3.5 w-3.5" />
                  Facebook
                  <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </div>
            )}
          </div>

          {/* ─── Επικοινωνία — 4 cols ────────────────── */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Επικοινωνία
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="group inline-flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <PhoneIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <MailIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate">{email}</span>
                </a>
              </li>
              <li>
                <div className="inline-flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400">
                    <PinIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="pt-1">{address}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* ─── Πλοήγηση — 3 cols ───────────────────── */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Πλοήγηση
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/announcements" className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                  <span className="relative">
                    Ανακοινώσεις
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/documents" className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                  <span className="relative">
                    Έγγραφα
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                  <span className="relative">
                    Gallery
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                  <span className="relative">
                    Σχετικά
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/donate" className="group inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
                  <span className="relative">
                    Δωρεά
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom bar ─────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              © {year} {siteName}
            </p>

            <div className="flex items-center gap-4">
              <Link
                to="/admin/login"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white hover:text-slate-900 hover:ring-white"
              >
                <LockIcon className="h-3 w-3" />
                Σύνδεση διαχειριστή
                <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;