import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Video, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      // Get the 5 most recently updated notes
      const { data } = await supabase
        .from('notes')
        .select('id, title, updated_at, subjects(name)')
        .order('updated_at', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  const statCards = [
    { title: 'Total Notes', value: stats?.notes || 0, icon: FileText, color: 'text-blue-500', link: '/admin/notes' },
    { title: 'Total Tutorials', value: stats?.tutorials || 0, icon: Video, color: 'text-purple-500', link: '/admin/tutorials' },
    { title: 'Subjects', value: stats?.subjects || 0, icon: BookOpen, color: 'text-green-500', link: '/admin/subjects' },
    { title: 'Courses', value: stats?.courses || 0, icon: GraduationCap, color: 'text-orange-500', link: '/admin/courses' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link}>
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? <div className="h-8 w-16 bg-muted rounded animate-pulse" /> : stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Note Updates</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingActivity ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-12 bg-muted rounded animate-pulse" />)}
              </div>
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="divide-y border rounded-md">
                {recentActivity.map((note) => (
                  <div key={note.id} className="flex justify-between items-center p-4">
                    <div>
                      <p className="font-medium text-sm">{note.title}</p>
                      <p className="text-xs text-muted-foreground">{note.subjects?.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/notes/new" className="block w-full">
              <div className="flex items-center gap-3 p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Create New Note</p>
                  <p className="text-xs text-muted-foreground">Write a new mathematical note or article</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin/tutorials/new" className="block w-full">
              <div className="flex items-center gap-3 p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Create New Tutorial</p>
                  <p className="text-xs text-muted-foreground">Add a new tutorial with video links and exercises</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
