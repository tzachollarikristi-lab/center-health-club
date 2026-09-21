import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';

// ─── Icons ────────────────────────────────────────────────────────
const IconUser = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const IconPhone = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>);
const IconMail = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
const IconPin = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>);
const IconId = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>);
const IconCheck = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" className={className}><path d="M4.5 12.75l6 6 9-13.5" /></svg>);
const IconArrowRight = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14M13 5l7 7-7 7" /></svg>);
const IconCopy = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375h-6.75a1.125 1.125 0 01-1.125-1.125v-9.5" /></svg>);
const IconBank = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>);
const IconAlert = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>);

// ─── Signature Component ──────────────────────────────────────────
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
    return ctx;
  }
  function getPointFromEvent(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
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
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-2 transition-colors hover:border-brand-400">
      <canvas
        ref={canvasRef}
        width={600}
        height={140}
        className="w-full h-28 rounded-xl bg-slate-50/50"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={(e) => start(e.touches[0])}
        onTouchMove={(e) => move(e.touches[0])}
        onTouchEnd={end}
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      />
      <div className="mt-2 flex items-center justify-between px-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Υπογραφή</span>
        <button type="button" onClick={clear} className="text-xs font-semibold text-brand-600 hover:text-brand-700">Καθαρισμός</button>
      </div>
    </div>
  );
}

// ─── Generate the PDF Form ────────────────────────────────────────
function openMembershipFormPdf(data) {
  const printWindow = window.open('', '_blank', 'width=1000,height=1200');
  if (!printWindow) return;

  const signatureMarkup = data.signature
    ? `<img src="${data.signature}" alt="Υπογραφή" style="max-width: 220px; max-height: 70px; object-fit: contain; display: block;" />`
    : `<div style="height: 60px;"></div>`;

  printWindow.document.write(`
    <html>
      <head>
        <title>Αίτηση Εγγραφής Μέλους</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 40px; color: #000; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
          .logo { width: 130px; height: auto; }
          .header-text { text-align: center; margin-right: 30px; }
          .header-text h2 { font-size: 18px; font-weight: bold; margin: 0; }
          .header-text h3 { font-size: 14px; font-weight: bold; margin: 5px 0; }
          .header-text h4 { font-size: 16px; font-weight: bold; margin: 10px 0; }
          .statement { font-size: 14px; line-height: 1.6; margin-top: 15px; text-align: left; }
          .divider { border-top: 2px solid #000; margin: 20px 0; }
          .section-title { font-size: 15px; font-weight: bold; margin: 0 0 15px 0; }
          .field-row { display: flex; margin-bottom: 12px; font-size: 14px; align-items: flex-end; }
          .field-label { font-weight: bold; width: 200px; white-space: nowrap; }
          .field-value { border-bottom: 1px solid #000; flex: 1; padding-left: 8px; min-height: 20px; }
          .checkbox-row { font-size: 14px; margin-bottom: 10px; }
          .checkbox-row span { font-weight: bold; margin-right: 8px; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 14px; align-items: flex-end; }
          .footer div { display: flex; align-items: flex-end; }
          .footer .line { border-bottom: 1px solid #000; width: 180px; padding-left: 5px; margin-left: 5px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/logo.png" alt="Λογότυπο" class="logo" />
          <div class="header-text">
            <h2>ΑΙΤΗΣΗ ΕΓΓΡΑΦΗΣ ΜΕΛΟΥΣ</h2>
            <h3>ΣΥΛΛΟΓΟΣ ΦΙΛΩΝ ΚΕΝΤΡΟΥ ΥΓΕΙΑΣ ΤΡΟΠΑΙΩΝ ΔΥΤ. ΓΟΡΤΥΝΙΑΣ</h3>
            <h4>» ΕΛΠΙΔΑ ΖΩΗΣ «</h4>
            <p class="statement">Παρακαλώ να με εγγράψετε ως μέλος του Συλλόγου, αποδεχόμενος/η το Καταστατικό και τους σκοπούς του.</p>
          </div>
        </div>

        <div class="divider"></div>

        <div class="section-title">ΣΤΟΙΧΕΙΑ ΑΙΤΟΥΝΤΟΣ</div>
        <div class="field-row"><div class="field-label">Ονοματεπώνυμο:</div><div class="field-value">${data.name || ''}</div></div>
        <div class="field-row"><div class="field-label">Όνομα Πατέρα:</div><div class="field-value">${data.father_name || ''}</div></div>
        <div class="field-row"><div class="field-label">Όνομα Μητέρας:</div><div class="field-value">${data.mother_name || ''}</div></div>
        <div class="field-row"><div class="field-label">Ημερομηνία Γέννησης:</div><div class="field-value">${data.birth_date || ''}</div></div>
        <div class="field-row"><div class="field-label">Αριθμός Δελτίου Ταυτότητας:</div><div class="field-value">${data.id_number || ''}</div></div>
        <div class="field-row"><div class="field-label">Διεύθυνση Κατοικίας:</div><div class="field-value">${data.address || ''}</div></div>
        <div class="field-row">
          <div class="field-label">Τ.Κ.:</div><div class="field-value" style="max-width: 100px; margin-right: 20px;">${data.postal_code || ''}</div>
          <div class="field-label" style="width: 80px;">Περιοχή:</div><div class="field-value">${data.area || ''}</div>
        </div>
        <div class="field-row"><div class="field-label">Τηλέφωνο:</div><div class="field-value">${data.phone || ''}</div></div>
        <div class="field-row"><div class="field-label">Email:</div><div class="field-value">${data.email || ''}</div></div>

        <div class="divider"></div>

        <div class="section-title">ΙΔΙΟΤΗΤΑ ΜΕΛΟΥΣ</div>
        <p style="font-size: 13px; margin: 0 0 15px 0;">(Παρακαλώ σημειώστε X)</p>
        
        <div class="checkbox-row"><span>${data.membership_type === 'Εγγραφή Μέλους' ? '☑' : '☐'}</span> Εγγραφή Μέλος (Ετήσια συνδρομή 10€)</div>
        <div class="checkbox-row"><span>${data.membership_type === 'Τακτικό Μέλος' ? '☑' : '☐'}</span> Τακτικό Μέλος (Ετήσια συνδρομή... 10€)</div>

        <p class="statement" style="margin-top: 20px;">Δηλώνω υπεύθυνα ότι αποδέχομαι το Καταστατικό του Συλλόγου και τις αποφάσεις των οργάνων του.</p>

        <div class="footer">
          <div>Ημερομηνία: <div class="line">${data.date || new Date().toLocaleDateString('el-GR')}</div></div>
          <div>Υπογραφή: ${signatureMarkup}</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => printWindow.print(), 250);
}

// ─── Main Join Component ──────────────────────────────────────────
export default function Join({ mode = 'join' }) {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isLoginMode = mode === 'login';
  const [form, setForm] = useState({
    name: '', father_name: '', mother_name: '', birth_date: '',
    id_number: '', address: '', postal_code: '', area: '',
    phone: '', email: '', membership_type: 'Εγγραφή Μέλους', payment_reference: '',
  });
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Existing member login state
  const [existingMemberForm, setExistingMemberForm] = useState({ name: '', surname: '', id_number: '', birth_date: '', phone: '' });
  const [existingMemberMessage, setExistingMemberMessage] = useState('');
  const [existingMemberSubmitting, setExistingMemberSubmitting] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem('clubMemberSession');
    if (remembered) {
      try {
        const parsed = JSON.parse(remembered);
        if (parsed?.name && parsed?.id_number) navigate('/member-status');
      } catch (error) { console.error(error); }
    }
  }, [navigate]);

  // ─── HANDLE COPY IBAN ──────────────────────────────────────
  const handleCopyIban = async () => {
    if (!settings?.donation_iban) return;
    try {
      await navigator.clipboard.writeText(settings.donation_iban);
      setCopied(true);
      showToast('Το IBAN αντιγράφηκε!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Δεν ήταν δυνατή η αντιγραφή.', 'error');
    }
  };

  // ─── UPPERCASE LOGIC ──────────────────────────────────────
  function handleFieldChange(field, value) {
    let v = value;
    if (['name', 'father_name', 'mother_name', 'area'].includes(field)) {
      v = value.toUpperCase();
    }
    if (field === 'phone') v = value.replace(/\D/g, '').slice(0, 10);
    if (field === 'email') v = value.trim();
    setForm((prev) => ({ ...prev, [field]: v }));
  }

  function handleExistingMemberFieldChange(field, value) {
    let v = value;
    if (['name', 'surname'].includes(field)) v = value.toUpperCase();
    if (field === 'phone') v = value.replace(/\D/g, '').slice(0, 10);
    setExistingMemberForm((prev) => ({ ...prev, [field]: v }));
  }

  async function uploadSignature(canvas) {
    if (!canvas) return '';
    if (!supabase) return '';
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    const fileName = `pending/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { error } = await supabase.storage.from('member-signatures').upload(fileName, blob, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return fileName;
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
    if (validationError) { setMessage(validationError); return; }

    setSubmitting(true);
    try {
      const { data: existing } = await supabase.rpc('lookup_membership', {
        p_id_number: form.id_number.trim(),
        p_phone: form.phone,
      });

      if (existing && existing.length > 0) {
        const record = existing[0];
        const expired = record.status === 'accepted' && record.created_at && Date.now() > new Date(record.created_at).getTime() + 31536000000;
        if (record.status === 'accepted' && !expired) {
          setMessage('Έχετε ήδη εγγραφεί ως μέλος. Η επόμενη πληρωμή σας είναι σε 1 χρόνο.');
          return;
        }
        if (record.status === 'pending' && !expired) {
          setMessage('Υπάρχει ήδη αίτηση σε εκκρεμότητα. Παρακαλούμε να καταβληθεί η ετήσια συνδρομή στο IBAN.');
          return;
        }
      }

      const sigUrl = await uploadSignature(signatureCanvas);

      const payload = {
        name: form.name.trim(), father_name: form.father_name.trim(), mother_name: form.mother_name.trim(),
        birth_date: form.birth_date, email: form.email.trim(), phone: form.phone,
        address: form.address.trim(), postal_code: form.postal_code.trim(), area: form.area.trim(),
        id_number: form.id_number.trim(), membership_type: form.membership_type,
        signature_url: sigUrl || '', payment_iban: settings?.donation_iban || '',
        payment_reference: form.payment_reference.trim(), payment_confirmed: false, status: 'pending',
      };

      const { error } = await supabase.from('membership_applications').insert([payload]);
      if (error) throw error;

      const pendingSession = { status: 'pending', name: form.name.trim(), id_number: form.id_number.trim(), phone: form.phone, expiresAt: null, iban: settings?.donation_iban || '' };
      localStorage.setItem('clubMemberSession', JSON.stringify(pendingSession));
      localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: 'pending', expiresAt: null, iban: settings?.donation_iban || '' }));

      const signatureDataUrl = signatureCanvas ? signatureCanvas.toDataURL('image/png') : '';
      openMembershipFormPdf({ ...form, date: new Date().toLocaleDateString('el-GR'), signature: signatureDataUrl });
      
      showToast('Η αίτηση υποβλήθηκε!', 'success');
      navigate('/member-status');
    } catch (err) {
      console.error(err);
      setMessage('Σφάλμα κατά την αποστολή. Προσπαθήστε ξανά.');
      showToast('Σφάλμα κατά την αποστολή.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExistingMemberSubmit(e) {
    e.preventDefault();
    setExistingMemberMessage('');
    const { name, surname, id_number, phone } = existingMemberForm;
    if (!name.trim() || !surname.trim() || !id_number.trim() || !phone || !/^\d{10}$/.test(phone)) {
      setExistingMemberMessage('Συμπληρώστε σωστά όλα τα πεδία.');
      return;
    }
    if (!supabase) { setExistingMemberMessage('Το σύστημα δεν είναι διαθέσιμο.'); return; }

    try {
      setExistingMemberSubmitting(true);
      const { data, error } = await supabase.rpc('lookup_membership', { p_id_number: id_number.trim(), p_phone: phone });
      if (error) throw error;

      if (!data || data.length === 0) {
        setExistingMemberMessage('Δεν βρέθηκε ενεργό μέλος. Αν πιστεύετε ότι υπάρχει σφάλμα, επικοινωνήστε μαζί μας.');
        return;
      }
      const match = data[0];
      const isExpired = match.status === 'accepted' && match.created_at && Date.now() > new Date(match.created_at).getTime() + 31536000000;
      const session = {
        status: (match.status === 'accepted' && !isExpired) ? 'member' : 'pending',
        name: match.name || `${name} ${surname}`, id_number: match.id_number || id_number,
        phone: match.phone || phone, birth_date: match.birth_date || existingMemberForm.birth_date,
        expiresAt: (match.status === 'accepted' && !isExpired) ? new Date(Date.now() + 31536000000).toISOString() : null,
        iban: settings?.donation_iban || '',
      };
      localStorage.setItem('clubMemberSession', JSON.stringify(session));
      localStorage.setItem('clubMembershipStatus', JSON.stringify({ status: session.status, expiresAt: session.expiresAt, iban: session.iban }));
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
    <div className="container-padded py-10 md:py-16">
      <SEO title={loginTitle} description="Γίνετε μέλος του Συλλόγου Φίλων Στήριξης Κέντρου Υγείας Τροπαίων." url={isLoginMode ? '/member-login' : '/join'} noIndex />
      
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-slate-200/60 bg-white shadow-xl overflow-hidden">
          
          {/* HEADER */}
          <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-cyan-50 px-6 py-8 md:px-10">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-100/50 blur-3xl pointer-events-none" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">Membership</p>
                <h1 className="mt-1 font-display text-2xl md:text-3xl text-slate-900">{loginTitle}</h1>
                <p className="mt-1 text-sm text-slate-500">Συμπληρώστε τη φόρμα για να γίνετε μέλος του συλλόγου.</p>
              </div>
              <Link to={isLoginMode ? '/join' : '/member-login'} className="btn btn-sm btn-secondary justify-center self-start md:self-auto shrink-0">
                {isLoginMode ? 'Νέα εγγραφή' : 'Είμαι ήδη μέλος'}
              </Link>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {isLoginMode ? (
              /* ─── LOGIN MODE ─── */
              <div className="mx-auto max-w-xl">
                <p className="text-sm text-slate-600 mb-6">Εισάγετε τα στοιχεία σας για να ελέγξουμε αν είστε ήδη εγγεγραμμένοι.</p>
                <form onSubmit={handleExistingMemberSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Όνομα *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={existingMemberForm.name} onChange={(e) => handleExistingMemberFieldChange('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Επώνυμο *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={existingMemberForm.surname} onChange={(e) => handleExistingMemberFieldChange('surname', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Αρ. Ταυτότητας *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={existingMemberForm.id_number} onChange={(e) => handleExistingMemberFieldChange('id_number', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Τηλέφωνο *</label>
                      <input type="tel" maxLength={10} className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={existingMemberForm.phone} onChange={(e) => handleExistingMemberFieldChange('phone', e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" disabled={existingMemberSubmitting} className="btn btn-md btn-primary w-full justify-center">
                    {existingMemberSubmitting ? 'Έλεγχος...' : 'Σύνδεση μέλους'}
                  </button>
                  {existingMemberMessage && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{existingMemberMessage}</div>}
                </form>
              </div>
            ) : (
              /* ─── JOIN MODE ─── */
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: PROFILE */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><IconUser className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Στοιχεία</p>
                      <h3 className="font-display text-lg text-slate-900 leading-tight">Προσωπικά Στοιχεία</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ονοματεπώνυμο *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="π.χ. ΙΩΑΝΝΗΣ ΠΑΠΑΔΟΠΟΥΛΟΣ" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Όνομα Πατρός *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.father_name} onChange={(e) => handleFieldChange('father_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Όνομα Μητρός *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.mother_name} onChange={(e) => handleFieldChange('mother_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ημ/νία Γέννησης *</label>
                      <input type="date" className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.birth_date} onChange={(e) => handleFieldChange('birth_date', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Αρ. Δελτίου Ταυτότητας *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.id_number} onChange={(e) => handleFieldChange('id_number', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CONTACT */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600"><IconPin className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Διεύθυνση</p>
                      <h3 className="font-display text-lg text-slate-900 leading-tight">Στοιχεία Επικοινωνίας</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Διεύθυνση Κατοικίας *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Τ.Κ. *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.postal_code} onChange={(e) => handleFieldChange('postal_code', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Περιοχή *</label>
                      <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.area} onChange={(e) => handleFieldChange('area', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Τηλέφωνο *</label>
                      <input type="tel" maxLength={10} className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} placeholder="10 ψηφία" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                      <input type="email" className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" value={form.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: MEMBERSHIP TYPE */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><IconId className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">Συνδρομή</p>
                      <h3 className="font-display text-lg text-slate-900 leading-tight">Ιδιότητα Μέλους</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Εγγραφή Μέλους', 'Τακτικό Μέλος'].map((type) => (
                      <label key={type} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.membership_type === type ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <input type="radio" name="membership_type" checked={form.membership_type === type} onChange={() => handleFieldChange('membership_type', type)} className="h-4 w-4 text-brand-600 focus:ring-brand-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{type}</p>
                          <p className="text-[10px] text-slate-500">Ετήσια συνδρομή 10€</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SECTION 4: SIGNATURE (MOVED UP) */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><IconCheck className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700">Επιβεβαίωση</p>
                      <h3 className="font-display text-lg text-slate-900 leading-tight">Υπογραφή & Αποδοχή</h3>
                    </div>
                  </div>
                  <Signature onChange={(c) => setSignatureCanvas(c)} />
                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600">
                    <p>Δηλώνω υπεύθυνα ότι αποδέχομαι το Καταστατικό του Συλλόγου και τις αποφάσεις των οργάνων του.</p>
                  </div>
                </div>

                {/* SECTION 5: PAYMENT (MOVED DOWN - FINAL STEP BEFORE SUBMIT) */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><IconBank className="h-5 w-5" /></div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Πληρωμή</p>
                      <h3 className="font-display text-lg text-slate-900 leading-tight">Στοιχεία Κατάθεσης</h3>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-cyan-600 p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="relative">
                      <div className="flex items-start gap-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 p-4 mb-6">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
                          <IconAlert className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-sm text-white/95 leading-relaxed">
                          <strong className="font-semibold">Σημαντικό:</strong> Η αίτησή σας θα εγκριθεί <strong>μόνο αφού επιβεβαιωθεί η κατάθεση των 10€</strong> στον παρακάτω λογαριασμό.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">IBAN</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <p className="text-base md:text-lg font-mono font-semibold text-white break-all">
                            {settings?.donation_iban || 'Δεν έχει οριστεί IBAN'}
                          </p>
                          {settings?.donation_iban && (
                            <button
                              type="button"
                              onClick={handleCopyIban}
                              className="group inline-flex items-center gap-2 self-start rounded-full bg-white text-brand-700 px-4 py-2 text-xs font-bold transition-all hover:bg-brand-50 active:scale-[0.97] shrink-0"
                            >
                              {copied ? <IconCheck className="h-4 w-4 text-emerald-600" /> : <IconCopy className="h-4 w-4" />}
                              {copied ? 'Αντιγράφηκε!' : 'Αντιγραφή'}
                            </button>
                          )}
                        </div>
                        {settings?.donation_account_name && (
                          <p className="mt-3 text-xs text-white/80">
                            <span className="font-semibold">Δικαιούχος:</span> {settings.donation_account_name}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 flex items-start gap-3 text-xs text-white/85">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span>Στο σχόλιο της κατάθεσης γράψτε <strong>οπωσδήποτε το ονοματεπώνυμό σας</strong>, ώστε να ταυτοποιηθεί η πληρωμή.</span>
                      </div>
                      <div className="mt-2 flex items-start gap-3 text-xs text-white/85">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span>Η ετήσια συνδρομή ανέρχεται σε <strong>10€</strong>.</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Αναφορά κατάθεσης (προαιρετικό)</label>
                    <input className="w-full h-11 rounded-full border border-slate-200 px-4 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-100/60 focus:outline-none" placeholder="π.χ. Γεώργιος Παπαδόπουλος" value={form.payment_reference} onChange={(e) => handleFieldChange('payment_reference', e.target.value)} />
                  </div>
                </div>

                {/* SUBMIT */}
                <div className="border-t border-slate-100 pt-6 flex justify-end">
                  <button type="submit" disabled={submitting} className="btn btn-lg btn-primary w-full sm:w-auto justify-center group">
                    {submitting ? 'Αποστολή...' : 'Υποβολή Αίτησης'}
                    <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {message && <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{message}</div>}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}