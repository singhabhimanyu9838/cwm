import { Skeleton } from "@/components/ui/skeleton";

export const VideoCardSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-[180px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </div>
    ))}
  </div>
);

export const PlaylistCardSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex flex-col space-y-3 p-4 border border-border rounded-2xl bg-card/50">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const POTDSkeleton = () => (
  <div className="space-y-8">
    {[1, 2].map((i) => (
      <div key={i} className="p-8 border-2 border-border/50 rounded-2xl space-y-5 bg-card/30">
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
        <Skeleton className="h-10 w-[70%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-11 w-32 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

interface SkeletonLoaderProps {
  type: "video" | "playlist" | "potd";
}

const SkeletonLoader = ({ type }: SkeletonLoaderProps) => {
  switch (type) {
    case "video":
      return <VideoCardSkeleton />;
    case "playlist":
      return <PlaylistCardSkeleton />;
    case "potd":
      return <POTDSkeleton />;
    default:
      return null;
  }
};

export default SkeletonLoader;
