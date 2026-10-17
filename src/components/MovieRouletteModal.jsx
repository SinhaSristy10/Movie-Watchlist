import React, { useState, useEffect } from "react";
import { X, Dices, Sparkles, Play, Bookmark, Star } from "lucide-react";
import confetti from "canvas-confetti";

export const MovieRouletteModal = ({
  allMovies,
  savedItems,
  onClose,
  onSelectMovie,
  onPlayTrailer
}) => {
  const [source, setSource] = useState("watchlist"); // 'watchlist' | 'all'
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedMovie, setPickedMovie] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Compute eligible movies
  const getEligibleMovies = () => {
    let pool = [];
    if (source === "watchlist") {
      pool = Object.values(savedItems)
        .filter((item) => item.status === "want_to_watch")
        .map((item) => item.movie);
    } else {
      pool = allMovies;
    }

    if (selectedGenre !== "All") {
      pool = pool.filter((m) =>
        Array.isArray(m.genre)
          ? m.genre.includes(selectedGenre)
          : m.genre?.toLowerCase()?.includes(selectedGenre.toLowerCase())
      );
    }

    return pool;
  };

  const handleSpin = () => {
    const pool = getEligibleMovies();
    if (!pool.length) return;

    setIsSpinning(true);
    setPickedMovie(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * pool.length);
      setPickedMovie(pool[randomIdx]);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }, 100);
  };

  const pool = getEligibleMovies();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 mb-3 shadow-lg">
            <Dices className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-black text-white">
            What to Watch Tonight?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Can't decide? Let the CineTrack wheel pick for you!
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Choose Source
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setSource("watchlist"); setPickedMovie(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  source === "watchlist"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                My Watchlist
              </button>
              <button
                type="button"
                onClick={() => { setSource("all"); setPickedMovie(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  source === "all"
                    ? "bg-rose-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Top Catalog
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            {pool.length} movies match your selection
          </p>
        </div>

        {/* Spin Result or Box */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 min-h-[180px] flex flex-col items-center justify-center text-center mb-6">
          {pickedMovie ? (
            <div className={`space-y-3 transition-transform ${isSpinning ? "scale-95 opacity-70" : "scale-100 opacity-100"}`}>
              <div className="w-20 h-28 mx-auto rounded-xl overflow-hidden shadow-lg border border-slate-700 bg-slate-800">
                <img
                  src={pickedMovie.poster}
                  alt={pickedMovie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  🎉 Tonight's Selection
                </span>
                <h3 className="font-heading text-lg font-bold text-white line-clamp-1">
                  {pickedMovie.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{pickedMovie.year}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{pickedMovie.ratings?.imdb}</span>
                  </div>
                </div>
              </div>

              {!isSpinning && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectMovie(pickedMovie);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Details
                  </button>
                  {pickedMovie.trailerYoutubeId && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onPlayTrailer(pickedMovie);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Trailer</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">
                {pool.length === 0
                  ? "No titles found in this source. Try selecting 'Top Catalog'!"
                  : "Click below to roll the movie dice!"}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={isSpinning || pool.length === 0}
          onClick={handleSpin}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm tracking-wide shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Dices className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "Spinning..." : "Pick My Movie!"}</span>
        </button>
      </div>
    </div>
  );
};
