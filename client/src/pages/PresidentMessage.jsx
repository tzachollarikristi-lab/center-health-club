import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const PresidentMessage = () => {
  const { settings } = useSettings();

  const message = settings?.president_message || 'Η υγεία είναι θεμέλιο της κοινωνίας μας. Στόχος μας είναι να δημιουργούμε χώρο ασφαλή, ανθρώπινο και ανοιχτό σε όλους, με γνώση, στήριξη και κοινή δράση.';
  const name = settings?.president_name || 'Ο Πρόεδρος του Συλλόγου';
  const title = settings?.president_title || 'Πρόεδρος';

  return (
    <div className="container-padded py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-brand-700 hover:text-brand-800 mb-6">
          ← Επιστροφή στην αρχική
        </Link>

        <div className="card p-6 md:p-10 shadow-lg border border-slate-200">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold uppercase tracking-wider">
              Μήνυμα Προέδρου
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900">{name}</h1>
            <p className="mt-2 text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-8 text-slate-700 whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresidentMessage;
