-- Health Center Club — Supabase schema
-- Run once in Supabase Dashboard → SQL Editor

-- Admin profiles linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS admin_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Admin',
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  pinned BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published',
  publish_date DATE NOT NULL,
  event_date DATE,
  expiry_date DATE,
  deletion_mode TEXT DEFAULT 'auto',
  is_permanent BOOLEAN DEFAULT FALSE,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '✨',
  accent TEXT DEFAULT 'bg-brand-100 text-brand-700',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- First registered user becomes admin automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_admin BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM admin_profiles WHERE is_admin = TRUE) INTO has_admin;

  INSERT INTO admin_profiles (user_id, email, name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NOT has_admin
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper for RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE user_id = auth.uid() AND is_admin = TRUE
  );
$$;

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin profiles: users read own row; admins read all
CREATE POLICY "Users can read own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles"
  ON admin_profiles FOR SELECT
  USING (public.is_admin());

-- Announcements
CREATE POLICY "Public read announcements"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Admin insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update announcements"
  ON announcements FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete announcements"
  ON announcements FOR DELETE
  USING (public.is_admin());

-- Documents
CREATE POLICY "Public read documents"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "Admin insert documents"
  ON documents FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update documents"
  ON documents FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete documents"
  ON documents FOR DELETE
  USING (public.is_admin());

-- Categories
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admin insert categories"
  ON categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update categories"
  ON categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete categories"
  ON categories FOR DELETE
  USING (public.is_admin());

-- Gallery
CREATE POLICY "Public read gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Admin insert gallery"
  ON gallery FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update gallery"
  ON gallery FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete gallery"
  ON gallery FOR DELETE
  USING (public.is_admin());

-- Messages: public can submit, admins manage
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read messages"
  ON messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin update messages"
  ON messages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete messages"
  ON messages FOR DELETE
  USING (public.is_admin());

-- Site settings
CREATE POLICY "Public read settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admin insert settings"
  ON site_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update settings"
  ON site_settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete settings"
  ON site_settings FOR DELETE
  USING (public.is_admin());

-- Storage bucket (public read, admin write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  12582912,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admin upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin update media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin delete media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.is_admin());
