import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDashboardData } from '../services/adminService';
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';

// Icons
const IconBell = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.3 21a2 2 0 003.4 0" /></svg>);
const IconUsers = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>);
const IconDoc = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>);
const IconImage = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const IconArrowRight = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 5l7 7-7 7" /></svg>);
const IconHeart = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /></svg>);

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function Overview() {
  const { admin, logout } = useOutletContext();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => setData(res))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) {
    return (
      <div className="space-y-5 md:space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded-full bg-slate-200/60" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl md:rounded-3xl bg-slate-200/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          <div className="lg:col-span-2 h-72 rounded-2xl md:rounded-3xl bg-slate-200/50" />
          <div className="h-72 rounded-2xl md:rounded-3xl bg-slate-200/50" />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const { counts, recentAnnouncements } = data;

  const statCards = [
    { label: 'Ανακοινώσεις', value: counts.announcements, icon: IconDoc, color: 'text-brand-600', bg: 'bg-brand-50', link: '/admin/announcements' },
    { label: 'Μέλη', value: counts.members, icon: IconUsers, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/members' },
    { label: 'Μηνύματα', value: counts.messages, icon: IconBell, color: 'text-amber-600', bg: 'bg-amber-50', badge: counts.unreadMessages, link: '/admin/messages' },
    { label: 'Φωτογραφίες', value: counts.gallery, icon: IconImage, color: 'text-cyan-600', bg: 'bg-cyan-50', link: '/admin/gallery' },
  ];

  // Data for the chart
  const chartData = [
    { label: 'Ανακ.', value: counts.announcements, color: '#2563eb' },
    { label: 'Μέλη', value: counts.members, color: '#10b981' },
    { label: 'Μηνύματα', value: counts.messages, color: '#f59e0b' },
    { label: 'Φωτο.', value: counts.gallery, color: '#06b6d4' },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="space-y-5 md:space-y-6">

      {/* HEADER */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4"
      >
        <div className="min-w-0">
          <h1 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-slate-900">
            Καλώς ήρθατε, <span className="italic font-normal text-brand-600">{admin?.name || 'Διαχειριστή'}</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Γρήγορη επισκόπηση της κατάστασης.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 self-start">
          <Link
            to="/admin/announcements"
            className="group inline-flex items-center gap-2.5 rounded-full bg-slate-900 pl-4 pr-1.5 py-1.5 text-white transition-all hover:bg-brand-600 shrink-0"
          >
            <span className="text-xs font-semibold tracking-wide">Νέα Ανακοίνωση</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white/25 group-hover:rotate-[-45deg]">
              <IconArrowRight className="h-3 w-3 -rotate-45" />
            </span>
          </Link>

          {/* Mobile-only Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="lg:hidden inline-flex items-center gap-2 rounded-full border border-red-200 bg-white pl-4 pr-4 py-1.5 text-red-600 text-xs font-semibold transition-all hover:bg-red-50 active:scale-[0.97] shrink-0"
            aria-label="Αποσύνδεση"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Έξοδος
          </button>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {statCards.map((card, i) => (
          <motion.div key={i} variants={fadeUp} custom={i} className="h-full">
            <Link to={card.link} className="group block h-full">
              <div
                className="relative h-full overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/60 p-3.5 md:p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
                style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl ${card.bg} ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                    <card.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  {card.badge > 0 && (
                    <span className="bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 md:mt-4 font-display text-2xl md:text-3xl leading-none text-slate-900">{card.value}</p>
                <p className="mt-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* BOTTOM GRID */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5"
      >
        {/* Recent Activity */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 rounded-2xl md:rounded-3xl border border-slate-200/60 p-5 md:p-6"
          style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}
        >
          <div className="flex items-center justify-between gap-3 mb-4 md:mb-5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Τελευταία Νέα</p>
              <h3 className="mt-0.5 font-display text-base md:text-lg text-slate-900">Πρόσφατες Ανακοινώσεις</h3>
            </div>
            <Link to="/admin/announcements" className="text-[11px] md:text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group shrink-0">
              <span className="hidden sm:inline">Προβολή όλων</span>
              <span className="sm:hidden">Όλες</span>
              <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {recentAnnouncements.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">Δεν υπάρχουν ανακοινώσεις ακόμη.</p>
          ) : (
            <div className="space-y-1.5">
              {recentAnnouncements.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 md:p-3 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-200/60 group">
                  <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    <IconDoc className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-slate-800 truncate group-hover:text-brand-700 transition-colors">{item.title}</p>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">
                      {new Date(item.publish_date || item.created_at).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {item.pinned && <span className="badge badge-gold text-[9px] md:text-[10px] shrink-0">⭐</span>}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column: Chart + System Status */}
        <motion.div variants={fadeUp} className="space-y-4 md:space-y-5">
          
          {/* CHART CARD */}
          <div className="rounded-2xl md:rounded-3xl border border-slate-200/60 p-4 md:p-5"
               style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f6fafe 100%)' }}>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Στατιστικά</p>
              <h3 className="mt-0.5 font-display text-sm md:text-base text-slate-900">Επισκόπηση Δραστηριότητας</h3>
            </div>
            
            {/* Professional Bar Chart */}
            <div className="flex items-end justify-between h-32 gap-2 md:gap-3">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
                  <span className="text-[10px] md:text-xs font-bold text-slate-600">{d.value}</span>
                  <div className="w-full bg-slate-100/80 rounded-t-lg relative overflow-hidden flex-1 flex items-end">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-1000 ease-out" 
                      style={{ height: `${(d.value / maxVal) * 100}%`, backgroundColor: d.color }} 
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold text-slate-500 text-center leading-tight">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact System Status */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-600 to-cyan-600 p-4 text-white shadow-lg">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <IconHeart className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">Κατάσταση Συστήματος</p>
                  <p className="text-[10px] text-white/70 truncate">Όλα λειτουργούν κανονικά</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white/20 rounded-full px-2 py-1 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Online
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}