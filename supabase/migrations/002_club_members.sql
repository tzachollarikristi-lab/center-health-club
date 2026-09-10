-- Health Center Club — club members table
-- Run once in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS club_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Μέλος',
  phone TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 99,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read club members" ON club_members;
DROP POLICY IF EXISTS "Admin insert club members" ON club_members;
DROP POLICY IF EXISTS "Admin update club members" ON club_members;
DROP POLICY IF EXISTS "Admin delete club members" ON club_members;

CREATE POLICY "Public read club members"
  ON club_members FOR SELECT
  USING (true);

CREATE POLICY "Admin insert club members"
  ON club_members FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update club members"
  ON club_members FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete club members"
  ON club_members FOR DELETE
  USING (public.is_admin());
