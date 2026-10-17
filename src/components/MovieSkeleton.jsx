import React from "react";

export const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-800/80 animate-pulse">
      <div className="relative aspect-[2/3] w-full skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-800 rounded-md w-3/4 skeleton-shimmer" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-800 rounded-md w-1/4 skeleton-shimmer" />
          <div className="h-4 bg-slate-800 rounded-md w-1/4 skeleton-shimmer" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 bg-slate-800 rounded-full w-14 skeleton-shimmer" />
          <div className="h-5 bg-slate-800 rounded-full w-14 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};

export const MovieSkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
