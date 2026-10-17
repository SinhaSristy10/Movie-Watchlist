import React, { useState, useEffect } from "react";
import { X, Star, Heart, Bookmark, Check, Play, Film, Calendar, Clock, Award, Users, Video } from "lucide-react";

export const MovieDetailsModal = ({
  movie,
  savedItem,
  onClose,
  onToggleWatchlist,
  onToggleFavorite,
  onOpenWatchedModal,
  onSaveNotesAndRating
}) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [userRating, setUserRating] = useState(savedItem?.rating || 0);
  const [userReview, setUserReview] = useState(savedItem?.review || "");
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  useEffect(() => {
    setUserRating(savedItem?.rating || 0);
    setUserReview(savedItem?.review || "");
    setIsPlayingTrailer(false);
  }, [movie?.id, savedItem]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const isWatchlist = savedItem?.status === "want_to_watch";
  const isWatched = savedItem?.status === "watched";
  const isFavorite = !!savedItem?.isFavorite;

  const handleSaveUserLog = () => {
    onSaveNotesAndRating(movie, {
      rating: userRating ? Number(userRating) : null,
      review: userReview
    });
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details modal"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 transition-all border border-white/10 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media / Header Section (Trailer or Backdrop) */}
        <div className="relative aspect-video max-h-[360px] w-full bg-black overflow-hidden">
          {isPlayingTrailer && movie.trailerYoutubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <>
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              {/* Play Trailer Floating Button */}
              {movie.trailerYoutubeId && (
                <button
                  type="button"
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Info Row */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Small Poster thumbnail */}
            <div className="hidden sm:block w-36 h-52 rounded-xl overflow-hidden shadow-xl border border-slate-700/60 shrink-0 bg-slate-800 -mt-20 z-10">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/30 uppercase">
                  {movie.type}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                  {movie.year}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  {movie.rated}
                </span>
                {movie.runtime && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {movie.runtime}
                  </span>
                )}
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h2>

              {movie.tagline && (
                <p className="text-rose-400/90 italic text-sm mt-1">"{movie.tagline}"</p>
              )}

              {/* Ratings Badges */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-400">{movie.ratings?.imdb || "7.8"}</span>
                  <span className="text-xs text-slate-500">IMDb</span>
                </div>

                {movie.ratings?.rottenTomatoes && (
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
                    <span className="text-xs font-bold text-rose-400">🍅 {movie.ratings.rottenTomatoes}</span>
                    <span className="text-xs text-slate-500">Rotten Tomatoes</span>
                  </div>
                )}

                {movie.ratings?.metascore && (
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
                    <span className="text-xs font-bold text-emerald-400">Ⓜ {movie.ratings.metascore}</span>
                    <span className="text-xs text-slate-500">Metascore</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <button
              type="button"
              onClick={() => onToggleWatchlist(movie)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                isWatchlist
                  ? "bg-rose-600/30 text-rose-300 border-rose-500"
                  : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlist ? "fill-current" : ""}`} />
              <span>{isWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(movie)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                isFavorite
                  ? "bg-rose-600 text-white border-rose-500"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-rose-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenWatchedModal(movie)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition-all ${
                isWatched
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 border-slate-700"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isWatched ? "Watched ✓ (Log)" : "Mark Watched"}</span>
            </button>

            {movie.trailerYoutubeId && !isPlayingTrailer && (
              <button
                type="button"
                onClick={() => setIsPlayingTrailer(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 ml-auto"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Trailer</span>
              </button>
            )}
          </div>

          {/* Plot & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                  Synopsis
                </h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {movie.plot}
                </p>
              </div>

              {/* Personal Notes / Review Section */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-rose-400">
                    Your Personal Log & Review
                  </h4>
                  {isSavedNotes && (
                    <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                      Saved to local storage!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-0.5 hover:scale-125 transition-transform"
                        title={`${star}/10`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= userRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-700 hover:text-slate-500"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <span className="text-xs font-bold text-amber-400 ml-1">{userRating}/10</span>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  placeholder="Add your personal notes, thoughts, or where you watched it..."
                  className="w-full text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveUserLog}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata Sidebar */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 block text-xs font-semibold mb-1">Director</span>
                <span className="font-semibold text-slate-200">{movie.director}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-xs font-semibold mb-1">Starring</span>
                <span className="text-slate-300 leading-normal">{movie.actors}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-xs font-semibold mb-1">Genres</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {movie.genre && (Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {movie.awards && (
                <div>
                  <span className="text-slate-400 block text-xs font-semibold mb-1">Awards</span>
                  <div className="flex items-start gap-1.5 text-amber-300/90 text-xs">
                    <Award className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{movie.awards}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
