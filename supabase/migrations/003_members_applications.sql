-- Membership applications table
-- Safe to re-run in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS membership_applications (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  father_name TEXT DEFAULT '',
  mother_name TEXT DEFAULT '',
  birth_date TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  area TEXT DEFAULT '',
  id_number TEXT DEFAULT '',
  membership_type TEXT DEFAULT 'Τακτικό Μέλος',
  signature_url TEXT DEFAULT '',
  payment_iban TEXT DEFAULT '',
  payment_reference TEXT DEFAULT '',
  payment_confirmed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending', -- pending / accepted / rejected
  admin_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS father_name TEXT DEFAULT '';
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS mother_name TEXT DEFAULT '';
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS birth_date TEXT DEFAULT '';
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT '';
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS area TEXT DEFAULT '';
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'Τακτικό Μέλος';

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admin read membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admin update membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Admin delete membership applications" ON membership_applications;

CREATE POLICY "Public insert membership applications"
  ON membership_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read membership applications"
  ON membership_applications FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update membership applications"
  ON membership_applications FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete membership applications"
  ON membership_applications FOR DELETE
  USING (public.is_admin());
