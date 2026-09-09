import { supabase } from './supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_SIZE = 12 * 1024 * 1024;

function sanitizeName(name) {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
}

export async function uploadMediaFile(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected.');
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Μη επιτρεπόμενος τύπος αρχείου. Επιτρέπονται εικόνες και PDF.');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Το αρχείο είναι πολύ μεγάλο (μέγιστο 12MB).');
  }
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable media uploads.');
  }

  const path = `${folder}/${Date.now()}-${sanitizeName(file.name)}`;
  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, path, name: file.name, size: file.size };
}

export async function uploadMediaFiles(files, folder = 'uploads') {
  const results = [];
  for (const file of files) {
    results.push(await uploadMediaFile(file, folder));
  }
  return results;
}
