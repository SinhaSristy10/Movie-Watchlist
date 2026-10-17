import React from "react";
import { Search, X, SlidersHorizontal, LayoutGrid, List, Sparkles, Filter } from "lucide-react";
import { ALL_GENRES } from "../data/mockMovies";

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreSelect,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isLoading
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input & Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search movies, TV shows, directors, actors..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isLoading && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[11px] font-medium hidden sm:inline">Searching...</span>
            </div>
          )}
        </div>

        {/* Filters & View Switches */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Media Type Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onTypeChange("all")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedType === "all"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("movie")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedType === "movie"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              type="button"
              onClick={() => onTypeChange("series")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedType === "series"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Series
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2 text-xs font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="rating-desc" className="bg-slate-900">Highest Rated</option>
              <option value="year-desc" className="bg-slate-900">Newest First</option>
              <option value="year-asc" className="bg-slate-900">Oldest First</option>
              <option value="title-asc" className="bg-slate-900">Title (A-Z)</option>
              <option value="custom-rating" className="bg-slate-900">My Rating</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              title="Grid View"
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid"
                  ? "bg-slate-800 text-rose-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              title="List View"
              className={`p-2 rounded-xl transition-all ${
                viewMode === "list"
                  ? "bg-slate-800 text-rose-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Genre Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {ALL_GENRES.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              type="button"
              onClick={() => onGenreSelect(genre)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-rose-600/20 text-rose-400 border-rose-500/60 shadow-sm"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};
