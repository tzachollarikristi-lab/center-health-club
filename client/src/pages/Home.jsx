import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import Loading from '../components/Loading';
import { announcements as fallbackAnnouncements, documents as fallbackDocuments } from '../data/content';

const LOGO = '/logo.png';

// ─── Icons ────────────────────────────────────────────────────────
const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
const FileIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h6" />
  </svg>
);
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const Pin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const Phone = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
  </svg>
);
const Mail = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const Calendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const Download = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);
const Heart = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
  </svg>
);
const Quote = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9.5 4.5c-3 0-5.5 2.5-5.5 5.5v8c0 1.1.9 2 2 2h3.5c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H6.5V10c0-1.7 1.3-3 3-3V4.5zm10 0c-3 0-5.5 2.5-5.5 5.5v8c0 1.1.9 2 2 2H19.5c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-3V10c0-1.7 1.3-3 3-3V4.5z"/>
  </svg>
);
const Bank = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18M4 10h16M5 10V21M19 10V21M9 10V21M15 10V21M2 7l10-4 10 4" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Network geometry ────────────────────────────────────────────
const NET_NODES = [
  [680, 90], [820, 70], [960, 110], [1100, 80],
  [620, 200], [760, 180], [900, 210], [1040, 190], [1170, 220],
  [550, 310], [690, 290], [830, 320], [970, 300], [1110, 330],
  [620, 420], [760, 400], [900, 430], [1040, 410], [1170, 440],
  [700, 530], [840, 510], [980, 540], [1120, 520],
];
const NET_LINES = [
  [0,1],[1,2],[2,3],
  [4,5],[5,6],[6,7],[7,8],
  [9,10],[10,11],[11,12],[12,13],
  [14,15],[15,16],[16,17],[17,18],
  [19,20],[20,21],[21,22],
  [0,4],[1,5],[2,6],[3,7],
  [4,9],[5,10],[6,11],[7,12],[8,13],
  [9,14],[10,15],[11,16],[12,17],[13,18],
  [14,19],[15,20],[16,21],[17,22],
  [0,5],[1,6],[2,7],[3,8],
  [4,10],[5,11],[6,12],[7,13],
  [9,15],[10,16],[11,17],[12,18],
  [14,20],[15,21],[16,22],
];
const NET_TRIANGLES = [
  [0,1,5],[1,5,6],[1,2,6],
  [4,5,10],[5,6,11],[5,10,11],
  [9,10,15],[10,11,16],[10,15,16],
  [14,15,20],[15,16,21],[15,20,21],
  [2,6,7],[6,7,12],
  [11,12,17],
];

// ─── Home ────────────────────────────────────────────────────────
const Home = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements);
  const [documents, setDocuments] = useState(fallbackDocuments.slice(0, 3));
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState(null);

  // Refs for the two floating CTA wrappers — we mutate their transform directly
  const desktopCtaRef = useRef(null);
  const mobileCtaRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (supabase) {
          const [annRes, docRes, galRes] = await Promise.all([
            supabase.from('announcements').select('*').order('publish_date', { ascending: false }).limit(5),
            supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(3),
            supabase.from('gallery').select('id', { count: 'exact', head: true }),
          ]);
          if (!annRes.error && annRes.data?.length) setAnnouncements(annRes.data);
          if (!docRes.error && docRes.data?.length) setDocuments(docRes.data);
          if (!galRes.error && typeof galRes.count === 'number') setGalleryCount(galRes.count);
        }
      } catch (err) { console.warn(err); }
      finally { setLoading(false); }
    })();
    const s = localStorage.getItem('clubMembershipStatus');
    if (s) { try { setMembershipStatus(JSON.parse(s)); } catch {} }
  }, []);

  // ─── Scroll-aware floating CTAs (smooth, GPU-only) ─────────────
  useEffect(() => {
    let rafId = null;
    let lastPush = -1;

    const update = () => {
      rafId = null;
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const viewportH = window.innerHeight;
      const baseOffset = 20;      // desktop `bottom-5`
      const mobileBase = 0;       // mobile wrapper uses bottom-0 + padding
      const margin = 16;

      // Desktop push
      const desktopRequired = viewportH - footerTop + margin;
      const desktopPush = Math.max(0, desktopRequired - baseOffset);

      // Mobile push — mobile wrapper sits at bottom-0 with p-3 (12px), so the
      // visible pill is already ~12px from the bottom.
      const mobileRequired = viewportH - footerTop + margin;
      const mobilePush = Math.max(0, mobileRequired - mobileBase);

      // Skip DOM write if nothing changed
      if (desktopPush === lastPush) return;
      lastPush = desktopPush;

      if (desktopCtaRef.current) {
        desktopCtaRef.current.style.transform = `translate3d(0, ${-desktopPush}px, 0)`;
      }
      if (mobileCtaRef.current) {
        mobileCtaRef.current.style.transform = `translate3d(0, ${-mobilePush}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const fmt = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return '';
    return dt.toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const truncate = (text, max = 60) => (text && text.length > max ? text.slice(0, max) + '...' : text || '');

  const scrollToAnnouncements = () => {
    document.getElementById('announcements-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading || settingsLoading) return <Loading full message="Φόρτωση..." />;

  const featured = announcements.find(a => a.pinned) || announcements[0] || null;
  const recent = announcements.filter(a => a !== featured).slice(0, 3);
  const isMember = membershipStatus?.status === 'member';
  const isPending = membershipStatus?.status === 'pending';
  const ctaLabel = isMember ? 'Είστε μέλος' : isPending ? 'Σε αναμονή' : 'Εγγραφή μέλους';

  const messagePreview = settings?.president_message
    ? settings.president_message.slice(0, 200) + (settings.president_message.length > 200 ? '…' : '')
    : 'Η διοίκηση του συλλόγου εργάζεται καθημερινά για τα μέλη και την κοινότητα.';

  const stats = [
    { n: announcements.length + '+', l: 'Ανακοινώσεις' },
    { n: documents.length + '+', l: 'Έγγραφα' },
    { n: galleryCount + '+', l: 'Φωτογραφίες' },
    { n: '10€', l: 'Συνδρομή' },
  ];

  return (
    <div className="bg-[#faf8f4] text-slate-900">

      <style>{`
        @keyframes bg-pan-slow {
          0%   { transform: translate3d(0, 0, 0) scale(1.02); }
          50%  { transform: translate3d(-3%, -2%, 0) scale(1.06); }
          100% { transform: translate3d(0, 0, 0) scale(1.02); }
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.95; }
        }
        .net-pan-1 { animation: bg-pan-slow 60s ease-in-out infinite; will-change: transform; }
        .net-dots-pulse circle:nth-child(3n) { animation: dot-pulse 6s ease-in-out infinite; animation-delay: 1.5s; }
        .net-dots-pulse circle:nth-child(3n+1) { animation: dot-pulse 6s ease-in-out infinite; animation-delay: 3s; }
        .floating-cta { will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .net-pan-1, .net-dots-pulse circle { animation: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          FLOATING JOIN CTA — desktop
      ══════════════════════════════════════════════════ */}
      <div
        ref={desktopCtaRef}
        className="floating-cta hidden md:block fixed right-5 bottom-5 z-40"
      >
        <Link
          to="/join"
          className="group flex items-center gap-3 rounded-full bg-slate-900 pl-1.5 pr-5 py-1.5 text-white transition-colors hover:bg-brand-600"
          style={{ boxShadow: '0 16px 40px -12px rgba(15, 23, 42, 0.5)' }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <UserIcon className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight text-left">
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/70">
              {isMember ? 'Μέλος' : isPending ? 'Σε αναμονή' : 'Γίνετε μέλος'}
            </span>
            <span className="text-xs font-semibold">{ctaLabel}</span>
          </span>
        </Link>
      </div>

      {/* Mobile bottom CTA */}
      <div
        ref={mobileCtaRef}
        className="floating-cta md:hidden fixed inset-x-0 bottom-0 z-40 p-3 pointer-events-none"
      >
        <Link
          to="/join"
          className="pointer-events-auto flex items-center justify-between gap-3 rounded-full bg-slate-900 pl-2 pr-5 py-2 text-white transition-colors active:scale-[0.98]"
          style={{ boxShadow: '0 16px 40px -12px rgba(15, 23, 42, 0.5)' }}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <UserIcon className="h-4 w-4" />
            </span>
            <span className="flex flex-col leading-tight text-left">
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/70">
                {isMember ? 'Μέλος' : isPending ? 'Σε αναμονή' : 'Γίνετε μέλος'}
              </span>
              <span className="text-xs font-semibold">{ctaLabel}</span>
            </span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(135deg, #fdfdfc 0%, #f6f9fc 45%, #eaf0f7 100%)',
        }} />

        <div
          className="absolute top-0 right-0 left-0 w-full lg:left-[12%] lg:w-[88%] bottom-0 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 30%, black 60%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 30%, black 60%, black 100%)',
          }}
        >
          <div className="net-pan-1 w-full h-full">
            <svg
              viewBox="0 0 1200 600"
              preserveAspectRatio="xMaxYMid slice"
              className="w-full h-full"
              aria-hidden="true"
            >
              <g fill="#cbd5e1" fillOpacity="0.32">
                {NET_TRIANGLES.map(([a, b, c], i) => (
                  <polygon
                    key={i}
                    points={`${NET_NODES[a][0]},${NET_NODES[a][1]} ${NET_NODES[b][0]},${NET_NODES[b][1]} ${NET_NODES[c][0]},${NET_NODES[c][1]}`}
                  />
                ))}
              </g>

              <g stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round">
                {NET_LINES.map(([a, b], i) => (
                  <line
                    key={i}
                    x1={NET_NODES[a][0]} y1={NET_NODES[a][1]}
                    x2={NET_NODES[b][0]} y2={NET_NODES[b][1]}
                  />
                ))}
              </g>

              <g fill="#1e293b" fillOpacity="0.75" className="net-dots-pulse">
                {NET_NODES.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3.5 : i % 3 === 0 ? 3 : 2.5} />
                ))}
              </g>

              <g fill="#0f172a" fillOpacity="0.9">
                <circle cx={NET_NODES[2][0]} cy={NET_NODES[2][1]} r="3.5" />
                <circle cx={NET_NODES[6][0]} cy={NET_NODES[6][1]} r="3.5" />
                <circle cx={NET_NODES[11][0]} cy={NET_NODES[11][1]} r="3.5" />
                <circle cx={NET_NODES[16][0]} cy={NET_NODES[16][1]} r="3.5" />
              </g>
            </svg>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-20 md:h-28 z-[6] pointer-events-none" style={{
          background: 'linear-gradient(to bottom, #faf8f4 0%, rgba(250,248,244,0.75) 45%, rgba(250,248,244,0) 100%)',
        }} />

        <div className="absolute bottom-0 left-0 right-0 h-44 md:h-60 z-[6] pointer-events-none" style={{
          background: 'linear-gradient(to top, #faf8f4 0%, rgba(250,248,244,0.95) 30%, rgba(250,248,244,0.75) 55%, rgba(250,248,244,0.35) 80%, rgba(250,248,244,0) 100%)',
        }} />

        <div className="container-padded relative z-10 py-12 md:py-20 lg:py-24">

          {/* MOBILE */}
          <div className="lg:hidden">
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              src={LOGO}
              alt="ΕΛΠΙΔΑ ΖΩΗΣ"
              className="float-right ml-4 mt-1 w-[130px] sm:w-[160px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-900/60 mb-4"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Ενεργή κοινότητα
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-display text-[clamp(1.75rem,8.5vw,2.75rem)] leading-[1.02] tracking-[-0.03em] text-slate-900"
            >
              Ελπίδα
              <br />
              <span className="italic font-normal text-brand-600">ζωής</span>
              {' '}για τη Δυτική Γορτυνία.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-[13px] text-slate-900/70 leading-relaxed"
            >
              Στηρίζουμε το Κέντρο Υγείας Τροπαίων με δράσεις, ενημέρωση και συνεχείς διεκδικήσεις για καλύτερες υπηρεσίες υγείας.
            </motion.p>

            <div className="clear-both" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 flex flex-row items-center gap-2.5"
            >
              <button
                type="button"
                onClick={scrollToAnnouncements}
                className="group inline-flex items-center gap-2 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all active:scale-[0.98]"
              >
                <span className="text-xs font-semibold tracking-wide">Ανακοινώσεις</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <ArrowRight className="h-3 w-3 rotate-90" />
                </span>
              </button>

              <Link
                to="/gallery"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-white/60 backdrop-blur-sm pl-4 pr-1.5 py-1.5 text-slate-900 transition-all active:scale-[0.98]"
              >
                <span className="text-xs font-semibold tracking-wide">Gallery</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/5">
                  <ArrowRight className="h-3 w-3 -rotate-45" />
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-4 gap-2 border-t border-slate-900/10 pt-5 mt-8"
            >
              {stats.map((s, i) => (
                <motion.div key={s.l} variants={fadeUp} custom={i} className="text-center">
                  <p className="font-display text-lg leading-none text-slate-900">{s.n}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-slate-900/50">{s.l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:block">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-900/60"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Ενεργή κοινότητα
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.98] tracking-[-0.03em] text-slate-900"
                >
                  Ελπίδα
                  <br />
                  <span className="italic font-normal text-brand-600">ζωής</span>
                  {' '}για τη
                  <br />
                  Δυτική Γορτυνία.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-7 text-base text-slate-900/70 leading-relaxed max-w-lg"
                >
                  Στηρίζουμε το Κέντρο Υγείας Τροπαίων με δράσεις, ενημέρωση και συνεχείς διεκδικήσεις για καλύτερες υπηρεσίες υγείας σε κάθε κάτοικο της περιοχής.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-10 flex flex-row items-center gap-3"
                >
                  <button
                    type="button"
                    onClick={scrollToAnnouncements}
                    className="group inline-flex items-center gap-3 rounded-full bg-slate-900 pl-6 pr-2 py-2 text-white transition-all hover:bg-brand-600"
                  >
                    <span className="text-sm font-semibold tracking-wide">Ανακοινώσεις</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-90">
                      <ArrowRight className="h-4 w-4 rotate-90" />
                    </span>
                  </button>

                  <Link
                    to="/gallery"
                    className="group inline-flex items-center gap-3 rounded-full border border-slate-900/15 bg-white/60 backdrop-blur-sm pl-6 pr-2 py-2 text-slate-900 transition-all hover:bg-white"
                  >
                    <span className="text-sm font-semibold tracking-wide">Gallery</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 transition-all duration-300 group-hover:bg-slate-900/10 group-hover:-rotate-45">
                      <ArrowRight className="h-4 w-4 -rotate-45 text-slate-900" />
                    </span>
                  </Link>
                </motion.div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center">
                <motion.img
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  src={LOGO}
                  alt="ΕΛΠΙΔΑ ΖΩΗΣ"
                  className="w-full max-w-[380px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(15,23,42,0.15)]"
                />
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-4 gap-6 border-t border-slate-900/10 pt-8 mt-20"
            >
              {stats.map((s, i) => (
                <motion.div key={s.l} variants={fadeUp} custom={i} className="text-center">
                  <p className="font-display text-4xl leading-none text-slate-900">{s.n}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-900/50">{s.l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* MESSAGE + DONATE */}
      <section className="pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
          >
            <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch max-w-5xl mx-auto">
              <Link to="/club-management" className="group md:col-span-2 block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50/70 via-white to-amber-50/40 border border-slate-200/60 p-5 md:p-7 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <Quote className="absolute -top-2 left-3 h-12 w-12 md:h-16 md:w-16 text-brand-500/10" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center gap-2.5 mb-3 md:mb-4">
                      <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-sm">
                        <Mail className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
                        Μήνυμα Διοικητικού Συμβουλίου
                      </p>
                    </div>
                    <p className="font-display text-sm md:text-base leading-[1.6] text-slate-700 italic flex-1">
                      {messagePreview}
                    </p>
                    <div className="mt-4 md:mt-5 pt-3.5 md:pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3">
                      <p className="text-xs md:text-sm font-semibold text-slate-800">
                        {settings?.president_name || 'Διοικητικό Συμβούλιο'}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-brand-700">
                        Διαβάστε
                        <ArrowRight className="h-3 w-3 md:h-3.5 md:w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/donate" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-cyan-600 p-5 md:p-6 text-white transition-all hover:shadow-xl hover:-translate-y-0.5 flex flex-col">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                  <div className="relative flex flex-col h-full">
                    <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Heart className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <p className="mt-4 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      Υποστήριξη
                    </p>
                    <h3 className="mt-1.5 font-display text-base md:text-lg leading-tight text-white">
                      Στηρίξτε τον σύλλογο
                    </h3>
                    <p className="mt-2 text-xs md:text-[13px] text-white/85 leading-relaxed flex-1">
                      Κάθε δωρεά δυναμώνει τη φωνή μας για καλύτερες υπηρεσίες υγείας.
                    </p>
                    <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white">
                        <Bank className="h-3.5 w-3.5" />
                        Δωρεά
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {featured && (
        <section id="announcements-section" className="pb-16 md:pb-20 scroll-mt-24">
          <div className="container-padded">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between mb-8 md:mb-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Τελευταία νέα
                  </p>
                  <h2 className="mt-2 font-display text-2xl md:text-4xl text-slate-900 leading-tight">
                    Πρόσφατες ανακοινώσεις
                  </h2>
                </div>
                <Link
                  to="/announcements"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
                >
                  Όλες
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="grid gap-5 md:gap-6">
                <motion.div variants={fadeUp} custom={1}>
                  <Link
                    to="/announcements"
                    className="group block overflow-hidden rounded-3xl border border-slate-200/60 p-6 md:p-8 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #fdfdfc 0%, #f4f9fd 60%, #eaf2fb 100%)',
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="badge badge-neutral">{featured.category || 'Γενικό'}</span>
                          {featured.pinned && <span className="badge badge-gold">⭐ Κορυφαία</span>}
                        </div>
                        <h3 className="font-display text-xl md:text-2xl text-slate-900 leading-tight group-hover:text-brand-700 transition-colors">
                          {featured.title}
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {featured.description}
                        </p>
                        {featured.summary && (
                          <p className="mt-2 text-xs text-slate-500">{featured.summary}</p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {fmt(featured.publish_date || featured.created_at)}
                        </div>
                      </div>
                      {featured.images && featured.images.length > 0 && (
                        <div className="shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/70 shadow-sm">
                          <img
                            src={featured.images[0]}
                            alt={featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>

                {recent.length > 0 && (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                    {recent.map((item, i) => (
                      <motion.div key={item.id} variants={fadeUp} custom={i + 2}>
                        <Link
                          to="/announcements"
                          className="group block p-5 h-full rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:-translate-y-0.5"
                          style={{
                            background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)',
                          }}
                        >
                          <span className="badge badge-brand">{item.category || 'Γενικό'}</span>
                          <h4 className="mt-3 font-display text-base md:text-lg text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                            {truncate(item.description, 60)}
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {fmt(item.publish_date || item.created_at)}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:hidden mt-6 text-center">
                <Link to="/announcements" className="btn btn-md btn-secondary inline-flex justify-center">
                  Όλες οι ανακοινώσεις
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* DOCUMENTS */}
      {documents.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container-padded">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between mb-8 md:mb-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Πόροι
                  </p>
                  <h2 className="mt-2 font-display text-2xl md:text-4xl text-slate-900 leading-tight">
                    Χρήσιμα αρχεία
                  </h2>
                </div>
                <Link
                  to="/documents"
                  className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
                >
                  Όλα
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {documents.map((doc, i) => (
                  <motion.div key={doc.id} variants={fadeUp} custom={i} className="h-full">
                    <div className="group flex h-full flex-col rounded-3xl border border-slate-200/60 p-5 md:p-6 transition-all hover:shadow-xl hover:-translate-y-0.5"
                         style={{
                           background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)',
                         }}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
                          <span className="text-[10px] font-black tracking-[0.12em]">PDF</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">{doc.title}</h3>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {fmt(doc.created_at)}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3.5 text-sm text-slate-600 flex-1 line-clamp-2">
                        {doc.description || 'Περιγραφή αρχείου'}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-full bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                        >
                          Προεπισκόπηση
                        </a>
                        <a
                          href={doc.file_path}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50"
                          title="Λήψη"
                          onClick={(e) => {
                            e.preventDefault();
                            const link = document.createElement('a');
                            link.href = doc.file_path;
                            link.target = '_blank';
                            link.rel = 'noopener noreferrer';
                            link.download = doc.title || 'document.pdf';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="md:hidden mt-6 text-center">
                <Link to="/documents" className="btn btn-md btn-secondary inline-flex justify-center">
                  Όλα τα έγγραφα
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="pb-16 md:pb-20">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
          >
            <div className="rounded-3xl p-8 md:p-12 text-center text-white shadow-xl overflow-hidden relative"
                 style={{ background: 'linear-gradient(135deg, #1a6fd9 0%, #06b6d4 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }} />
              <div className="relative max-w-2xl mx-auto">
                <h2 className="font-display text-2xl md:text-4xl leading-tight">
                  Μείνετε συντονισμένοι
                </h2>
                <p className="mt-3 text-sm md:text-base text-white/85 leading-relaxed">
                  Ενημερωθείτε για νέες ανακοινώσεις, δράσεις και πρωτοβουλίες του συλλόγου.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToAnnouncements}
                    className="btn btn-md bg-white text-brand-700 hover:bg-slate-50 justify-center"
                  >
                    Δείτε ανακοινώσεις
                  </button>
                  <Link to="/contact" className="btn btn-md border border-white/40 text-white hover:bg-white/10 justify-center">
                    Επικοινωνήστε
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HEALTH CENTER + MAP */}
      <section className="pb-24 md:pb-28">
        <div className="container-padded">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeUp}
          >
            <div className="grid md:grid-cols-10 gap-4 md:gap-5 items-stretch">

              <div className="md:col-span-7 rounded-3xl border border-slate-200/60 p-6 md:p-8 flex flex-col"
                   style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
                <div className="flex items-start gap-3">
                  <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Pin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                      Το κέντρο μας
                    </p>
                    <h3 className="mt-1.5 font-display text-lg md:text-2xl text-slate-900 leading-tight">
                      Κέντρο Υγείας Τροπαίων
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  Σημείο αναφοράς για την υγεία της Δυτικής Γορτυνίας. Διεκδικούμε σύγχρονες
                  υπηρεσίες, σταθερό προσωπικό και εξοπλισμό για όλους τους κατοίκους.
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Τρέχουσες ανάγκες
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Εξοπλισμός εργαστηρίου
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Προσωπικό για πρωινά ιατρεία
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        Βελτιώσεις προσβασιμότητας
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-cyan-50/60 border border-cyan-100 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                      Στόχοι αναβάθμισης
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        Μονάδα & τηλεϊατρική
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        Κινητές μονάδες ελέγχου
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                        Συνεργασίες νοσοκομείων
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-5 flex flex-wrap items-center gap-3">
                  <Link to="/about" className="btn btn-sm btn-secondary justify-center">
                    Περισσότερα
                  </Link>
                  <Link to="/donate" className="btn btn-sm btn-primary justify-center group">
                    <Heart className="h-3.5 w-3.5" />
                    Υποστηρίξτε
                  </Link>
                </div>
              </div>

              <div className="md:col-span-3 rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col"
                   style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
                <div className="p-4 flex-shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                    Τοποθεσία
                  </p>
                  <h3 className="mt-1 font-display text-base text-slate-900 leading-tight">
                    Βρείτε μας
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {settings?.address || 'Κέντρο Υγείας Τροπαίων'}
                  </p>
                </div>
                <div className="flex-1 min-h-[200px] md:min-h-0 bg-slate-100">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(settings?.address || 'Κέντρο Υγείας Τροπαίων')}&output=embed`}
                    title="Χάρτης"
                    loading="lazy"
                    className="h-full w-full border-0"
                  />
                </div>
                {settings?.map_link && (
                  <div className="p-3 border-t border-slate-100 flex-shrink-0">
                    <a
                      href={settings.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      <Pin className="h-3 w-3" />
                      Οδηγίες
                    </a>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;