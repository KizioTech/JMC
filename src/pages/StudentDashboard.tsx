import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { BookOpen, Video, GraduationCap, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { studentSidebarData } from '@/components/layout/data/studentSidebarData';
import { useAuth } from '@/contexts/AuthContext';

const StudentDashboard = () => {
  const { session, user, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout data={studentSidebarData(user)}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <DashboardLayout data={studentSidebarData(user)}>
      <div className="bg-surface-container-lowest border-b border-outline-variant py-12">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h1 className="font-headline-h2 text-headline-h2 text-primary">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Track your progress and pick up where you left off.
          </p>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Recent Activity */}
          <div className="md:col-span-2 space-y-gutter">
            <h2 className="font-headline-h3 text-headline-h3 text-on-surface">Recent Activity</h2>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <Clock className="w-12 h-12 text-outline/50" />
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                  You haven't started any courses or tutorials yet. Explore the library to begin your learning journey.
                </p>
                <Link to="/courses">
                  <button className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all">
                    Browse Courses
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-gutter">
            <h2 className="font-headline-h3 text-headline-h3 text-on-surface">Quick Access</h2>
            
            <div className="space-y-4">
              <Link to="/courses" className="flex items-center p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">My Courses</h3>
                  <p className="text-xs text-on-surface-variant mt-1">View enrolled courses</p>
                </div>
              </Link>
              
              <Link to="/tutorials" className="flex items-center p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">Tutorials</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Continue watching</p>
                </div>
              </Link>
              
              <Link to="/library" className="flex items-center p-4 bg-surface-container-low border border-outline-variant rounded-xl hover:bg-surface-container transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-beginner-green/10 text-beginner-green flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">Notes & Resources</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Access saved notes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
