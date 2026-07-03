import {
  LayoutDashboard,
  FolderOpen,
} from 'lucide-react';
import { type SidebarData } from '../types';

export const studentSidebarData = (user: { user_metadata?: { full_name?: string }; email?: string } | null): SidebarData => ({
  user: {
    name: user?.user_metadata?.full_name || 'Student',
    email: user?.email || 'student@jmc.edu',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
  },
  teams: [
    {
      name: 'JMC Student',
      logo: LayoutDashboard,
      plan: 'Basic Plan',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
        { title: 'Library', url: '/library', icon: FolderOpen },
      ],
    },
  ],
});

