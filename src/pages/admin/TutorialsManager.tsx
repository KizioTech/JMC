import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllAdminTutorials } from '@/services/contentService';
import { Plus } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Skeletons';
import CreateContentDialog from '@/components/admin/CreateContentDialog';
import ContentTable from '@/components/admin/ContentTable';

const TutorialsManager = () => {
  const [createOpen, setCreateOpen] = React.useState(false);
  const { data: tutorials, isLoading } = useQuery({
    queryKey: ['admin-tutorials'],
    queryFn: getAllAdminTutorials
  });

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Tutorials Manager</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage all tutorials and video content.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Tutorial
        </button>
        <CreateContentDialog open={createOpen} onOpenChange={setCreateOpen} type="tutorial" />
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : (
          <ContentTable items={tutorials || []} type="tutorial" />
        )}
      </div>
    </div>
  );
};

export default TutorialsManager;
