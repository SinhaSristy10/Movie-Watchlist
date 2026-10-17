// Storage Service for Movie Watchlist

const STORAGE_KEY = "cinetrack_watchlist_v1";
const API_CONFIG_KEY = "cinetrack_api_config_v1";

export const getSavedItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read watchlist from local storage:", err);
    return {};
  }
};

export const saveSavedItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cinetrack_storage_updated"));
  } catch (err) {
    console.error("Failed to save watchlist to local storage:", err);
  }
};

export const getApiConfig = () => {
  try {
    const raw = localStorage.getItem(API_CONFIG_KEY);
    return raw ? JSON.parse(raw) : { omdbKey: "", tmdbKey: "" };
  } catch {
    return { omdbKey: "", tmdbKey: "" };
  }
};

export const saveApiConfig = (config) => {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error("Failed to save API config:", err);
  }
};

export const loadDemoWatchlist = (mockMovies) => {
  const sampleItems = {};
  
  // Pick a few mock movies for demo
  const dune2 = mockMovies.find(m => m.title.includes("Dune: Part Two"));
  const oppenheimer = mockMovies.find(m => m.title.includes("Oppenheimer"));
  const interstellar = mockMovies.find(m => m.title.includes("Interstellar"));
  const darkKnight = mockMovies.find(m => m.title.includes("The Dark Knight"));
  const parasite = mockMovies.find(m => m.title.includes("Parasite"));
  const spiderVerse = mockMovies.find(m => m.title.includes("Across the Spider-Verse"));

  if (dune2) {
    sampleItems[dune2.id] = {
      id: dune2.id,
      status: "watched",
      isFavorite: true,
      rating: 9.5,
      review: "Visual masterpiece! The sound design and cinematography in IMAX was unearthly.",
      dateAdded: "2024-03-02",
      dateWatched: "2024-03-05",
      tags: ["Sci-Fi", "Cinema", "Masterpiece"],
      movie: dune2
    };
  }

  if (oppenheimer) {
    sampleItems[oppenheimer.id] = {
      id: oppenheimer.id,
      status: "watched",
      isFavorite: true,
      rating: 9.0,
      review: "Cillian Murphy's performance is riveting. The Trinity test sequence was heart-stopping.",
      dateAdded: "2023-08-01",
      dateWatched: "2023-08-04",
      tags: ["Historical", "Nolan", "Biopic"],
      movie: oppenheimer
    };
  }

  if (interstellar) {
    sampleItems[interstellar.id] = {
      id: interstellar.id,
      status: "watched",
      isFavorite: true,
      rating: 10.0,
      review: "All-time favorite sci-fi movie. Hans Zimmer's organ score still gives me chills.",
      dateAdded: "2023-01-10",
      dateWatched: "2023-01-12",
      tags: ["Space", "Zimmer", "Emotional"],
      movie: interstellar
    };
  }

  if (spiderVerse) {
    sampleItems[spiderVerse.id] = {
      id: spiderVerse.id,
      status: "want_to_watch",
      isFavorite: true,
      rating: null,
      review: "",
      dateAdded: "2024-04-10",
      dateWatched: null,
      tags: ["Animation", "Weekend"],
      movie: spiderVerse
    };
  }

  if (darkKnight) {
    sampleItems[darkKnight.id] = {
      id: darkKnight.id,
      status: "want_to_watch",
      isFavorite: false,
      rating: null,
      review: "",
      dateAdded: "2024-05-01",
      dateWatched: null,
      tags: ["Action", "Classics"],
      movie: darkKnight
    };
  }

  if (parasite) {
    sampleItems[parasite.id] = {
      id: parasite.id,
      status: "want_to_watch",
      isFavorite: false,
      rating: null,
      review: "",
      dateAdded: "2024-05-15",
      dateWatched: null,
      tags: ["Thriller"],
      movie: parasite
    };
  }

  saveSavedItems(sampleItems);
  return sampleItems;
};

export const exportWatchlistToJson = () => {
  const items = getSavedItems();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cinetrack_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
