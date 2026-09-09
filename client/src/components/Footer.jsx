import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const logo = '/logo.png';

function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();
  const siteName = settings?.site_name || 'Σύλλογος Κέντρου Υγείας Τροπαίων';
  const phone = settings?.support_phone || '+30 22310 12345';
  const email = settings?.contact_email || 'info@tropaiwn-hc.gr';
  const address = settings?.address || 'Κέντρο Υγείας Τροπαίων, Κεντρική Πλατεία, Τρόπαια';
  const facebook = settings?.facebook_url || '#';

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-padded py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt={siteName} className="h-8 w-auto rounded-lg bg-white/10 p-1" />
              <span className="text-sm font-semibold text-white">{siteName}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 max-w-xs">
              {settings?.footer_text || 'Ενημερώσεις και έγγραφα για την τοπική κοινότητα.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Επικοινωνία</h4>
            <ul className="mt-2 space-y-1 text-xs">
              <li>Τηλ: {phone}</li>
              <li>Email: {email}</li>
              <li>Διεύθυνση: {address}</li>
            </ul>
            <div className="mt-2">
              <a href={facebook} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>

          {/* Admin Link (only link here) */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Διαχείριση</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/admin/login" className="text-xs text-slate-400 hover:text-white transition-colors">
                  Σύνδεση Διαχειριστή
                </Link>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Τοποθεσία</h4>
            <p className="mt-2 text-xs text-slate-400">{address}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-3 text-center">
        <p className="text-[10px] text-slate-500">
          © {year} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;