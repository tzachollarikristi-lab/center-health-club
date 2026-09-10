export const announcements = [
  {
    id: 1,
    title: 'Νέα πρωτοβουλία υγείας',
    summary: 'Ξεκινάμε μια νέα δράση ενημέρωσης για τη δημόσια υγεία.',
    description: 'Ξεκινάμε νέα δράση ενημέρωσης για τη δημόσια υγεία με σεμινάρια και δωρεάν εξετάσεις.',
    publish_date: '2026-08-01',
    event_date: '2026-08-10',
    expiry_date: '2026-10-01',
    pinned: true,
    category: 'Υγεία',
    deletion_mode: 'admin',
    is_permanent: false,
    images: []
  },
  {
    id: 2,
    title: 'Εκδήλωση εμβολιασμού',
    summary: 'Πρόσκληση για εμβολιαστική ημέρα στο Κέντρο Υγείας.',
    description: 'Πρόσκληση για εμβολιαστική ημέρα στο Κέντρο Υγείας με δωρεάν εμβόλια για όλες τις ηλικίες.',
    publish_date: '2026-08-10',
    event_date: '2026-08-15',
    expiry_date: '2026-08-30',
    pinned: false,
    category: 'Εμβολιασμοί',
    deletion_mode: 'auto',
    is_permanent: false,
    images: []
  }
];

export const documents = [
  {
    id: 1,
    title: 'Οδηγίες Πρώτων Βοηθειών',
    date: '2026-07-28',
    description: 'Έγγραφο με βασικές οδηγίες για την ασφαλή ανταπόκριση σε έκτακτες καταστάσεις.',
    file: '/health-club-guide.pdf'
  },
  {
    id: 2,
    title: 'Φύλλο Ενημέρωσης',
    date: '2026-08-05',
    description: 'Πλήρες ενημερωτικό φυλλάδιο του συλλόγου.',
    file: '/health-club-guide.pdf'
  }
];

export const categories = [
  { id: 1, name: 'Υγεία', emoji: '🩺', accent: 'bg-cyan-100 text-cyan-700' },
  { id: 2, name: 'Εμβολιασμοί', emoji: '💉', accent: 'bg-emerald-100 text-emerald-700' },
  // events category removed
];

export const gallery = [
  {
    id: 1,
    title: 'Ημέρα Υγείας',
    description: 'Δραστηριότητα με ενημέρωση και δωρεάν εξετάσεις.',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80'
  }
];

export const settings = {
  site_name: 'Σύλλογος Κέντρου Υγείας Τροπαίων',
  site_tagline: 'Μια φιλική πλατφόρμα για κοινότητα και υγεία.',
  hero_title: 'Σύλλογος Υγείας για την Κοινότητα — ΕΛΠΙΔΑ ΖΩΗΣ',
  hero_subtitle: 'Ανακοινώσεις και έγγραφα σε ένα όμορφο και ενημερωμένο περιβάλλον.',
  contact_email: 'info@healthclub.gr',
  support_phone: '210 1234567',
  address: 'Κέντρο Υγείας, Κεντρική Πλατεία, Αθήνα',
  facebook_url: 'https://www.facebook.com',
  map_link: 'https://www.google.com/maps/search/?api=1&query=%CE%9A%CE%AD%CE%BD%CF%84%CF%81%CE%BF+%CE%A5%CE%B3%CE%B5%CE%AF%CE%B1%CF%82+%CE%A4%CF%81%CE%BF%CF%80%CE%B1%CE%B9%CF%89%CE%BD+22008',
  footer_text: 'Ενημερώσεις και έγγραφα για την τοπική κοινότητα, όλα σε μία διαισθητική και επαγγελματική πλατφόρμα.',
  brand_color: '#2563eb',
  show_map_home: 'true',
  show_map_contact: 'true',
  president_name: 'Ο Πρόεδρος του Συλλόγου',
  president_title: 'Πρόεδρος',
  president_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  president_message: 'Η υγεία είναι θεμέλιο της κοινωνίας μας. Στόχος μας είναι να δημιουργούμε χώρο ασφαλή, ανθρώπινο και ανοιχτό σε όλους, με γνώση, στήριξη και κοινή δράση.',
  donation_iban: '',
  donation_account_name: '',
  donation_instructions: '',
  donation_other: ''
};
