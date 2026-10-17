import { MOCK_MOVIES } from "../data/mockMovies";
import { getApiConfig } from "./storage";

/**
 * Normalizes movie data into a unified schema across all sources
 */
export const normalizeMovie = (raw, source = "catalog") => {
  if (source === "catalog") {
    return {
      id: raw.id,
      title: raw.title,
      year: raw.year,
      rated: raw.rated || "NR",
      released: raw.released || raw.year,
      runtime: raw.runtime || "120 min",
      runtimeMinutes: raw.runtimeMinutes || 120,
      genre: Array.isArray(raw.genre) ? raw.genre : [raw.genre || "Drama"],
      director: raw.director || "Unknown Director",
      actors: raw.actors || "Cast info unavailable",
      plot: raw.plot || "No plot summary available.",
      poster: raw.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      backdrop: raw.backdrop || raw.poster || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
      ratings: raw.ratings || { imdb: 8.0, rottenTomatoes: "80%", metascore: 75 },
      type: raw.type || "movie",
      trailerYoutubeId: raw.trailerYoutubeId || "YoHD9XEInc0",
      tagline: raw.tagline || ""
    };
  }

  if (source === "tvmaze") {
    const show = raw.show || raw;
    const genres = show.genres && show.genres.length > 0 ? show.genres : ["Drama"];
    const posterImg = show.image?.original || show.image?.medium || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
    const cleanSummary = show.summary ? show.summary.replace(/<[^>]*>/g, "") : "No description provided.";
    const yearStr = show.premiered ? show.premiered.slice(0, 4) : "2023";
    const ratingScore = show.rating?.average ? Number(show.rating.average) : 7.8;
    const runtimeVal = show.averageRuntime || show.runtime || 60;

    return {
      id: `tvmaze-${show.id}`,
      title: show.name,
      year: yearStr,
      rated: "TV-14",
      released: show.premiered || yearStr,
      runtime: `${runtimeVal} min`,
      runtimeMinutes: runtimeVal,
      genre: genres,
      director: "Creator / Showrunner",
      actors: show.network?.name ? `Broadcast on ${show.network.name}` : "Various Artists",
      plot: cleanSummary,
      poster: posterImg,
      backdrop: posterImg,
      ratings: {
        imdb: ratingScore,
        rottenTomatoes: `${Math.round(ratingScore * 10)}%`,
        metascore: Math.round(ratingScore * 10)
      },
      type: "series",
      trailerYoutubeId: "YoHD9XEInc0",
      tagline: show.type ? `${show.type} · ${show.status || "Completed"}` : ""
    };
  }

  if (source === "omdb") {
    const imdbRating = raw.imdbRating && raw.imdbRating !== "N/A" ? parseFloat(raw.imdbRating) : 7.5;
    const runtimeMin = raw.Runtime && raw.Runtime.includes("min") ? parseInt(raw.Runtime) : 110;
    const genres = raw.Genre && raw.Genre !== "N/A" ? raw.Genre.split(",").map(g => g.trim()) : ["Action"];

    return {
      id: raw.imdbID || `omdb-${Date.now()}`,
      title: raw.Title,
      year: raw.Year,
      rated: raw.Rated && raw.Rated !== "N/A" ? raw.Rated : "PG-13",
      released: raw.Released && raw.Released !== "N/A" ? raw.Released : raw.Year,
      runtime: raw.Runtime && raw.Runtime !== "N/A" ? raw.Runtime : "120 min",
      runtimeMinutes: isNaN(runtimeMin) ? 120 : runtimeMin,
      genre: genres,
      director: raw.Director && raw.Director !== "N/A" ? raw.Director : "Christopher Nolan",
      actors: raw.Actors && raw.Actors !== "N/A" ? raw.Actors : "Starring Cast",
      plot: raw.Plot && raw.Plot !== "N/A" ? raw.Plot : "In a world of intrigue and adventure...",
      poster: raw.Poster && raw.Poster !== "N/A" ? raw.Poster : "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      backdrop: raw.Poster && raw.Poster !== "N/A" ? raw.Poster : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
      ratings: {
        imdb: imdbRating,
        rottenTomatoes: `${Math.round(imdbRating * 10)}%`,
        metascore: raw.Metascore && raw.Metascore !== "N/A" ? parseInt(raw.Metascore) : Math.round(imdbRating * 10)
      },
      type: raw.Type === "series" ? "series" : "movie",
      trailerYoutubeId: "YoHD9XEInc0",
      tagline: raw.Awards && raw.Awards !== "N/A" ? raw.Awards : ""
    };
  }

  return raw;
};

/**
 * Search movies through multiple APIs with graceful fallbacks
 */
export const searchMoviesApi = async (query, { signal } = {}) => {
  if (!query || query.trim() === "") {
    return MOCK_MOVIES.map(m => normalizeMovie(m, "catalog"));
  }

  const trimmed = query.trim().toLowerCase();
  const config = getApiConfig();

  // 1. Check if user configured an OMDb API key
  if (config.omdbKey && config.omdbKey.trim()) {
    try {
      const url = `https://www.omdbapi.com/?apikey=${encodeURIComponent(config.omdbKey.trim())}&s=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url, { signal });
      const data = await res.json();
      
      if (data.Response === "True" && data.Search?.length) {
        // Fetch detailed info for top 6 results
        const detailed = await Promise.all(
          data.Search.slice(0, 6).map(async (item) => {
            try {
              const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(config.omdbKey.trim())}&i=${item.imdbID}`, { signal });
              const detailData = await detailRes.json();
              return normalizeMovie(detailData.Response === "True" ? detailData : item, "omdb");
            } catch {
              return normalizeMovie(item, "omdb");
            }
          })
        );
        return detailed;
      }
    } catch (err) {
      if (err.name === "AbortError") throw err;
      console.warn("OMDb fetch failed, falling back to TVMaze / catalog:", err);
    }
  }

  // 2. Try Free Public TVMaze Search API (Zero API key needed!)
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(trimmed)}`, { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const liveResults = data.map(item => normalizeMovie(item, "tvmaze"));
        
        // Also merge any local catalog matches that match
        const localMatches = MOCK_MOVIES.filter(m => 
          m.title.toLowerCase().includes(trimmed) || 
          m.director.toLowerCase().includes(trimmed) ||
          m.actors.toLowerCase().includes(trimmed) ||
          m.genre.some(g => g.toLowerCase().includes(trimmed))
        ).map(m => normalizeMovie(m, "catalog"));

        // Prioritize local matches then external
        const combined = [...localMatches];
        for (const live of liveResults) {
          if (!combined.some(c => c.title.toLowerCase() === live.title.toLowerCase())) {
            combined.push(live);
          }
        }
        return combined;
      }
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    console.warn("TVMaze fetch failed, falling back to local database:", err);
  }

  // 3. Fallback: Filter Local Curated Database
  const localMatches = MOCK_MOVIES.filter(m => 
    m.title.toLowerCase().includes(trimmed) || 
    m.director.toLowerCase().includes(trimmed) ||
    m.actors.toLowerCase().includes(trimmed) ||
    m.genre.some(g => g.toLowerCase().includes(trimmed))
  ).map(m => normalizeMovie(m, "catalog"));

  return localMatches;
};
