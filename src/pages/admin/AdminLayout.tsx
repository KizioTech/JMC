import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { adminSidebarData } from '@/components/layout/data/adminSidebarData';

const AdminLayout = () => {
  const { session, user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <DashboardLayout data={adminSidebarData(user)} />;
};

export default AdminLayout;
