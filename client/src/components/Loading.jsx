import React from 'react';

const logo = '/logo.png';

const Loading = ({ message = 'Φόρτωση...' }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#faf8f4]">

      {/* Floating background blobs — CSS keyframes, always running */}
      <div
        className="absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl pointer-events-none"
        style={{ animation: 'blob1 14s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-cyan-200/40 blur-3xl pointer-events-none"
        style={{ animation: 'blob2 16s ease-in-out infinite' }}
      />
      <div
        className="absolute top-1/3 left-1/4 h-[280px] w-[280px] rounded-full bg-amber-100/40 blur-3xl pointer-events-none"
        style={{ animation: 'blob3 18s ease-in-out infinite' }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-600">
          Σύλλογος Φίλων Στήριξης
        </p>

        {/* Logo with breathing halo */}
        <div className="relative mt-6">
          <div
            className="absolute inset-0 rounded-full bg-brand-400 blur-3xl"
            style={{ animation: 'halo1 3s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-0 rounded-full bg-cyan-400 blur-3xl"
            style={{ animation: 'halo2 3s ease-in-out infinite 0.5s' }}
          />

          <div
            className="relative flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-[28px] bg-white shadow-[0_25px_70px_-20px_rgba(37,99,235,0.45)] ring-1 ring-slate-900/5"
            style={{ animation: 'floatLogo 3.5s ease-in-out infinite' }}
          >
            <img src={logo} alt="ΕΛΠΙΔΑ ΖΩΗΣ" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          </div>
        </div>

        {/* Brand title */}
        <h1 className="mt-8 font-display text-2xl md:text-3xl text-slate-900 tracking-[-0.02em] leading-tight">
          Κέντρο Υγείας
          <br />
          <span className="italic font-normal text-brand-600">Τροπαίων</span>
        </h1>

        <p className="club-subtitle mt-3 text-[11px] md:text-xs text-brand-500 tracking-[0.3em] font-bold">
          ΕΛΠΙΔΑ ΖΩΗΣ
        </p>

        {/* Pulsing dots */}
        <div className="mt-8 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-brand-500"
              style={{ animation: `pulseDot 1.2s ease-in-out infinite ${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="mt-4 text-xs font-medium text-slate-500">{message}</p>
      </div>

      {/* Keyframes — defined once, always available */}
      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -30px); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, 40px); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        @keyframes halo1 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.25); opacity: 0.1; }
        }
        @keyframes halo2 {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.35); opacity: 0.05; }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;