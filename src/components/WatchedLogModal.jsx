import React, { useState, useEffect } from "react";
import { X, Star, Calendar, Tag, Check, Award } from "lucide-react";
import confetti from "canvas-confetti";

const SUGGESTED_TAGS = [
  "Masterpiece",
  "Mind-Bending",
  "Cinema IMAX",
  "Date Night",
  "Emotional",
  "Must Rewatch",
  "Soundtrack",
  "Recommended"
];

export const WatchedLogModal = ({
  movie,
  savedItem,
  onClose,
  onSaveWatchedLog
}) => {
  const [rating, setRating] = useState(savedItem?.rating || 8);
  const [review, setReview] = useState(savedItem?.review || "");
  const [dateWatched, setDateWatched] = useState(
    savedItem?.dateWatched || new Date().toISOString().slice(0, 10)
  );
  const [selectedTags, setSelectedTags] = useState(savedItem?.tags || []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const toggleTag = (t) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter((item) => item !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  const handleSave = () => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onSaveWatchedLog(movie, {
      rating: Number(rating),
      review,
      dateWatched,
      tags: selectedTags,
      status: "watched"
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100"
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

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-20 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700 shadow-md">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              Mark As Watched
            </span>
            <h3 className="font-heading text-xl font-bold text-white line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-xs text-slate-400">
              {movie.year} • {movie.runtime || "Feature Film"}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Rating Stars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Rating
              </label>
              <span className="text-base font-extrabold text-amber-400">
                {rating} <span className="text-xs text-slate-500 font-normal">/ 10</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className="p-1 hover:scale-130 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      num <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-700 hover:text-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Date Watched */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Date Watched
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateWatched}
                onChange={(e) => setDateWatched(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Personal Review */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Personal Review / Notes
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What stood out to you? Any favorite scenes or quotes?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Add Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      active
                        ? "bg-rose-600/30 text-rose-300 border-rose-500"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold text-xs sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Log & Complete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
