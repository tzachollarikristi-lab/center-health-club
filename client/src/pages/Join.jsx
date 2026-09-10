import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';

function Signature({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  function prepareContext() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 0.5;
    return ctx;
  }

  function getPointFromEvent(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function start(e) {
    drawing.current = true;
    const ctx = prepareContext();
    ctx.beginPath();
    const point = getPointFromEvent(e);
    ctx.moveTo(point.x, point.y);
  }

  function move(e) {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const point = getPointFromEvent(e);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function end() {
    drawing.current = false;
    const ctx = canvasRef.current.getContext('2d');
    ctx.shadowBlur = 0;
    if (onChange) onChange(canvasRef.current);
  }

  function clear() {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    if (onChange) onChange(c);
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-3 py-1">
          <canvas
            ref={canvasRef}
            width={600}
            height={140}
            className="w-full h-28 rounded-lg bg-white"
            onMouseDown={start}
            onMouseMove={move}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={(e) => start(e.touches[0])}
            onTouchMove={(e) => move(e.touches[0])}
            onTouchEnd={end}
            style={{ touchAction: 'none', cursor: 'crosshair' }}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Υπογραφή</span>
        <button type="button" onClick={clear} className="btn-secondary text-sm">Καθαρισμός</button>
      </div>
    </div>
  );
}

function openMembershipFormPdf(data) {
  const printWindow = window.open('', '_blank', 'width=1000,height=1200');
  if (!printWindow) return;

  const rows = [
    ['Ονοματεπώνυμο', data.name || '—'],
    ['Όνομα πατρός', data.father_name || '—'],
    ['Όνομα μητρός', data.mother_name || '—'],
    ['Ημερομηνία γέννησης', data.birth_date || '—'],
    ['Αριθμός Δελτίου Ταυτότητας', data.id_number || '—'],
    ['Διεύθυνση κατοικίας', data.address || '—'],
    ['Τ.Κ.', data.postal_code || '—'],
    ['Περιοχή', data.area || '—'],
    ['Τηλέφωνο', data.phone || '—'],
    ['Email', data.email || '—'],
    ['Ιδιότητα μέλους', data.membership_type || 'Τακτικό Μέλος'],
  ];

  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding: 10px 12px; border: 1px solid #dbe2ea; font-weight: 700; width: 42%; background: #f8fafc; color: #0f172a;">${label}</td>
      <td style="padding: 10px 12px; border: 1px solid #dbe2ea; color: #1e293b;">${value}</td>
    </tr>
  `).join('');

  const signatureMarkup = data.signature
    ? `<div style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 8px 14px; border: 1px solid #dbe2ea; border-radius: 12px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);"><img src="${data.signature}" alt="Υπογραφή" style="max-width: 260px; max-height: 84px; object-fit: contain; display: block; filter: contrast(1.08) saturate(1.05);" /></div>`
    : `<div style="height: 86px; display: flex; align-items: end; justify-content: center; font-size: 30px; color: #0f172a; letter-spacing: 0.12em; border: 1px solid #dbe2ea; border-radius: 12px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);">__________________</div>`;

  printWindow.document.write(`
    <html>
      <head>
        <title>Αίτηση Εγγραφής Μέλους</title>
        <style>
          :root { --ink: #101828; --muted: #475467; --line: #cbd5e1; --panel: #f8fafc; }
          body { font-family: 'Times New Roman', Georgia, serif; margin: 28px; color: var(--ink); background: #ffffff; }
          .official { max-width: 900px; margin: 0 auto; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid var(--ink); padding-bottom: 16px; margin-bottom: 18px; }
          .logo-box { width: 116px; height: 116px; border: 2px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, #f8fbff 0%, #edf6ff 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.06); }
          .logo-box img { width: 88px; height: 88px; object-fit: contain; }
          .club-title { text-align: right; font-weight: 700; line-height: 1.35; font-size: 15px; letter-spacing: 0.06em; }
          .section-title { text-align: center; font-size: 29px; font-weight: 700; letter-spacing: 0.08em; margin: 18px 0 8px; }
          .sub { text-align: center; font-size: 17px; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 16px; }
          .statement { font-size: 15px; line-height: 1.8; margin: 18px 0 14px; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; gap: 26px; }
          .signature-box, .date-box { flex: 1; border-top: 2px solid var(--ink); text-align: center; padding-top: 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
          .signature-box label { display: block; margin-bottom: 10px; font-weight: 700; }
          .small-note { margin-top: 12px; font-size: 11px; color: var(--muted); text-align: center; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="official">
          <div class="header">
            <div class="logo-box">
              <img src="logo.png" alt="Club Logo" />
            </div>
            <div class="club-title">
              <div>ΣΥΛΛΟΓΟΣ</div>
              <div>ΦΙΛΩΝ ΣΤΗΡΙΞΗΣ</div>
              <div>ΚΕΝΤΡΟΥ ΥΓΕΙΑΣ</div>
              <div>ΤΡΟΠΑΙΩΝ</div>
              <div>ΕΛΠΙΔΑ ΖΩΗΣ</div>
            </div>
          </div>

          <div class="section-title">ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ ΜΕΛΟΥΣ</div>
          <div class="sub">ΕΛΠΙΔΑ ΖΩΗΣ</div>

          <div class="statement">Παρακαλώ να με εγγράψετε ως μέλος του συλλόγου, αποδεχόμενος/η το καταστατικό και τους σκοπούς του.</div>

          <table>
            ${tableRows}
          </table>

          <div class="statement">
            <strong>Ιδιότητα μέλους:</strong> ${data.membership_type || 'Τακτικό Μέλος'}<br/>
            Δηλώνω υπεύθυνα ότι αποδέχομαι το καταστατικό του συλλόγου και τις αποφάσεις των οργάνων του.
          </div>

          <div class="footer">
            <div class="date-box">Ημερομηνία εγγραφής:<br/>${data.date || new Date().toLocaleDateString('el-GR')}</div>
            <div class="signature-box">
              <label>Υπογραφή</label>
              ${signatureMarkup}
            </div>
          </div>
          <div class="small-note">Έγγραφο υποβλήθηκε μέσω της ηλεκτρονικής διαδικασίας εγγραφής του συλλόγου.</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => printWindow.print(), 250);
}

export default function Join({ mode = 'join' }) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const isLoginMode = mode === 'login';
  const [form, setForm] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    birth_date: '',
    id_number: '',
    address: '',
    postal_code: '',
    area: '',
    phone: '',
    email: '',
    membership_type: 'Τακτικό Μέλος',
    payment_reference: '',
  });
  const [existingMemberForm, setExistingMemberForm] = useState({
    name: '',
    surname: '',
    id_number: '',
    birth_date: '',
    phone: '',
  });
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [existingMemberMessage, setExistingMemberMessage] = useState('');
  const [existingMemberSubmitting, setExistingMemberSubmitting] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem('clubMemberSession');
    if (remembered) {
      try {
        const parsed = JSON.parse(remembered);
        if (parsed?.name && parsed?.id_number) {
          navigate('/member-status');
        }
      } catch (error) {
        console.error('Failed to parse remembered member session', error);
      }
    }
  }, [navigate]);

  function handleFieldChange(field, value) {
    const next = { ...form, [field]: value };
    if (field === 'name') next.name = value.toUpperCase();
    if (field === 'phone') next.phone = value.replace(/\D/g, '').slice(0, 10);
    if (field === 'email') next.email = value.trim();
    setForm(next);
  }

  function handleExistingMemberFieldChange(field, value) {
    const next = { ...existingMemberForm, [field]: value };
    if (field === 'name' || field === 'surname') next[field] = value.toUpperCase();
    if (field === 'phone') next.phone = value.replace(/\D/g, '').slice(0, 10);
    setExistingMemberForm(next);
  }

  async function uploadSignature(canvas) {
    if (!canvas) return '';
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    const fileName = `members/signatures/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { error } = await supabase.storage.from('media').upload(fileName, blob, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    return urlData.publicUrl;
  }

  function normalizeString(value) {
    return String(value || '').trim().toLowerCase();
  }

  function isMembershipExpired(record) {
    if (!record?.created_at || record.status !== 'accepted') return false;
    const expiry = new Date(record.created_at).getTime() + 31536000000;
    return Date.now() > expiry;
  }

  function isSamePerson(a, b) {
    return (
      normalizeString(a.name) === normalizeString(b.name) &&
      normalizeString(a.phone) === normalizeString(b.phone) &&
      normalizeString(a.id_number) === normalizeString(b.id_number)
    );
  }

  async function checkExistingMembershipMatch() {
    const name = form.name.trim();
    const phone = form.phone.trim();
    const idNumber = form.id_number.trim();
    const email = form.email.trim();

    if (!name || !phone || !idNumber) return null;

    const [membersResult, appsResult] = await Promise.all([
      supabase.from('club_members').select('id, name, phone, created_at, role'),
      supabase.from('membership_applications').select('id, name, phone, id_number, email, status, created_at')
    ]);

    if (membersResult.error) throw membersResult.error;
    if (appsResult.error) throw appsResult.error;

    const allMembers = membersResult.data || [];
    const allApplications = appsResult.data || [];

    const memberMatch = allMembers.find(member => isSamePerson({ name, phone, id_number: idNumber }, { name: member.name, phone: member.phone, id_number: '' }));
    if (memberMatch) {
      return { kind: 'member', record: memberMatch };
    }

    const pendingMatch = allApplications.find(app => {
      const sameBase = isSamePerson({ name, phone, id_number: idNumber }, { name: app.name, phone: app.phone, id_number: app.id_number || '' });
      const sameEmail = normalizeString(app.email) === normalizeString(email);
      return sameBase || sameEmail;
    });

    if (pendingMatch) {
      const expired = isMembershipExpired(pendingMatch);
      return { kind: pendingMatch.status === 'accepted' && !expired ? 'member' : 'pending', record: pendingMatch };
    }

    return null;
  }

  function validateForm() {
    if (!form.name.trim()) return 'Παρακαλώ συμπληρώστε το ονοματεπώνυμο.';
    if (!form.father_name.trim()) return 'Παρακαλώ συμπληρώστε το όνομα πατρός.';
    if (!form.mother_name.trim()) return 'Παρακαλώ συμπληρώστε το όνομα μητρός.';
    if (!form.birth_date) return 'Παρακαλώ επιλέξτε ημερομηνία γέννησης.';
    if (!form.id_number.trim()) return 'Παρακαλώ συμπληρώστε τον αριθμό δελτίου ταυτότητας.';
    if (!form.address.trim()) return 'Παρακαλώ συμπληρώστε τη διεύθυνση κατοικίας.';
    if (!form.postal_code.trim()) return 'Παρακαλώ συμπληρώστε τον ταχυδρομικό κώδικα.';
    if (!form.area.trim()) return 'Παρακαλώ συμπληρώστε την περιοχή.';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) return 'Το τηλέφωνο πρέπει να έχει ακριβώς 10 αριθμούς.';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Παρακαλώ εισάγετε έγκυρο email.';
    if (!signatureCanvas) return 'Παρακαλώ υπογράψτε στο πεδίο υπογραφής.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const duplicate = await checkExistingMembershipMatch();
      if (duplicate?.kind === 'member') {
        const nextPaymentDate = duplicate.record?.created_at ? new Date(new Date(duplicate.record.created_at).getTime() + 31536000000).toLocaleDateString('el-GR') : 'σε 1 χρόνο';
        const memberMessage = `Έχετε ήδη εγγραφεί ως μέλος. Η επόμενη πληρωμή είναι για ${nextPaymentDate}. Αν θέλετε βοήθεια, επικοινωνήστε μαζί μας.`;
        localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'member', expiresAt: duplicate.record?.created_at ? new Date(new Date(duplicate.record.created_at).getTime() + 31536000000).toISOString() : null }));
        setMessage(memberMessage);
        return;
      }

      if (duplicate?.kind === 'pending') {
        setMessage('Υπάρχει ήδη αίτηση σε εκκρεμότητα για το ίδιο άτομο. Παρακαλούμε να καταβληθεί η ετήσια συνδρομή στο IBAN και να γράψετε το όνομά σας στο σχόλιο της κατάθεσης. Αν έχετε ερώτηση, επικοινωνήστε μαζί μας.');
        return;
      }

      const sigUrl = await uploadSignature(signatureCanvas);
      const payload = {
        name: form.name.trim(),
        father_name: form.father_name.trim(),
        mother_name: form.mother_name.trim(),
        birth_date: form.birth_date,
        email: form.email.trim(),
        phone: form.phone,
        address: form.address.trim(),
        postal_code: form.postal_code.trim(),
        area: form.area.trim(),
        id_number: form.id_number.trim(),
        membership_type: form.membership_type,
        signature_url: sigUrl || '',
        payment_iban: settings?.donation_iban || '',
        payment_reference: form.payment_reference.trim(),
        payment_confirmed: false,
        status: 'pending',
      };

      const { error } = await supabase.from('membership_applications').insert([payload]);
      if (error) throw error;

      const pendingSession = {
        status: 'pending',
        name: form.name.trim(),
        id_number: form.id_number.trim(),
        phone: form.phone,
        expiresAt: null,
        iban: settings?.donation_iban || '',
      };

      localStorage.setItem('clubMemberSession', JSON.stringify(pendingSession));
      localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'pending', expiresAt: null, iban: settings?.donation_iban || '' }));

      const signatureDataUrl = signatureCanvas ? signatureCanvas.toDataURL('image/png') : '';
      openMembershipFormPdf({ ...form, date: new Date().toLocaleDateString('el-GR'), signature: signatureDataUrl });
      navigate('/member-status');
    } catch (err) {
      console.error(err);
      setMessage('Σφάλμα κατά την αποστολή. Προσπαθήστε ξανά.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExistingMemberSubmit(e) {
    e.preventDefault();
    setExistingMemberMessage('');

    const { name, surname, id_number, birth_date, phone } = existingMemberForm;
    if (!name.trim() || !surname.trim() || !id_number.trim() || !phone || !/^\d{10}$/.test(phone)) {
      setExistingMemberMessage('Συμπληρώστε σωστά το όνομα, το επώνυμο, τον αριθμό ταυτότητας και το 10ψήφιο τηλέφωνο.');
      return;
    }

    try {
      setExistingMemberSubmitting(true);
      const { data, error } = await supabase.from('membership_applications').select('*');
      if (error) throw error;

      const fullName = `${name.trim()} ${surname.trim()}`;
      const match = (data || []).find((application) => {
        const sameName = normalizeString(application.name) === normalizeString(fullName);
        const sameId = normalizeString(application.id_number) === normalizeString(id_number);
        const samePhone = normalizeString(application.phone) === normalizeString(phone);
        const sameBirthDate = !birth_date || !application.birth_date || normalizeString(application.birth_date) === normalizeString(birth_date);
        return sameName && sameId && samePhone && sameBirthDate;
      });

      if (!match) {
        setExistingMemberMessage('Δεν βρέθηκε ενεργό μέλος ή αίτηση σε εκκρεμότητα με αυτά τα στοιχεία. Αν πιστεύετε ότι υπάρχει σφάλμα, επικοινωνήστε μαζί μας.');
        return;
      }

      const isExpired = match.status === 'accepted' && match.created_at && Date.now() > new Date(match.created_at).getTime() + 31536000000;

      if (match.status === 'accepted' && !isExpired) {
        const nextPaymentDate = new Date(Date.now() + 31536000000).toISOString();
        const memberSession = {
          name: match.name || fullName,
          id_number: match.id_number || id_number,
          phone: match.phone || phone,
          birth_date: match.birth_date || birth_date,
          nextPaymentDate: new Date(nextPaymentDate).toLocaleDateString('el-GR'),
          status: 'member',
        };

        localStorage.setItem('clubMemberSession', JSON.stringify(memberSession));
        localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'member', expiresAt: nextPaymentDate }));
        navigate('/member-status');
        return;
      }

      const pendingSession = {
        status: 'pending',
        name: match.name || fullName,
        id_number: match.id_number || id_number,
        phone: match.phone || phone,
        birth_date: match.birth_date || birth_date,
        expiresAt: null,
        iban: settings?.donation_iban || '',
      };

      localStorage.setItem('clubMemberSession', JSON.stringify(pendingSession));
      localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'pending', expiresAt: null, iban: settings?.donation_iban || '' }));
      navigate('/member-status');
    } catch (err) {
      console.error(err);
      setExistingMemberMessage('Σφάλμα κατά την αναζήτηση. Προσπαθήστε ξανά.');
    } finally {
      setExistingMemberSubmitting(false);
    }
  }

  const loginTitle = isLoginMode ? 'Σύνδεση Μέλους' : 'Εγγραφή Μέλους';

  return (
    <div className="container-padded py-12">
      <div className="max-w-4xl mx-auto">
        <div className="card overflow-hidden border-0 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-200 bg-gradient-to-r from-brand-50 via-sky-50 to-cyan-50 px-6 py-5 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700">Club membership</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">{loginTitle}</h1>
              </div>
              {isLoginMode ? (
                <button type="button" onClick={() => navigate('/join')} className="btn-secondary text-sm">Πίσω στην εγγραφή</button>
              ) : (
                <button type="button" onClick={() => navigate('/member-login')} className="btn-secondary text-sm">Είμαι ήδη μέλος</button>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isLoginMode ? (
              <div className="mx-auto max-w-xl">
                <p className="text-sm text-slate-600 mb-6">
                  Εισάγετε τα βασικά σας στοιχεία για να ελέγξουμε αν είστε ήδη εγγεγραμμένοι ως μέλος.
                </p>

                <form onSubmit={handleExistingMemberSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Όνομα *</label>
                      <input
                        className="input mt-1"
                        value={existingMemberForm.name}
                        onChange={(e) => handleExistingMemberFieldChange('name', e.target.value)}
                        autoCapitalize="characters"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Επώνυμο *</label>
                      <input
                        className="input mt-1"
                        value={existingMemberForm.surname}
                        onChange={(e) => handleExistingMemberFieldChange('surname', e.target.value)}
                        autoCapitalize="characters"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Αριθμός Ταυτότητας *</label>
                      <input
                        className="input mt-1"
                        value={existingMemberForm.id_number}
                        onChange={(e) => handleExistingMemberFieldChange('id_number', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Ημερομηνία γέννησης</label>
                      <input
                        type="date"
                        className="input mt-1"
                        value={existingMemberForm.birth_date}
                        onChange={(e) => handleExistingMemberFieldChange('birth_date', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Τηλέφωνο *</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        className="input mt-1"
                        value={existingMemberForm.phone}
                        onChange={(e) => handleExistingMemberFieldChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button type="submit" disabled={existingMemberSubmitting} className="btn-primary">
                      {existingMemberSubmitting ? 'Έλεγχος...' : 'Σύνδεση μέλους'}
                    </button>
                    <button type="button" onClick={() => navigate('/join')} className="btn-secondary">Δημιουργία νέας αίτησης</button>
                  </div>

                  {existingMemberMessage && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      {existingMemberMessage}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-6">
                  Συμπληρώστε τα στοιχεία σας, υπογράψτε και στείλτε την ετήσια συνδρομή των 10€ στο IBAN που φαίνεται. Στο σχόλιο της κατάθεσης γράψτε το όνομά σας.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Ονοματεπώνυμο *</label>
                      <input
                        className="input mt-1"
                        value={form.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        autoCapitalize="characters"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Όνομα πατρός *</label>
                      <input className="input mt-1" value={form.father_name} onChange={(e) => handleFieldChange('father_name', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Όνομα μητρός *</label>
                      <input className="input mt-1" value={form.mother_name} onChange={(e) => handleFieldChange('mother_name', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Ημερομηνία γέννησης *</label>
                      <input type="date" className="input mt-1" value={form.birth_date} onChange={(e) => handleFieldChange('birth_date', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Αριθμός Δελτίου Ταυτότητας *</label>
                      <input className="input mt-1" value={form.id_number} onChange={(e) => handleFieldChange('id_number', e.target.value)} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Διεύθυνση κατοικίας *</label>
                      <input className="input mt-1" value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Τ.Κ. *</label>
                      <input className="input mt-1" value={form.postal_code} onChange={(e) => handleFieldChange('postal_code', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Περιοχή *</label>
                      <input className="input mt-1" value={form.area} onChange={(e) => handleFieldChange('area', e.target.value)} />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Τηλέφωνο *</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className="input mt-1"
                        value={form.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email *</label>
                      <input
                        type="email"
                        className="input mt-1"
                        value={form.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        inputMode="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ιδιότητα μέλους *</label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="membership_type"
                          checked={form.membership_type === 'Εγγραφή Μέλους'}
                          onChange={() => handleFieldChange('membership_type', 'Εγγραφή Μέλους')}
                        />
                        Εγγραφή Μέλους (10€)
                      </label>
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="membership_type"
                          checked={form.membership_type === 'Τακτικό Μέλος'}
                          onChange={() => handleFieldChange('membership_type', 'Τακτικό Μέλος')}
                        />
                        Τακτικό Μέλος (10€)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Αναφορά κατάθεσης</label>
                    <input
                      className="input mt-1"
                      placeholder="π.χ. Γεώργιος Παπαδόπουλος"
                      value={form.payment_reference}
                      onChange={(e) => handleFieldChange('payment_reference', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Υπογραφή *</label>
                    <div className="mt-1">
                      <Signature onChange={(c) => setSignatureCanvas(c)} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4 text-sm text-slate-700">
                    <div className="font-semibold">IBAN</div>
                    <div className="mt-1">{settings?.donation_iban || 'δεν έχει οριστεί'}</div>
                    <div className="mt-2 text-xs text-slate-600">
                      Θα γίνετε μέλος μόλις καταβληθούν τα 10€ στο παραπάνω IBAN και επιβεβαιωθεί η πληρωμή από τον διαχειριστή.
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button type="submit" disabled={submitting} className="btn-primary">
                      {submitting ? 'Αποστολή...' : 'Υποβολή αίτησης'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Άκυρο</button>
                  </div>

                  {message && <div className="text-sm text-slate-700 rounded-xl bg-slate-50 border border-slate-200 p-3">{message}</div>}
                </form>

                <div className="mt-10 border-t border-slate-200 pt-8">
                  <h2 className="text-xl font-bold text-slate-900">Είμαι ήδη μέλος</h2>
                  <p className="mt-1 text-sm text-slate-600">Εισάγετε τα στοιχεία σας για να δείτε αν είστε ήδη εγγεγραμμένοι.</p>
                  <button type="button" onClick={() => navigate('/member-login')} className="mt-4 btn-secondary">Σύνδεση μέλους</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
