import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, BookOpen, Video, FileText, 
  Settings, Image, GraduationCap, ArrowLeft,
  Menu, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const AdminLayout = () => {
  const { session, user, role, loading } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen pt-20"><ContentSkeleton /></div>;
  }

  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />;
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

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 px-3">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.name : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            } ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — collapsible to icons */}
      <aside className={`hidden md:flex flex-col border-r bg-card shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="h-16 flex items-center px-4 border-b font-bold text-lg gap-2 justify-between">
          {!collapsed && <span><span className="text-primary">∑</span> Admin</span>}
          <button onClick={() => setCollapsed(c => !c)} className="text-muted-foreground hover:text-foreground ml-auto">
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4"><Nav /></div>
        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="outline" className={`w-full gap-2 ${collapsed ? 'justify-center px-0' : 'justify-start'}`} title={collapsed ? "Back to Site" : undefined}>
              <ArrowLeft className="w-4 h-4 shrink-0" />
              {!collapsed && "Back to Site"}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile: hamburger + slide-in Sheet drawer, no permanent sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-16 flex items-center px-6 border-b font-bold text-lg gap-2">
            <span className="text-primary">∑</span> Admin
          </div>
          <div className="py-4"><Nav onNavigate={() => setMobileOpen(false)} /></div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-lg">
              {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
            </h1>
          </div>
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
        <div className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
