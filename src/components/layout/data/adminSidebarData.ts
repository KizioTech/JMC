import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Video,
  GraduationCap,
  Image,
  Settings,
} from 'lucide-react';
import { type SidebarData } from '../types';

export const adminSidebarData = (user: { user_metadata?: { full_name?: string }; email?: string } | null): SidebarData => ({
  user: {
    name: user?.user_metadata?.full_name || 'Admin',
    email: user?.email || 'admin@jmc.edu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  },
  teams: [
    {
      name: 'JMC Admin',
      logo: LayoutDashboard,
      plan: 'Curator',
    },
  ],
  navGroups: [
    {
      title: 'Content Management',
      items: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
        { title: 'Subjects', url: '/admin/subjects', icon: BookOpen },
        { title: 'Notes', url: '/admin/notes', icon: FileText },
        { title: 'Tutorials', url: '/admin/tutorials', icon: Video },
        { title: 'Quizzes', url: '/admin/quizzes', icon: FileText },
      ],
    },
    {
      title: 'Platform',
      items: [
        { title: 'Courses', url: '/admin/courses', icon: GraduationCap },
        { title: 'Media', url: '/admin/media', icon: Image },
      ],
    },
    {
      title: 'System',
      items: [
        { title: 'Settings', url: '/admin/settings', icon: Settings },
      ],
    },
  ],
});
