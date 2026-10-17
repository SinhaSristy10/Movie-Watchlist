import React from "react";
import { Film, Bookmark, Heart, CheckCircle2, BarChart3, Dices, Settings, Download, Upload, Sparkles } from "lucide-react";
import { exportWatchlistToJson } from "../services/storage";

export const Navbar = ({
  activeTab,
  onTabChange,
  savedCounts,
  onOpenRoulette,
  onOpenApiSettings,
  onLoadDemoData
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
          onClick={() => onTabChange("explore")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
            <Film className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
              CINE<span className="text-rose-500">TRACK</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase block -mt-1 hidden sm:block">
              Watchlist & Cinema Diary
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => onTabChange("explore")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "explore"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("watchlist")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "watchlist"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Watchlist</span>
            {savedCounts.watchlist > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-rose-300 border border-rose-500/30">
                {savedCounts.watchlist}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("favorites")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "favorites"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favorites</span>
            {savedCounts.favorites > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-rose-300 border border-rose-500/30">
                {savedCounts.favorites}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("watched")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "watched"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Watched</span>
            {savedCounts.watched > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-emerald-300 border border-emerald-500/30">
                {savedCounts.watched}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("stats")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === "stats"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Movie Roulette Button */}
          <button
            type="button"
            onClick={onOpenRoulette}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Dices className="w-4 h-4" />
            <span className="hidden sm:inline">Surprise Me!</span>
          </button>

          {/* Backup / Export */}
          <button
            type="button"
            onClick={exportWatchlistToJson}
            title="Export Backup (JSON)"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Load Demo Data */}
          <button
            type="button"
            onClick={onLoadDemoData}
            title="Load Sample Watchlist & Ratings"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Demo</span>
          </button>

          {/* API Settings */}
          <button
            type="button"
            onClick={onOpenApiSettings}
            title="Movie API Settings"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 bg-slate-950/95 text-xs font-semibold">
        <button
          type="button"
          onClick={() => onTabChange("explore")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === "explore" ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <Film className="w-4 h-4" />
          <span className="text-[10px]">Explore</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("watchlist")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg relative ${
            activeTab === "watchlist" ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px]">Watchlist</span>
          {savedCounts.watchlist > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("favorites")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg relative ${
            activeTab === "favorites" ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-[10px]">Favorites</span>
          {savedCounts.favorites > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("watched")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg relative ${
            activeTab === "watched" ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px]">Watched</span>
          {savedCounts.watched > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("stats")}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            activeTab === "stats" ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Stats</span>
        </button>
      </div>
    </header>
  );
};
