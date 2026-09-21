import { supabase } from '../../lib/supabase';

// ═════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════
export const fetchDashboardData = async () => {
  const [
    annCount, docCount, galCount, msgCount,
    unreadMsgCount, memberCount, recentAnnouncements
  ] = await Promise.all([
    supabase.from('announcements').select('*', { count: 'exact', head: true }),
    supabase.from('documents').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    supabase.from('membership_applications').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('announcements').select('*').limit(5),
  ]);

  [annCount, docCount, galCount, msgCount, unreadMsgCount, memberCount, recentAnnouncements]
    .forEach((r) => { if (r.error) throw r.error; });

  const recent = (recentAnnouncements.data || []).sort((a, b) => {
    const da = new Date(a.created_at || a.publish_date || 0).getTime();
    const db = new Date(b.created_at || b.publish_date || 0).getTime();
    return db - da;
  });

  return {
    counts: {
      announcements: annCount.count || 0,
      documents: docCount.count || 0,
      gallery: galCount.count || 0,
      messages: msgCount.count || 0,
      unreadMessages: unreadMsgCount.count || 0,
      members: memberCount.count || 0,
    },
    recentAnnouncements: recent,
  };
};

// ═════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═════════════════════════════════════════════════════
export const fetchAnnouncements = async () => {
  const { data, error } = await supabase.from('announcements').select('*');
  if (error) throw error;
  return (data || []).sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    const da = new Date(a.publish_date || a.created_at || 0).getTime();
    const db = new Date(b.publish_date || b.created_at || 0).getTime();
    return db - da;
  });
};

export const createAnnouncement = async (payload) => {
  const { data, error } = await supabase.from('announcements').insert([payload]).select().single();
  if (error) throw error;
  return data;
};

export const updateAnnouncement = async (id, payload) => {
  const { data, error } = await supabase.from('announcements').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  if (error) throw error;
};

export const uploadAnnouncementImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `announcements/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
  return urlData.publicUrl;
};

// ═════════════════════════════════════════════════════
// MESSAGES
// ═════════════════════════════════════════════════════
export const fetchMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const markMessageRead = async (id, isRead) => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: Boolean(isRead) })
    .eq('id', id);
  if (error) throw error;
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
};

// ═════════════════════════════════════════════════════
// GALLERY
// ═════════════════════════════════════════════════════
export const fetchGallery = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createGalleryItem = async (payload) => {
  const { data, error } = await supabase.from('gallery').insert([payload]).select().single();
  if (error) throw error;
  return data;
};

export const updateGalleryItem = async (id, payload) => {
  const { data, error } = await supabase.from('gallery').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteGalleryItem = async (id) => {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
};

export const uploadGalleryImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
  return urlData.publicUrl;
};

export const reorderGallery = async (orderedItems) => {
  const updates = orderedItems.map((item, index) =>
    supabase.from('gallery').update({ sort_order: index }).eq('id', item.id)
  );
  const results = await Promise.all(updates);
  results.forEach((r) => { if (r.error) throw r.error; });
};

// ═════════════════════════════════════════════════════
// DOCUMENTS
// ═════════════════════════════════════════════════════
export const fetchDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createDocument = async (payload) => {
  const { data, error } = await supabase.from('documents').insert([payload]).select().single();
  if (error) throw error;
  return data;
};

export const updateDocument = async (id, payload) => {
  const { data, error } = await supabase.from('documents').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteDocument = async (id) => {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
};

export const uploadDocumentFile = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `documents/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
  return urlData.publicUrl;
};
// ═════════════════════════════════════════════════════
// LEADERSHIP (CLUB MEMBERS)
// ═════════════════════════════════════════════════════
export const fetchClubMembers = async () => {
  const { data, error } = await supabase
    .from('club_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createClubMember = async (payload) => {
  const { data, error } = await supabase.from('club_members').insert([payload]).select().single();
  if (error) throw error;
  return data;
};

export const updateClubMember = async (id, payload) => {
  const { data, error } = await supabase.from('club_members').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteClubMember = async (id) => {
  const { error } = await supabase.from('club_members').delete().eq('id', id);
  if (error) throw error;
};

// ═════════════════════════════════════════════════════
// PRESIDENT MESSAGE (SITE SETTINGS)
// ═════════════════════════════════════════════════════
export const fetchPresidentSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['president_name', 'president_title', 'president_image_url', 'president_message']);
  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
};

export const savePresidentSettings = async (settings) => {
  const entries = Object.entries(settings);
  const { error } = await supabase
    .from('site_settings')
    .upsert(entries.map(([key, value]) => ({ key, value: String(value || '') })), { onConflict: 'key' });
  if (error) throw error;
};

export const uploadPresidentImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `president/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
  return urlData.publicUrl;
};

// ═════════════════════════════════════════════════════
// MEMBERSHIP APPLICATIONS
// ═════════════════════════════════════════════════════
export const fetchApplications = async () => {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateApplication = async (id, payload) => {
  const { data, error } = await supabase.from('membership_applications').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteApplication = async (id) => {
  const { error } = await supabase.from('membership_applications').delete().eq('id', id);
  if (error) throw error;
};

export const getSignatureSignedUrl = async (path) => {
  if (!path) return null;
  // If it's already a full URL, return as-is
  if (path.startsWith('http')) return path;
  const { data, error } = await supabase.storage
    .from('member-signatures')
    .createSignedUrl(path, 300);
  if (error) return null;
  return data?.signedUrl || null;
};
// ═════════════════════════════════════════════════════
// SITE SETTINGS
// ═════════════════════════════════════════════════════
export const fetchAllSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');
  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
};

export const saveSiteSettings = async (settings) => {
  const entries = Object.entries(settings);
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      entries.map(([key, value]) => ({ key, value: String(value ?? '') })),
      { onConflict: 'key' }
    );
  if (error) throw error;
};

export const changeAdminPassword = async (oldPassword, newPassword) => {
  // Verify old password by re-signing in
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Δεν βρέθηκε χρήστης.');

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: oldPassword,
  });
  if (signInError) throw new Error('Ο τρέχων κωδικός είναι λανθασμένος.');

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) throw updateError;
};