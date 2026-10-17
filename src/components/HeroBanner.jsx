import React, { useState, useEffect } from "react";
import { Play, Bookmark, Heart, Star, Info, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export const HeroBanner = ({
  featuredMovies = [],
  savedItems = {},
  onSelectMovie,
  onToggleWatchlist,
  onToggleFavorite,
  onPlayTrailer
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const current = featuredMovies[currentIndex];
  const isWatchlist = savedItems[current.id]?.status === "want_to_watch";
  const isFavorite = !!savedItems[current.id]?.isFavorite;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-10 border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Background Image with Dark Vignette */}
      <div className="relative h-[380px] sm:h-[450px] md:h-[520px] w-full overflow-hidden">
        <img
          src={current.backdrop || current.poster}
          alt={current.title}
          className="w-full h-full object-cover object-center filter brightness-[0.65] transition-all duration-700 ease-in-out scale-105"
        />

        {/* Cinematic Multi-stop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end max-w-3xl">
        {/* Spotlight Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600/90 text-white shadow-lg backdrop-blur-md">
            Featured Spotlight
          </span>
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-400 font-bold text-xs border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{current.ratings?.imdb || "8.5"} IMDb</span>
          </div>
          <span className="text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
            {current.year}
          </span>
          {current.runtime && (
            <span className="hidden sm:flex items-center gap-1 text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              {current.runtime}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
          {current.title}
        </h1>

        {/* Tagline */}
        {current.tagline && (
          <p className="text-rose-400 font-semibold text-sm sm:text-base italic mb-2">
            "{current.tagline}"
          </p>
        )}

        {/* Plot */}
        <p className="text-slate-300 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl leading-relaxed text-balance">
          {current.plot}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {current.trailerYoutubeId && (
            <button
              type="button"
              onClick={() => onPlayTrailer(current)}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Trailer</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onToggleWatchlist(current)}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 border transition-all ${
              isWatchlist
                ? "bg-rose-600/30 text-rose-300 border-rose-500 shadow-md"
                : "bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-600"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isWatchlist ? "fill-current" : ""}`} />
            <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(current)}
            className={`p-3 rounded-xl border transition-all ${
              isFavorite
                ? "bg-rose-600 text-white border-rose-500 shadow-md"
                : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-rose-400"
            }`}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => onSelectMovie(current)}
            className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-1.5 border border-slate-700"
          >
            <Info className="w-4 h-4" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous movie"
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-500 transition-all shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Carousel Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-rose-500" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next movie"
          className="p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-500 transition-all shadow-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
