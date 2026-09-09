import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loading from './Loading';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }
      // Check admin role
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        setLoading(false);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <Loading full message="Checking authorization..." />;

  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;