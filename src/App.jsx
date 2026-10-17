import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { FilterBar } from "./components/FilterBar";
import { MovieCard } from "./components/MovieCard";
import { MovieSkeletonGrid } from "./components/MovieSkeleton";
import { MovieDetailsModal } from "./components/MovieDetailsModal";
import { WatchedLogModal } from "./components/WatchedLogModal";
import { MovieRouletteModal } from "./components/MovieRouletteModal";
import { ApiSettingsModal } from "./components/ApiSettingsModal";
import { StatsView } from "./components/StatsView";
import { EmptyState } from "./components/EmptyState";
import { Toast } from "./components/Toast";
import { MOCK_MOVIES } from "./data/mockMovies";
import { searchMoviesApi, normalizeMovie } from "./services/movieApi";
import { getSavedItems, saveSavedItems, loadDemoWatchlist } from "./services/storage";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState("explore");
  const [movies, setMovies] = useState(() => MOCK_MOVIES.map(m => normalizeMovie(m, "catalog")));
  const [savedItems, setSavedItems] = useState(() => getSavedItems());
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("rating-desc");
  const [viewMode, setViewMode] = useState("grid");

  // Modals & Overlays
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState(null);
  const [watchedModalMovie, setWatchedModalMovie] = useState(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Synchronize storage
  useEffect(() => {
    const handleStorageUpdate = () => {
      setSavedItems(getSavedItems());
    };
    window.addEventListener("cinetrack_storage_updated", handleStorageUpdate);
    return () => window.removeEventListener("cinetrack_storage_updated", handleStorageUpdate);
  }, []);

  // Debounced search with API
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setApiError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchMoviesApi(searchQuery, { signal: controller.signal });
        setMovies(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setApiError("Failed to fetch live search results. Showing offline catalog.");
          // Fallback to local
          const localFiltered = MOCK_MOVIES.filter(m =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(m => normalizeMovie(m, "catalog"));
          setMovies(localFiltered);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Toast Helper
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Watchlist & Favorite Toggles
  const handleToggleWatchlist = useCallback((movie) => {
    const current = { ...savedItems };
    const existing = current[movie.id];

    if (existing?.status === "want_to_watch") {
      delete current[movie.id];
      showToast(`Removed "${movie.title}" from your watchlist.`);
    } else {
      current[movie.id] = {
        id: movie.id,
        status: "want_to_watch",
        isFavorite: existing?.isFavorite || false,
        rating: existing?.rating || null,
        review: existing?.review || "",
        dateAdded: new Date().toISOString().slice(0, 10),
        dateWatched: existing?.dateWatched || null,
        tags: existing?.tags || [],
        movie
      };
      showToast(`Added "${movie.title}" to your watchlist!`);
    }

    setSavedItems(current);
    saveSavedItems(current);
  }, [savedItems, showToast]);

  const handleToggleFavorite = useCallback((movie) => {
    const current = { ...savedItems };
    const existing = current[movie.id];

    if (existing) {
      existing.isFavorite = !existing.isFavorite;
      showToast(
        existing.isFavorite
          ? `Added "${movie.title}" to Favorites ❤️`
          : `Removed "${movie.title}" from Favorites.`
      );
    } else {
      current[movie.id] = {
        id: movie.id,
        status: "want_to_watch",
        isFavorite: true,
        rating: null,
        review: "",
        dateAdded: new Date().toISOString().slice(0, 10),
        dateWatched: null,
        tags: [],
        movie
      };
      showToast(`Added "${movie.title}" to Favorites ❤️`);
    }

    setSavedItems(current);
    saveSavedItems(current);
  }, [savedItems, showToast]);

  const handleOpenWatchedModal = useCallback((movie) => {
    setWatchedModalMovie(movie);
  }, []);

  const handleSaveWatchedLog = useCallback((movie, details) => {
    const current = { ...savedItems };
    const existing = current[movie.id] || {};

    current[movie.id] = {
      ...existing,
      id: movie.id,
      status: "watched",
      isFavorite: existing.isFavorite || false,
      rating: details.rating,
      review: details.review,
      dateWatched: details.dateWatched,
      tags: details.tags,
      dateAdded: existing.dateAdded || new Date().toISOString().slice(0, 10),
      movie
    };

    setSavedItems(current);
    saveSavedItems(current);
    showToast(`Logged "${movie.title}" as Watched! 🎉`);
  }, [savedItems, showToast]);

  const handleSaveNotesAndRating = useCallback((movie, { rating, review }) => {
    const current = { ...savedItems };
    const existing = current[movie.id] || {};

    current[movie.id] = {
      ...existing,
      id: movie.id,
      status: existing.status || "want_to_watch",
      isFavorite: existing.isFavorite || false,
      rating: rating,
      review: review,
      dateAdded: existing.dateAdded || new Date().toISOString().slice(0, 10),
      movie
    };

    setSavedItems(current);
    saveSavedItems(current);
    showToast(`Updated notes for "${movie.title}".`);
  }, [savedItems, showToast]);

  const handleLoadDemo = useCallback(() => {
    const loaded = loadDemoWatchlist(MOCK_MOVIES);
    setSavedItems(loaded);
    showToast("Loaded demo watchlist & reviews!");
  }, [showToast]);

  // Filtered & Sorted Display Movies based on activeTab
  const displayMovies = useMemo(() => {
    let sourceList = [];

    if (activeTab === "explore") {
      sourceList = movies;
    } else if (activeTab === "watchlist") {
      sourceList = Object.values(savedItems)
        .filter((item) => item.status === "want_to_watch")
        .map((item) => item.movie);
    } else if (activeTab === "favorites") {
      sourceList = Object.values(savedItems)
        .filter((item) => item.isFavorite)
        .map((item) => item.movie);
    } else if (activeTab === "watched") {
      sourceList = Object.values(savedItems)
        .filter((item) => item.status === "watched")
        .map((item) => item.movie);
    }

    // Filter by Genre
    if (selectedGenre !== "All") {
      sourceList = sourceList.filter((m) =>
        Array.isArray(m.genre)
          ? m.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
          : m.genre?.toLowerCase()?.includes(selectedGenre.toLowerCase())
      );
    }

    // Filter by Media Type
    if (selectedType !== "all") {
      sourceList = sourceList.filter((m) => m.type === selectedType);
    }

    // Search query within current tab
    if (searchQuery.trim() && activeTab !== "explore") {
      const q = searchQuery.toLowerCase();
      sourceList = sourceList.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        m.director?.toLowerCase().includes(q) ||
        m.actors?.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...sourceList].sort((a, b) => {
      if (sortBy === "rating-desc") {
        const ratingA = a.ratings?.imdb ? Number(a.ratings.imdb) : 0;
        const ratingB = b.ratings?.imdb ? Number(b.ratings.imdb) : 0;
        return ratingB - ratingA;
      }
      if (sortBy === "year-desc") {
        return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
      }
      if (sortBy === "year-asc") {
        return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "custom-rating") {
        const customA = savedItems[a.id]?.rating || 0;
        const customB = savedItems[b.id]?.rating || 0;
        return customB - customA;
      }
      return 0;
    });
  }, [activeTab, movies, savedItems, selectedGenre, selectedType, searchQuery, sortBy]);

  // Counts for Badges
  const savedCounts = useMemo(() => {
    const all = Object.values(savedItems);
    return {
      watchlist: all.filter((i) => i.status === "want_to_watch").length,
      favorites: all.filter((i) => i.isFavorite).length,
      watched: all.filter((i) => i.status === "watched").length
    };
  }, [savedItems]);

  // Featured Spotlight list for explore
  const featuredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((m) => m.featured).map((m) => normalizeMovie(m, "catalog"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        savedCounts={savedCounts}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onLoadDemoData={handleLoadDemo}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Network / API Warning Banner if any */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
              <span>{apiError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery((prev) => prev + " ")}
              className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-amber-200 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "stats" ? (
          <StatsView
            savedItems={savedItems}
            onSelectMovie={(movie) => setSelectedMovieForDetails(movie)}
          />
        ) : (
          <>
            {/* Spotlight Banner (Shown only on Explore tab without search query) */}
            {activeTab === "explore" && !searchQuery.trim() && (
              <HeroBanner
                featuredMovies={featuredMovies}
                savedItems={savedItems}
                onSelectMovie={(m) => setSelectedMovieForDetails(m)}
                onToggleWatchlist={handleToggleWatchlist}
                onToggleFavorite={handleToggleFavorite}
                onPlayTrailer={(m) => setSelectedMovieForDetails(m)}
              />
            )}

            {/* Filter, Search & View Controls */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreSelect={setSelectedGenre}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isLoading={isLoading}
            />

            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white capitalize">
                  {activeTab === "explore" && (searchQuery.trim() ? `Search Results for "${searchQuery}"` : "Trending & Curated Cinema")}
                  {activeTab === "watchlist" && "My Watchlist Queue"}
                  {activeTab === "favorites" && "All-Time Favorites"}
                  {activeTab === "watched" && "Watched History & Diary"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {displayMovies.length} {displayMovies.length === 1 ? "title" : "titles"}
                </p>
              </div>
            </div>

            {/* Movie Grid or Loading Skeletons */}
            {isLoading && activeTab === "explore" ? (
              <MovieSkeletonGrid count={12} />
            ) : displayMovies.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
                    : "space-y-3"
                }
              >
                {displayMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    savedItem={savedItems[movie.id]}
                    onSelectMovie={(m) => setSelectedMovieForDetails(m)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenWatchedModal={handleOpenWatchedModal}
                    onPlayTrailer={(m) => setSelectedMovieForDetails(m)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type={
                  searchQuery.trim()
                    ? "search"
                    : activeTab === "watchlist"
                    ? "watchlist"
                    : activeTab === "favorites"
                    ? "favorites"
                    : "watched"
                }
                onAction={() => {
                  if (searchQuery.trim()) {
                    setSearchQuery("");
                    setSelectedGenre("All");
                  } else {
                    setActiveTab("explore");
                  }
                }}
                actionLabel={searchQuery.trim() ? "Reset Filters" : "Explore Cinema"}
                onLoadDemo={handleLoadDemo}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white text-sm">CINETRACK</span>
            <span>• Ultimate Movie & Series Watchlist</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Free APIs • Local Storage • Zero Registration</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {selectedMovieForDetails && (
        <MovieDetailsModal
          movie={selectedMovieForDetails}
          savedItem={savedItems[selectedMovieForDetails.id]}
          onClose={() => setSelectedMovieForDetails(null)}
          onToggleWatchlist={handleToggleWatchlist}
          onToggleFavorite={handleToggleFavorite}
          onOpenWatchedModal={handleOpenWatchedModal}
          onSaveNotesAndRating={handleSaveNotesAndRating}
        />
      )}

      {watchedModalMovie && (
        <WatchedLogModal
          movie={watchedModalMovie}
          savedItem={savedItems[watchedModalMovie.id]}
          onClose={() => setWatchedModalMovie(null)}
          onSaveWatchedLog={handleSaveWatchedLog}
        />
      )}

      {isRouletteOpen && (
        <MovieRouletteModal
          allMovies={movies}
          savedItems={savedItems}
          onClose={() => setIsRouletteOpen(false)}
          onSelectMovie={(m) => setSelectedMovieForDetails(m)}
          onPlayTrailer={(m) => setSelectedMovieForDetails(m)}
        />
      )}

      {isApiSettingsOpen && (
        <ApiSettingsModal
          onClose={() => setIsApiSettingsOpen(false)}
          onSaved={() => showToast("API Settings saved successfully!")}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
