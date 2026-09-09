-- Demo seed data (safe to re-run — uses ON CONFLICT or checks)

INSERT INTO categories (name, emoji, accent) VALUES
  ('Υγεία', '🩺', 'bg-cyan-100 text-cyan-700'),
  ('Εμβολιασμοί', '💉', 'bg-emerald-100 text-emerald-700')
ON CONFLICT DO NOTHING;

INSERT INTO announcements (title, summary, description, category, pinned, publish_date, event_date, expiry_date, deletion_mode, is_permanent, images)
SELECT
  'Νέα πρωτοβουλία υγείας',
  'Ξεκινάμε μια νέα δράση ενημέρωσης για τη δημόσια υγεία.',
  'Ξεκινάμε νέα δράση ενημέρωσης για τη δημόσια υγεία με σεμινάρια και δωρεάν εξετάσεις.',
  'Υγεία', true, '2026-08-01', '2026-08-10', '2026-10-01', 'admin', false, '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM announcements LIMIT 1);

INSERT INTO announcements (title, summary, description, category, pinned, publish_date, event_date, expiry_date, deletion_mode, is_permanent, images)
SELECT
  'Εκδήλωση εμβολιασμού',
  'Πρόσκληση για εμβολιαστική ημέρα στο Κέντρο Υγείας.',
  'Πρόσκληση για εμβολιαστική ημέρα στο Κέντρο Υγείας με δωρεάν εμβόλια για όλες τις ηλικίες.',
  'Εμβολιασμοί', false, '2026-08-10', '2026-08-15', '2026-08-30', 'auto', false, '[]'::jsonb
WHERE (SELECT COUNT(*) FROM announcements) < 2;

INSERT INTO documents (title, description, file_path)
SELECT 'Οδηγίες Πρώτων Βοηθειών', 'Έγγραφο με βασικές οδηγίες για την ασφαλή ανταπόκριση σε έκτακτες καταστάσεις.', '/health-club-guide.pdf'
WHERE NOT EXISTS (SELECT 1 FROM documents LIMIT 1);

INSERT INTO gallery (title, description, image_url)
SELECT
  'Ημέρα Υγείας',
  'Δραστηριότητα με ενημέρωση και δωρεάν εξετάσεις.',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80'
WHERE NOT EXISTS (SELECT 1 FROM gallery LIMIT 1);

INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Σύλλογος Κέντρου Υγείας Τροπαίων'),
  ('site_tagline', 'Μια φιλική πλατφόρμα για κοινότητα και υγεία.'),
  ('hero_title', 'Σύλλογος Υγείας για την Κοινότητα — ΕΛΠΙΔΑ ΖΩΗΣ'),
  ('hero_subtitle', 'Ανακοινώσεις και έγγραφα σε ένα όμορφο και ενημερωμένο περιβάλλον.'),
  ('contact_email', 'info@tropaiwn-hc.gr'),
  ('support_phone', '+30 22310 12345'),
  ('address', 'Κέντρο Υγείας Τροπαίων'),
  ('facebook_url', 'https://www.facebook.com/TropaiwnHealthCenter'),
  ('map_link', 'https://www.google.com/maps/search/?api=1&query=%CE%9A%CE%AD%CE%BD%CF%84%CF%81%CE%BF+%CE%A5%CE%B3%CE%B5%CE%AF%CE%B1%CF%82+%CE%A4%CF%81%CE%BF%CF%80%CE%B1%CE%B9%CF%89%CE%BD+22008'),
  ('footer_text', 'Ενημερώσεις και έγγραφα για την τοπική κοινότητα, όλα σε μία διαισθητική και επαγγελματική πλατφόρμα.'),
  ('show_map_home', 'true'),
  ('show_map_contact', 'true'),
  ('donation_iban', ''),
  ('donation_account_name', ''),
  ('donation_instructions', ''),
  ('donation_other', ''),
  ('brand_color', '#2563eb')
ON CONFLICT (key) DO NOTHING;
