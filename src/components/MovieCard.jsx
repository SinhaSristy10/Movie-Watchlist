import React from "react";
import { Star, Heart, Bookmark, Check, Play, Calendar, Clock, Film, Tv } from "lucide-react";

export const MovieCard = ({
  movie,
  savedItem,
  onSelectMovie,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenWatchedModal,
  onPlayTrailer,
  viewMode = "grid"
}) => {
  const isWatchlist = savedItem?.status === "want_to_watch";
  const isWatched = savedItem?.status === "watched";
  const isFavorite = !!savedItem?.isFavorite;
  const userRating = savedItem?.rating;

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all duration-300">
        <div 
          className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
          onClick={() => onSelectMovie(movie)}
        >
          <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-800 shadow-md">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80";
              }}
            />
            {movie.trailerYoutubeId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrailer(movie);
                }}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title="Play Trailer"
              >
                <div className="p-2 rounded-full bg-rose-600/90 text-white shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </button>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                {movie.year}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 capitalize flex items-center gap-1">
                {movie.type === "series" ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                {movie.type}
              </span>
              {movie.runtime && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.runtime}
                </span>
              )}
            </div>

            <h3 className="font-heading text-lg font-bold text-white group-hover:text-rose-400 transition-colors truncate">
              {movie.title}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-xl">
              {movie.plot}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{movie.ratings?.imdb || "7.8"}</span>
                <span className="text-slate-500 font-normal">/10</span>
              </div>

              {userRating && (
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md font-medium">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  <span>My: {userRating}/10</span>
                </div>
              )}

              {movie.genre && movie.genre.slice(0, 3).map((g) => (
                <span key={g} className="hidden md:inline-block text-slate-400 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(movie);
            }}
            title={isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            className={`p-2.5 rounded-xl border transition-all ${
              isWatchlist
                ? "bg-rose-600/20 text-rose-400 border-rose-500/50 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isWatchlist ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-rose-400"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWatchedModal(movie);
            }}
            title={isWatched ? "Watched (Edit Review)" : "Mark as Watched"}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isWatched
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/50"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-500"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isWatched ? "Watched" : "Mark Watched"}</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div 
      className="group relative flex flex-col bg-slate-900/60 hover:bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-rose-500/40 movie-card-glow transition-all duration-300 cursor-pointer"
      onClick={() => onSelectMovie(movie)}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/30 group-hover:via-slate-950/40 transition-all duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white shadow">
            {movie.year}
          </span>
          
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-lg text-amber-400 font-semibold text-[11px] shadow">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{movie.ratings?.imdb || "7.8"}</span>
          </div>
        </div>

        {/* Quick Action Overlay (Bookmark & Heart & Play) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(movie);
              }}
              title={isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              className={`p-3 rounded-full border shadow-xl transition-transform hover:scale-110 active:scale-95 ${
                isWatchlist
                  ? "bg-rose-600 text-white border-rose-400"
                  : "bg-slate-900/90 text-white border-white/20 hover:bg-rose-600"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlist ? "fill-current" : ""}`} />
            </button>

            {movie.trailerYoutubeId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayTrailer(movie);
                }}
                title="Watch Trailer"
                className="p-3.5 rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-500 hover:scale-115 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(movie);
              }}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-3 rounded-full border shadow-xl transition-transform hover:scale-110 active:scale-95 ${
                isFavorite
                  ? "bg-rose-600 text-white border-rose-400"
                  : "bg-slate-900/90 text-white border-white/20 hover:bg-rose-600"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWatchedModal(movie);
            }}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg transition-transform hover:scale-102 active:scale-98 ${
              isWatched
                ? "bg-emerald-600 text-white border border-emerald-400"
                : "bg-slate-800 text-slate-100 hover:bg-emerald-600 hover:text-white border border-slate-700"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isWatched ? "Watched ✓" : "Mark as Watched"}</span>
          </button>
        </div>

        {/* User Rating Badge (if already rated) */}
        {userRating && (
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-2 py-0.5 rounded-lg text-xs font-bold shadow-lg">
            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            <span>{userRating}/10</span>
          </div>
        )}

        {/* Watched Banner */}
        {isWatched && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
            <Check className="w-3 h-3" />
            <span>SEEN</span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="font-heading font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-rose-400 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <span className="capitalize">{movie.type || "Movie"}</span>
            <span>•</span>
            <span className="truncate">{Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(", ") : movie.genre}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
