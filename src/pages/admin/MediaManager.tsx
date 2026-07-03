import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Upload, Copy, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl: string;
  };
}

const MediaManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: files, isLoading } = useQuery({
    queryKey: ['media-files'],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('media').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      // Filter out empty folder placeholders (often have name '.emptyFolderPlaceholder')
      return (data as MediaFile[]).filter(f => f.name && !f.name.startsWith('.'));
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    },
    onError: (err: any) => alert(err.message || 'Upload failed'),
    onSettled: () => setUploading(false)
  });

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.storage.from('media').remove([name]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
    },
    onError: (err: any) => alert(err.message || 'Delete failed')
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      uploadMutation.mutate(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (name: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(name);
    navigator.clipboard.writeText(data.publicUrl);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (name: string) => {
    if (window.confirm("Are you sure you want to delete this image? It might break pages where it's used.")) {
      deleteMutation.mutate(name);
    }
  };

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-h2 text-headline-h2 text-primary">Media Library</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage uploaded images for notes and tutorials.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-on-surface-variant">Loading media...</div>
      ) : !files || files.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-outline mb-4" />
          <h3 className="font-headline-h3 text-headline-h3 font-semibold text-primary">No media yet</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Upload images to use them in your content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map(file => {
            const { data: urlData } = supabase.storage.from('media').getPublicUrl(file.name);
            return (
              <div key={file.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group flex flex-col relative">
                <div className="aspect-square bg-surface-container relative">
                  <img 
                    src={urlData.publicUrl} 
                    alt={file.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(file.name)}
                      className="p-2 bg-white/20 hover:bg-primary text-white rounded-full transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === file.name ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(file.name)}
                      className="p-2 bg-white/20 hover:bg-error text-white rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3 text-xs text-on-surface-variant truncate border-t border-outline-variant">
                  {file.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaManager;
