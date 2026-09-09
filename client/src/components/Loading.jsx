import React from 'react';
import { motion } from 'framer-motion';

const logo = '/logo.png';

const Loading = ({ message = 'Φόρτωση...', full = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="relative"
      >
        <div className="h-16 w-16 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
        <img 
          src={logo} 
          alt="Loading" 
          className="absolute inset-0 h-10 w-10 m-auto rounded-full object-contain bg-white p-1"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm font-medium text-slate-600 text-center max-w-xs"
      >
        {message}
      </motion.p>
      <div className="flex items-center gap-1">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="h-2 w-2 rounded-full bg-brand-500"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          className="h-2 w-2 rounded-full bg-brand-500"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          className="h-2 w-2 rounded-full bg-brand-500"
        />
      </div>
    </div>
  );

  if (full) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-cyan-50">
        <div className="relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-2xl backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <img 
              src={logo} 
              alt="Σύλλογος Κέντρου Υγείας" 
              className="mx-auto h-20 w-auto rounded-2xl object-contain shadow-md" 
            />
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Σύλλογος Κέντρου Υγείας</h2>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="h-3 w-3 rounded-full bg-brand-600"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                className="h-3 w-3 rounded-full bg-brand-500"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                className="h-3 w-3 rounded-full bg-brand-400"
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;