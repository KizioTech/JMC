import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function NoteCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 flex items-center justify-center p-4">
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1.5 pt-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TutorialCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="h-2 bg-gradient-to-r from-muted to-muted" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-4" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Skeleton className="h-12 w-3/4 mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[85%]" />
      </div>
      <Skeleton className="h-40 w-full my-8 rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[88%]" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="border rounded-md">
      <div className="border-b p-4 bg-muted/50">
        <Skeleton className="h-6 w-1/4" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex p-4 border-b last:border-b-0 gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
