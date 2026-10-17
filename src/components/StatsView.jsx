import React from "react";
import { Film, CheckCircle2, Clock, Star, Heart, TrendingUp, Calendar, Tag, BarChart3 } from "lucide-react";

export const StatsView = ({ savedItems = {}, onSelectMovie }) => {
  const allEntries = Object.values(savedItems);
  const watchedEntries = allEntries.filter((item) => item.status === "watched");
  const wantToWatchEntries = allEntries.filter((item) => item.status === "want_to_watch");
  const favoriteEntries = allEntries.filter((item) => item.isFavorite);

  // Compute total watched runtime in minutes
  const totalMinutes = watchedEntries.reduce((acc, curr) => {
    const mins = curr.movie?.runtimeMinutes || 120;
    return acc + mins;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  // Average User Rating
  const ratedEntries = watchedEntries.filter((item) => item.rating);
  const avgRating = ratedEntries.length
    ? (
        ratedEntries.reduce((acc, curr) => acc + Number(curr.rating), 0) /
        ratedEntries.length
      ).toFixed(1)
    : "—";

  // Genre Breakdown for Watched
  const genreCounts = {};
  watchedEntries.forEach((item) => {
    const genres = Array.isArray(item.movie?.genre)
      ? item.movie.genre
      : [item.movie?.genre || "Other"];
    genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxGenreCount = sortedGenres.length ? sortedGenres[0][1] : 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-rose-500" />
          <span>Cinematic Analytics & Stats</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Track your watching habits, total screen time, top genres, and ratings history.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Watched */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Movies Watched</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-white font-heading">
              {watchedEntries.length}
            </div>
            <span className="text-xs text-slate-400">completed titles</span>
          </div>
        </div>

        {/* Watch Time */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Screen Time</span>
            <Clock className="w-5 h-5 text-rose-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-white font-heading">
              {hours}<span className="text-xl font-medium text-slate-400">h </span>
              {remainingMins}<span className="text-xl font-medium text-slate-400">m</span>
            </div>
            <span className="text-xs text-slate-400">total time invested</span>
          </div>
        </div>

        {/* Average Rating */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-white font-heading flex items-baseline gap-1">
              <span>{avgRating}</span>
              {avgRating !== "—" && <span className="text-sm text-slate-500">/ 10</span>}
            </div>
            <span className="text-xs text-slate-400">across {ratedEntries.length} rated titles</span>
          </div>
        </div>

        {/* In Watchlist */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">In Watchlist</span>
            <Film className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-black text-white font-heading">
              {wantToWatchEntries.length}
            </div>
            <span className="text-xs text-slate-400">queued for movie night</span>
          </div>
        </div>
      </div>

      {/* Breakdown Row: Top Genres & Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <span>Top Watched Genres</span>
          </h3>

          {sortedGenres.length > 0 ? (
            <div className="space-y-3 pt-2">
              {sortedGenres.map(([genre, count], idx) => {
                const percent = Math.round((count / maxGenreCount) * 100);
                const colors = [
                  "bg-rose-500",
                  "bg-purple-500",
                  "bg-indigo-500",
                  "bg-amber-500",
                  "bg-emerald-500",
                  "bg-sky-500"
                ];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={genre} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{genre}</span>
                      <span className="text-slate-400">{count} {count === 1 ? "movie" : "movies"}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No watched movies yet. Mark titles as watched to see your genre breakdown!
            </p>
          )}
        </div>

        {/* Favorites Highlights */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Favorite Films ({favoriteEntries.length})</span>
          </h3>

          {favoriteEntries.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {favoriteEntries.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectMovie(item.movie)}
                  className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 cursor-pointer shadow hover:scale-105 transition-transform"
                >
                  <img
                    src={item.movie?.poster}
                    alt={item.movie?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                    <span className="text-[11px] font-bold text-white line-clamp-1">
                      {item.movie?.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              You haven't added any favorites yet. Click the heart on any movie card!
            </p>
          )}
        </div>
      </div>

      {/* Watched Journal / Activity Log */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>Recent Watch Activity & Reviews</span>
        </h3>

        {watchedEntries.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {watchedEntries.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => onSelectMovie(item.movie)}
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    <img
                      src={item.movie?.poster}
                      alt={item.movie?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white hover:text-rose-400 transition-colors">
                      {item.movie?.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{item.dateWatched || "Recently seen"}</span>
                      {item.movie?.runtime && (
                        <>
                          <span>•</span>
                          <span>{item.movie.runtime}</span>
                        </>
                      )}
                    </div>
                    {item.review && (
                      <p className="text-xs text-slate-300 italic mt-1.5 max-w-lg bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        "{item.review}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 self-end sm:self-center">
                  {item.rating && (
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating}/10</span>
                    </div>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">
            No watched logs recorded yet.
          </p>
        )}
      </div>
    </div>
  );
};
