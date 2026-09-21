import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

// ─── Icons ────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const ArrowRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const TargetIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);
const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const HeartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
  </svg>
);
const ShieldIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    <path d="M9.5 12l2 2 3.5-3.5" />
  </svg>
);
const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const GlobeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>
);
const HandshakeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 17l-3-3 3-3M6 11l3-3 3 3M13 7l3 3-3 3M18 11l-3 3-3-3M2 12l4 4h3l3 3 3-3h3l4-4" />
  </svg>
);
const BookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);
const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Board roles in order ────────────────────────────────────────
const BOARD_ROLES = ['Πρόεδρος', 'Αντιπρόεδρος', 'Γραμματέας', 'Ταμίας', 'Μέλος'];
const ROLE_ORDER = Object.fromEntries(BOARD_ROLES.map((r, i) => [r, i]));

// ─── Format phone for display and tel: ───────────────────────────
const formatPhone = (raw) => {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return String(raw);
};
const telHref = (raw) => {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';
  // Greece country code
  return digits.startsWith('30') ? `tel:+${digits}` : `tel:+30${digits}`;
};

// ─── About ───────────────────────────────────────────────────────
const About = () => {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingMembers(true);
      try {
        if (!supabase) {
          if (!cancelled) setMembers([]);
          return;
        }

        // Fetch ONLY board members — never regular members
        const { data, error } = await supabase
          .from('club_members')
          .select('id, name, role, phone, sort_order')
          .in('role', BOARD_ROLES)
          .order('sort_order', { ascending: true })
          .limit(5);

        if (cancelled) return;
        if (error) throw error;

        const sorted = (data || [])
          .sort((a, b) => (ROLE_ORDER[a.role] ?? 99) - (ROLE_ORDER[b.role] ?? 99))
          .slice(0, 5);

        setMembers(sorted);
      } catch (err) {
        if (!cancelled) {
          console.warn('Could not load board members:', err);
          setMembers([]);
        }
      } finally {
        if (!cancelled) setLoadingMembers(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const values = [
    { icon: HeartIcon, label: 'Ανθρωπιά', desc: 'Με σεβασμό σε κάθε άνθρωπο' },
    { icon: ShieldIcon, label: 'Αξιοπιστία', desc: 'Συνέπεια και διαφάνεια' },
    { icon: GlobeIcon, label: 'Προσβασιμότητα', desc: 'Υγεία για όλους' },
    { icon: HandshakeIcon, label: 'Συνεργασία', desc: 'Μαζί πετυχαίνουμε περισσότερα' },
  ];

  return (
    <SEO title="Σχετικά" description="Μάθετε για τον Σύλλογο Φίλων Στήριξης Κέντρου Υγείας Τροπαίων — ιστορία, αξίες και διοίκηση." url="/about" />,

    <div className="bg-[#faf8f4] text-slate-900 min-h-screen">

      {/* ══════════════════════════════════════════════════
          PAGE HEADER — no headline
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-slate-900/8">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, #fdfdfc 0%, #f4f9fd 45%, #eaf0f7 100%)',
        }} />
        <div
          className="absolute -top-32 right-1/4 h-[280px] w-[380px] rounded-full opacity-[0.1] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }}
        />

        <div className="container-padded relative z-10 pt-8 pb-8 md:pt-10 md:pb-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors mb-4"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Πίσω στην αρχική
            </Link>

            <p className="text-sm text-slate-500 max-w-2xl">
              Ο Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων «ΕΛΠΙΔΑ ΖΩΗΣ».
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MISSION + VISION
      ══════════════════════════════════════════════════ */}
      <section className="pt-10 md:pt-14 pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-4 md:gap-5"
          >
            {/* Mission */}
            <motion.div variants={fadeUp}>
              <div
                className="relative h-full overflow-hidden rounded-2xl border border-slate-200/60 p-6 md:p-8"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <TargetIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                      Σκοπός μας
                    </p>
                    <h2 className="font-display text-lg md:text-xl text-slate-900 leading-tight">
                      Αποστολή
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Να προάγουμε την υγεία και την ευημερία της κοινότητας μέσω της ενημέρωσης,
                  της πρόληψης, της κοινωνικής στήριξης και της ενεργής συμμετοχής των πολιτών.
                </p>

                <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                  {[
                    'Διασφάλιση πρόσβασης σε ποιοτικές υπηρεσίες υγείας',
                    'Ενημέρωση, πρόληψη και ευαισθητοποίηση',
                    'Συνεργασία με φορείς, επαγγελματίες και κατοίκους',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div variants={fadeUp}>
              <div
                className="relative h-full overflow-hidden rounded-2xl border border-slate-200/60 p-6 md:p-8"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                    <EyeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      Πού πάμε
                    </p>
                    <h2 className="font-display text-lg md:text-xl text-slate-900 leading-tight">
                      Όραμα
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Το όραμα του Συλλόγου «ΕΛΠΙΔΑ ΖΩΗΣ» είναι μια Δυτική Γορτυνία που δεν θα
                  αισθάνεται ξεχασμένη και απομονωμένη, αλλά θα έχει ασφάλεια, αξιοπρέπεια,
                  προοπτική και μέλλον.
                </p>

                <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                  {[
                    'Σύγχρονο, λειτουργικό Κέντρο Υγείας για την περιοχή',
                    'Ενωμένη, ενεργή και συνεργατική κοινότητα',
                    'Μια περιοχή όπου αξίζει να ζει κανείς',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOARD OF DIRECTORS — with phone numbers
      ══════════════════════════════════════════════════ */}
      <section className="pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              Διοικητικό Συμβούλιο
            </span>
            <span className="h-px flex-1 bg-slate-900/10" />
          </motion.div>

          {loadingMembers ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl border border-slate-200/60 bg-white animate-pulse"
                />
              ))}
            </div>
          ) : members.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
            >
              {members.map((m, i) => {
                const isPresident = m.role === 'Πρόεδρος';
                const initial = (m.name || '?').charAt(0).toUpperCase();
                const phoneDisplay = formatPhone(m.phone);
                const phoneLink = telHref(m.phone);
                return (
                  <motion.div key={m.id} variants={fadeUp} custom={i}>
                    <div
                      className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/60 p-5 text-center transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
                      style={{
                        background: isPresident
                          ? 'linear-gradient(160deg, #ffffff 0%, #eff6ff 100%)'
                          : 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)',
                      }}
                    >
                      {/* Avatar */}
                      <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 text-white text-xl md:text-2xl font-display font-bold shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
                        {initial}
                      </div>

                      {/* Name */}
                      <p className="mt-3.5 font-display text-sm md:text-base text-slate-900 leading-tight line-clamp-2">
                        {m.name}
                      </p>

                      {/* Role */}
                      <div className="mt-2 flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                            isPresident
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isPresident && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                          )}
                          {m.role}
                        </span>
                      </div>

                      {/* Phone */}
                      {phoneDisplay && (
                        <div className="mt-3 pt-3 border-t border-slate-200/70 flex-1 flex items-end justify-center">
                          <a
                            href={phoneLink}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isPresident
                                ? 'text-brand-700 hover:text-brand-800'
                                : 'text-slate-600 hover:text-brand-600'
                            }`}
                          >
                            <PhoneIcon className="h-3 w-3 shrink-0" />
                            <span className="tabular-nums">{phoneDisplay}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200/60 p-10 text-center"
              style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <UsersIcon className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">
                Τα μέλη της διοίκησης θα ανακοινωθούν σύντομα.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════════════ */}
      <section className="pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              Οι αξίες μας
            </span>
            <span className="h-px flex-1 bg-slate-900/10" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <div
                  className="group h-full rounded-2xl border border-slate-200/60 p-5 text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
                >
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <p className="font-display text-sm md:text-base text-slate-900 leading-tight">
                    {v.label}
                  </p>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HISTORY
      ══════════════════════════════════════════════════ */}
      <section className="pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
            className="rounded-2xl border border-slate-200/60 p-6 md:p-10 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <BookIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Από την ίδρυση
                </p>
                <h2 className="font-display text-lg md:text-xl text-slate-900 leading-tight">
                  Η ιστορία μας
                </h2>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                Ο Σύλλογος Φίλων Στήριξης Κέντρου Υγείας Τροπαίων «ΕΛΠΙΔΑ ΖΩΗΣ» ιδρύθηκε με
                σκοπό να στηρίξει την τοπική κοινότητα στον τομέα της υγείας. Ξεκινώντας ως
                μια μικρή ομάδα εθελοντών, εξελίχθηκε σε έναν αναγνωρίσιμο φορέα που
                παρέχει ενημέρωση, οργανώνει δράσεις και συνεργάζεται με επαγγελματίες υγείας.
              </p>
              <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
                Σήμερα, ο Σύλλογος συνεχίζει να εργάζεται με όραμα την πρόληψη και την
                υποστήριξη, προσαρμοζόμενος στις σύγχρονες ανάγκες και αξιοποιώντας την
                τεχνολογία για την καλύτερη εξυπηρέτηση των πολιτών.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT CTA
      ══════════════════════════════════════════════════ */}
      <section className="pb-20 md:pb-24">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
          >
            <div
              className="rounded-2xl border border-slate-200/60 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <MailIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base md:text-lg text-slate-900 leading-tight">
                    Θέλετε να μάθετε περισσότερα;
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Επικοινωνήστε μαζί μας για συμμετοχή ή για περισσότερες πληροφορίες.
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-slate-900 pl-5 pr-2 py-2 text-white transition-all hover:bg-brand-600 shrink-0 w-full md:w-auto justify-between md:justify-start"
              >
                <span className="text-sm font-semibold">Επικοινωνία</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-[-45deg]">
                  <ArrowRightIcon className="h-4 w-4 -rotate-45" />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;