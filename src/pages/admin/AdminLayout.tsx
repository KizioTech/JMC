import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, BookOpen, Video, FileText,
  Settings, Image, GraduationCap, ArrowLeft,
  Menu, ChevronsLeft, ChevronsRight, Search, Bell
} from 'lucide-react';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ContentSkeleton } from '@/components/ui/Skeletons';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

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

  const currentPage = navItems.find(
    i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path))
  )?.name || 'Dashboard';

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 px-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.name}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.name : undefined}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-label-caps text-label-caps",
              collapsed ? "justify-center px-3" : "",
              isActive
                ? "bg-primary-fixed text-on-primary-fixed font-bold"
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-outline-variant bg-surface-container-low shrink-0 h-screen sticky top-0 transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-outline-variant shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-on-primary font-bold text-lg">∑</span>
          </div>
          {!collapsed && (
            <span className="font-headline-h3 text-headline-h3 font-bold text-primary truncate">JMC Admin</span>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-6">
          <Nav />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-outline-variant space-y-2">
          <Link to="/" className="block">
            <button className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all font-label-caps text-label-caps",
              collapsed ? "justify-center" : ""
            )}>
              <ArrowLeft className="w-5 h-5 shrink-0" />
              {!collapsed && "Back to Site"}
            </button>
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-outline hover:bg-surface-container-high transition-all",
              collapsed ? "justify-center" : "justify-end"
            )}
          >
            {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Sheet Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-surface-container-low border-r border-outline-variant">
          <div className="h-16 flex items-center px-6 border-b border-outline-variant gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-on-primary font-bold text-lg">∑</span>
            </div>
            <span className="font-headline-h3 text-headline-h3 font-bold text-primary">JMC Admin</span>
          </div>
          <div className="py-6">
            <Nav onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Bar */}
        <header className="h-16 shrink-0 bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 md:px-margin-desktop z-30 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-on-surface-variant hover:text-on-surface" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-headline-h3 text-headline-h3 font-bold text-primary">{currentPage}</h1>
            </div>
          </div>
          <div className="flex items-center gap-gutter">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary w-52 transition-all focus:outline-none placeholder:text-outline"
                placeholder="Search resources..."
                type="text"
              />
            </div>
            {/* Notifications */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all text-on-surface-variant relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <ThemeSelector />
            {/* User */}
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="font-label-caps text-label-caps text-primary">{user?.user_metadata?.full_name || 'Admin'}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Curator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-auto p-4 md:p-margin-desktop bg-surface">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
