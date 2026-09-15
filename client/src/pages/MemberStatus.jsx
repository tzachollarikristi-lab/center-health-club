import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';

export default function MemberStatus() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [member, setMember] = useState(null);
  const [status, setStatus] = useState('member');

  const handleExit = () => {
    localStorage.removeItem('clubMemberSession');
    localStorage.removeItem('clubMembershipStatus');
    navigate('/');
  };

  useEffect(() => {
    async function syncMembershipSession() {
      const rawSession = localStorage.getItem('clubMemberSession');
      const rawStatus = localStorage.getItem('clubMembershipStatus');
      const raw = rawSession || rawStatus;

      if (!raw) {
        navigate('/join');
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        const idNumber = parsed?.id_number || '';
        const phone = parsed?.phone || '';

        if (!idNumber || !phone) {
          navigate('/join');
          return;
        }

        const { data, error } = await supabase.rpc('lookup_membership', {
          p_id_number: idNumber,
          p_phone: phone,
        });

        if (error) throw error;

        const applicationMatch = (data && data[0]) || null;

        if (applicationMatch) {
          const hasExpired = applicationMatch.status === 'accepted' && applicationMatch.created_at && Date.now() > new Date(applicationMatch.created_at).getTime() + 31536000000;
          if (applicationMatch.status === 'accepted' && !hasExpired) {
            const nextPaymentDate = new Date(Date.now() + 31536000000).toISOString();
            const memberSession = {
              name: applicationMatch.name || parsed.name,
              id_number: applicationMatch.id_number || parsed.id_number,
              phone: applicationMatch.phone || parsed.phone,
              birth_date: applicationMatch.birth_date || parsed.birth_date,
              status: 'member',
              nextPaymentDate: new Date(nextPaymentDate).toLocaleDateString('el-GR'),
            };

            localStorage.setItem('clubMemberSession', JSON.stringify(memberSession));
            localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'member', expiresAt: nextPaymentDate }));
            setStatus('member');
            setMember(memberSession);
            return;
          }

          const pendingSession = {
            status: 'pending',
            name: applicationMatch.name || parsed.name,
            id_number: applicationMatch.id_number || parsed.id_number,
            phone: applicationMatch.phone || parsed.phone,
            expiresAt: null,
            iban: settings?.donation_iban || '',
          };

          localStorage.setItem('clubMemberSession', JSON.stringify(pendingSession));
          localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'pending', expiresAt: null, iban: settings?.donation_iban || '' }));
          setStatus('pending');
          setMember(pendingSession);
          return;
        }

        setStatus(parsed?.status === 'pending' ? 'pending' : 'member');
        setMember(parsed);
      } catch (error) {
        console.error(error);
        navigate('/join');
      }
    }

    syncMembershipSession();
  }, [navigate, settings?.donation_iban]);

  if (!member) return null;

  const isPending = status === 'pending';
  const nextPaymentDate = member.nextPaymentDate || (isPending ? 'Αναμονή για πληρωμή' : '1 χρόνο από την εγγραφή');
  const iban = member.iban || settings?.donation_iban || 'Δεν έχει οριστεί IBAN';

  return (
    <div className="container-padded reveal py-14">
      <div className="mx-auto max-w-2xl">
        <div className={`reveal rounded-[28px] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ${isPending ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50' : 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50'}`}>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg ${isPending ? 'bg-amber-500 shadow-amber-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
                {isPending ? '⏳' : '✓'}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>Membership</p>
                <h1 className="text-2xl font-bold text-slate-900">{isPending ? 'Η αίτησή σας είναι σε εκκρεμότητα' : 'Είστε μέλος'}</h1>
              </div>
            </div>
            <button type="button" onClick={handleExit} className="btn-secondary text-sm">Έξοδος</button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Ονοματεπώνυμο</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{member.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Αριθμός ταυτότητας</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{member.id_number}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Τηλέφωνο</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{member.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{isPending ? 'Κατάσταση' : 'Επόμενη πληρωμή'}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{nextPaymentDate}</p>
              </div>
            </div>
          </div>

          <div className={`mt-6 rounded-2xl border p-4 text-sm ${isPending ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            <p className="font-semibold">{isPending ? 'Αναμονή για έγκριση' : 'Σημείωση'}</p>
            <p className="mt-1">
              {isPending
                ? 'Η αίτησή σας έχει υποβληθεί. Θα γίνετε μέλος μόλις καταβληθούν τα 10€ στο παρακάτω IBAN και επιβεβαιωθεί η πληρωμή από τον διαχειριστή.'
                : 'Η πιστοποίηση σας αποθηκεύτηκε στη συσκευή σας για να μπορείτε να επανέλθετε πιο γρήγορα.'}
            </p>
          </div>

          {isPending && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">IBAN</p>
              <p className="mt-2 break-all text-base font-semibold text-slate-900">{iban}</p>
              <p className="mt-2 text-xs text-slate-600">Γράψτε το όνομά σας στο σχόλιο της κατάθεσης για να γίνει σωστή η ταυτοποίηση.</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button type="button" onClick={() => navigate('/join')} className="btn-secondary text-sm">Πίσω</button>
            <button type="button" onClick={handleExit} className="btn-primary text-sm">Αρχική σελίδα</button>
          </div>
        </div>
      </div>
    </div>
  );
}