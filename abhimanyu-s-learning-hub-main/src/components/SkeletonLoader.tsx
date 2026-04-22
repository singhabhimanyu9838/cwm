import { Skeleton } from "@/components/ui/skeleton";

export const VideoCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-[180px] w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const PlaylistCardSkeleton = () => (
  <div className="flex flex-col space-y-3 p-4 border border-border rounded-xl">
    <Skeleton className="h-[160px] w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[120px]" />
    </div>
  </div>
);

export const POTDSkeleton = () => (
  <div className="p-6 border border-border rounded-xl space-y-4">
    <div className="flex gap-3">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-24" />
    </div>
    <Skeleton className="h-7 w-[300px]" />
    <Skeleton className="h-4 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-20" />
    </div>
  </div>
);
