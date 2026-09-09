import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const ChangePasswordModal = ({ open, onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Ο νέος κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        alert('Δεν βρέθηκε χρήστης.');
        setLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
      });
      if (signInError) {
        setError('Ο τρέχων κωδικός είναι λανθασμένος.');
        setLoading(false);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;
      alert('Ο κωδικός άλλαξε επιτυχώς.');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError('Αποτυχία αλλαγής κωδικού.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const strengthLevel = strength(newPassword);
  const labels = ['Πολύ αδύναμος', 'Αδύναμος', 'Μέτριος', 'Καλός', 'Δυνατός'];

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Αλλαγή κωδικού</h2>
        <p className="mt-2 text-sm text-slate-600">
          Εισάγετε τον τρέχοντα κωδικό και τον νέο κωδικό. Θα αποσυνδεθείτε αυτόματα.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm text-slate-700">Τρέχων κωδικός</label>
          <div className="flex items-center gap-2">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Τρέχων κωδικός"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-sm text-slate-600">
              {showCurrent ? 'Hide' : 'Show'}
            </button>
          </div>

          <label className="block text-sm text-slate-700">Νέος κωδικός</label>
          <div className="flex items-center gap-2">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Νέος κωδικός"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="text-sm text-slate-600">
              {showNew ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div
              className={`h-2 rounded-full ${
                strengthLevel >= 4
                  ? 'bg-emerald-500'
                  : strengthLevel >= 3
                  ? 'bg-lime-400'
                  : strengthLevel >= 2
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
              }`}
              style={{ width: `${(strengthLevel / 4) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">Ισχύς: {labels[strengthLevel] || ''}</div>

          <label className="block text-sm text-slate-700">Επιβεβαίωση νέου κωδικού</label>
          <div className="flex items-center gap-2">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Επιβεβαίωση νέου κωδικού"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-sm text-slate-600">
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            Άκυρο
          </button>
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
              loading || !currentPassword || !newPassword || newPassword !== confirmPassword
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-brand-700 hover:bg-brand-800'
            }`}
          >
            {loading ? 'Αλλαγή...' : 'Αλλαγή κωδικού'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordModal;