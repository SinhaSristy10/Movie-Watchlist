import React from "react";
import { Film, Heart, CheckCircle2, Search, Sparkles } from "lucide-react";

export const EmptyState = ({
  type = "watchlist",
  onAction,
  actionLabel = "Explore Movies",
  onLoadDemo
}) => {
  const configs = {
    watchlist: {
      icon: Film,
      title: "Your Watchlist is Empty",
      description: "You haven't added any movies or TV series to your watchlist yet. Browse trending titles and click the bookmark icon to save them for later!",
      actionText: "Explore Trending Movies"
    },
    favorites: {
      icon: Heart,
      title: "No Favorites Added Yet",
      description: "Save the cinema masterpieces you love the most. Click the heart icon on any movie card to pin it here.",
      actionText: "Browse Top Rated Cinema"
    },
    watched: {
      icon: CheckCircle2,
      title: "No Watched History Yet",
      description: "Keep track of every film and TV series you've seen, your personal star ratings, and watch reviews.",
      actionText: "Find Movies to Log"
    },
    search: {
      icon: Search,
      title: "No Movies Found",
      description: "We couldn't find any results matching your search terms or filter combinations. Try adjusting your query or genre filter.",
      actionText: "Reset Filters"
    }
  };

  const current = configs[type] || configs.watchlist;
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-14 rounded-3xl bg-slate-900/40 border border-slate-800/80 my-8 max-w-xl mx-auto animate-fade-in">
      <div className="p-4 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-rose-500 mb-4 shadow-xl">
        <IconComponent className="w-8 h-8" />
      </div>

      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
        {current.title}
      </h3>

      <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed mb-6">
        {current.description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95"
          >
            {actionLabel || current.actionText}
          </button>
        )}

        {onLoadDemo && type !== "search" && (
          <button
            type="button"
            onClick={onLoadDemo}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Load Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
