import { ContentSkeleton } from "@/components/ui/Skeletons";

const Loading = () => {
  return (
    <div className="min-h-screen pt-20">
      <ContentSkeleton />
    </div>
  );
};

export default Loading;
