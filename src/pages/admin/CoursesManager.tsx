import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllAdminCourses, deleteCourse } from '@/services/courseService';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import CreateCourseDialog from '@/components/admin/CreateCourseDialog';

const CoursesManager = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: getAllAdminCourses
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete course.');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Courses Manager</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage structured courses composed of tutorials and notes.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
        <CreateCourseDialog open={createOpen} onOpenChange={setCreateOpen} />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Title</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Level</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase">Status</th>
                  <th className="px-6 py-3 font-label-caps text-label-caps text-outline uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!courses || courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center font-body-md text-body-md text-on-surface-variant">
                      No courses found. Create your first course!
                    </td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-body-md text-body-md font-semibold text-primary">{course.title}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant text-xs">{course.slug}</div>
                      </td>
                      <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">
                        {course.level || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.published ? 'bg-green-100 text-green-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/courses/${course.id}/edit`}>
                            <button className="px-4 py-1.5 border border-outline-variant rounded-lg font-label-caps text-label-caps text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-all flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(course.id)}
                            disabled={deleteMutation.isPending}
                            className="px-4 py-1.5 border border-error/30 rounded-lg font-label-caps text-label-caps text-error hover:bg-error hover:text-on-error hover:border-error transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManager;
