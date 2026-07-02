import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, BookOpen, Video, FileText, 
  Settings, Image, GraduationCap, ArrowLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ContentSkeleton } from '@/components/ui/Skeletons';

const AdminLayout = () => {
  const { session, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }


  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Notes', path: '/admin/notes', icon: FileText },
    { name: 'Tutorials', path: '/admin/tutorials', icon: Video },
    { name: 'Quizzes', path: '/admin/quizzes', icon: FileText },
    { name: 'Courses', path: '/admin/courses', icon: GraduationCap },
    { name: 'Media', path: '/admin/media', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-card shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border font-bold text-lg gap-2">
          <span className="text-primary">∑</span> Admin
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <h1 className="font-semibold text-lg">
            {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.user_metadata?.full_name || session.user.email}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-muted/20 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
