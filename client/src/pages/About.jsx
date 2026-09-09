import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Inline SVG Icons ─────────────────────────────────────────────
const IconTarget = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5v9.375a2.25 2.25 0 002.25 2.25h3.375m-3.375-9.375a1.5 1.5 0 00-1.5-1.5h-3.75a1.5 1.5 0 00-1.5 1.5v9.75a1.5 1.5 0 001.5 1.5h3.75a1.5 1.5 0 001.5-1.5V7.5z" />
  </svg>
);

const IconEye = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconHeart = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const IconShield = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const IconGlobe = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.728 0-5.13-1.129-6.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.98 17.98 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const IconHandshake = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M10.5 4.5l-6 6m6-6l6 6m-6-6v6m-6-6v6m12 0v6m0-6l-6-6m6 6l-6 6" />
  </svg>
);

const IconBook = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const IconEnvelope = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconSparkle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────
const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container-padded py-10 md:py-16">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Σχετικά με εμάς</h1>
          <p className="text-sm text-slate-500 mt-1">Ο Σύλλογος Κέντρου Υγείας Τροπαίων.</p>
        </div>
      </div>

      {/* ─── Mission & Vision ──────────────────────────────────────── */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="card p-6 md:p-8 bg-gradient-to-br from-white to-brand-50/20"
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <IconTarget className="h-6 w-6 text-brand-600" />
            Αποστολή μας
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Να προάγουμε την υγεία και την ευημερία της κοινότητας μέσω της ενημέρωσης, της πρόληψης και της υποστήριξης των πολιτών.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <IconCheck className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
              <span>Προσβασιμότητα στις υπηρεσίες υγείας</span>
            </li>
            <li className="flex items-start gap-2">
              <IconCheck className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
              <span>Ευαισθητοποίηση και εκπαίδευση</span>
            </li>
            <li className="flex items-start gap-2">
              <IconCheck className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
              <span>Συνεργασία με φορείς και την τοπική κοινωνία</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="card p-6 md:p-8 bg-gradient-to-br from-white to-cyan-50/20"
        >
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <IconEye className="h-6 w-6 text-cyan-600" />
            Όραμα 2031
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Μέχρι το 2031, ο Σύλλογός μας θα έχει γίνει το κέντρο αναφοράς για την υγεία στην περιοχή, προσφέροντας:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <IconSparkle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Μια πλήρως ψηφιακή πλατφόρμα ενημέρωσης</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSparkle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Δίκτυο συνεργαζόμενων ιατρών και εθελοντών</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSparkle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Ετήσιες εκδηλώσεις πρόληψης και ευαισθητοποίησης</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSparkle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Υποστήριξη για άτομα με χρόνιες παθήσεις</span>
            </li>
            <li className="flex items-start gap-2">
              <IconSparkle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Συνεργασία με σχολεία και τοπικούς φορείς</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* ─── Core Values ────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Οι αξίες μας</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Ανθρωπιά', icon: IconHeart },
            { label: 'Αξιοπιστία', icon: IconShield },
            { label: 'Προσβασιμότητα', icon: IconGlobe },
            { label: 'Συνεργασία', icon: IconHandshake },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <value.icon className="h-8 w-8 mx-auto text-brand-500 mb-2" />
              <p className="font-semibold text-slate-800">{value.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── History ────────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="card p-6 md:p-8 mb-12 bg-white/70 backdrop-blur-sm"
      >
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <IconBook className="h-6 w-6 text-brand-600" />
          Η ιστορία μας
        </h2>
        <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
          <p>
            Ο Σύλλογος Κέντρου Υγείας Τροπαίων ιδρύθηκε με σκοπό να στηρίξει την τοπική κοινότητα στον τομέα της υγείας.
            Ξεκινώντας ως μια μικρή ομάδα εθελοντών, εξελίχθηκε σε έναν αναγνωρίσιμο φορέα που παρέχει ενημέρωση, οργανώνει δράσεις
            και συνεργάζεται με επαγγελματίες υγείας.
          </p>
          <p>
            Σήμερα, ο Σύλλογος συνεχίζει να εργάζεται με όραμα την πρόληψη και την υποστήριξη, προσαρμοζόμενος στις σύγχρονες ανάγκες
            και αξιοποιώντας την τεχνολογία για την καλύτερη εξυπηρέτηση των πολιτών.
          </p>
        </div>
      </motion.div>

      {/* ─── Contact CTA ────────────────────────────────────────────── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mt-12 text-center"
      >
        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
          <IconEnvelope className="h-4 w-4 text-slate-400" />
          Θέλετε να μάθετε περισσότερα ή να συμμετάσχετε;{' '}
          <Link to="/contact" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
            Επικοινωνήστε μαζί μας
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default About;