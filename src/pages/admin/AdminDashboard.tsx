import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { FileText, Video, BookOpen, GraduationCap, TrendingUp, Plus, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [notes, tutorials, subjects, courses] = await Promise.all([
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('tutorials').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
      ]);
      return {
        notes: notes.count || 0,
        tutorials: tutorials.count || 0,
        subjects: subjects.count || 0,
        courses: courses.count || 0,
      };
    }
  });

  const { data: recentActivity, isLoading: loadingActivity } = useQuery({
    queryKey: ['admin-recent'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notes')
        .select('id, title, updated_at, subjects(name)')
        .order('updated_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const statCards = [
    {
      title: 'Notes Published',
      value: stats?.notes || 0,
      icon: FileText,
      bg: 'bg-primary-fixed',
      color: 'text-on-primary-fixed',
      trend: '+4%',
      trendColor: 'text-beginner-green',
      link: '/admin/notes'
    },
    {
      title: 'Tutorials Active',
      value: stats?.tutorials || 0,
      icon: Video,
      bg: 'bg-tertiary-fixed',
      color: 'text-on-tertiary-fixed',
      trend: '+12%',
      trendColor: 'text-beginner-green',
      link: '/admin/tutorials'
    },
    {
      title: 'Subjects Cataloged',
      value: stats?.subjects || 0,
      icon: BookOpen,
      bg: 'bg-secondary-fixed',
      color: 'text-on-secondary-fixed-variant',
      trend: '0%',
      trendColor: 'text-on-surface-variant',
      link: '/admin/subjects'
    },
    {
      title: 'Premium Courses',
      value: stats?.courses || 0,
      icon: GraduationCap,
      bg: 'bg-surface-container-highest',
      color: 'text-primary',
      trend: '+2%',
      trendColor: 'text-beginner-green',
      link: '/admin/courses'
    },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <div className="space-y-stack-lg">
      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <div className="bg-white/70 backdrop-blur-md border border-outline-variant/80 p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <span className={cn("font-label-caps text-label-caps flex items-center gap-1", stat.trendColor)}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-body-sm text-body-sm text-on-surface-variant">{stat.title}</h3>
                {isLoading ? (
                  <div className="h-8 w-16 bg-surface-container-high rounded animate-pulse mt-1" />
                ) : (
                  <p className="font-headline-h1 text-headline-h1 font-bold text-primary">{stat.value}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
        {/* Recent Activity */}
        <section className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-outline-variant/80 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h2 className="font-headline-h3 text-headline-h3 font-bold text-primary">Recent Activity</h2>
            <Link to="/admin/notes" className="text-primary font-body-sm text-body-sm font-semibold hover:underline">View All</Link>
          </div>
          {loadingActivity ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : recentActivity && recentActivity.length > 0 ? (
            <div className="divide-y divide-outline-variant">
              {recentActivity.map((note: { id: string; title: string; updated_at: string; subjects: { name: string } | null }) => (
                <div key={note.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-theorem-blue flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-on-tertiary-fixed-variant" />
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-primary">{note.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {formatDate(note.updated_at)} in <span className="text-primary font-medium">{note.subjects?.name}</span>
                      </p>
                    </div>
                  </div>
                  <Link to={`/admin/notes/${note.id}/edit`}>
                    <button className="px-4 py-1.5 border border-outline rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all">
                      Edit
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">No recent activity found.</p>
            </div>
          )}
        </section>

        {/* Quick Actions Column */}
        <aside className="space-y-stack-md">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-sm border border-outline-variant/80">
            <h2 className="font-headline-h3 text-headline-h3 font-bold text-primary mb-stack-sm">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/admin/notes" className="block w-full">
                <button className="w-full flex items-center justify-start gap-3 p-4 bg-primary text-on-primary rounded-lg hover:shadow-lg hover:scale-[1.01] transition-all active:scale-95">
                  <div className="p-2 bg-white/10 rounded-md">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-body-md text-body-md font-semibold">Create New Note</span>
                </button>
              </Link>
              <Link to="/admin/tutorials" className="block w-full">
                <button className="w-full flex items-center justify-start gap-3 p-4 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest transition-all">
                  <div className="p-2 rounded-md">
                    <Film className="w-5 h-5 text-on-primary-container" />
                  </div>
                  <span className="font-body-md text-body-md font-semibold">Add Tutorial</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Storage / Info Card */}
          <div className="bg-tertiary-container text-white p-6 rounded-xl shadow-sm border border-outline-variant">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label-caps text-label-caps opacity-80">Platform Health</h3>
              <BookOpen className="w-5 h-5 opacity-60" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between font-body-sm text-body-sm mb-1">
                  <span>Content Coverage</span>
                  <span className="font-bold">{stats ? Math.min(Math.round((stats.notes + stats.tutorials) * 2.5), 100) : 0}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${stats ? Math.min(Math.round((stats.notes + stats.tutorials) * 2.5), 100) : 0}%` }}></div>
                </div>
              </div>
              <p className="text-[11px] opacity-60 leading-relaxed italic pt-1">
                Keep adding quality content to grow your academic platform.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
