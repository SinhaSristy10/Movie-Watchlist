# 🎬 CineTrack — Modern Movie & Series Watchlist

> An ultra-modern, cinematic Movie & TV Watchlist web application built with **React**, **Tailwind CSS v4**, and **Vite**. 

---

## ✨ Features Implemented

### 1. 🔍 Search Movies & TV Series
- **Live Search with Debounce**: Instant responses as you type with smooth debounce.
- **Multi-Source API Architecture**:
  - **Curated 4K Cinema Database**: 22+ handpicked blockbusters, classics, sci-fi, and drama with high-res posters, backdrop art, cast, directors, runtime, ratings, and YouTube trailer IDs.
  - **TVMaze Public Search API**: Completely free live search without any API keys required.
  - **OMDb API Integration**: Optional custom API key support in the Settings dialog to search any movie or series across cinema history.
- **Filters & Sorting**:
  - Filter by Genre (*Action, Sci-Fi, Drama, Animation, Crime, Thriller, etc.*)
  - Filter by Type (*Movies vs. TV Series*)
  - Sort by *Highest Rated, Newest, Oldest, Title (A-Z), or My Rating*
  - Toggle between **Grid Poster View** and **Compact List View**

### 2. 📌 Watchlist & ❤️ Save Favorites
- **One-Click Quick Actions**: Bookmark to Watchlist or Favorite directly from poster card hover overlays.
- **Dedicated Tabs with Live Badges**:
  - **Explore**: Discover trending blockbusters and search global cinema.
  - **Watchlist**: Your queue of movies you plan to watch.
  - **Favorites**: Your pinned all-time favorite cinema.
  - **Watched**: Complete viewing diary and log.

### 3. 👁️ Mark Watched & Personal Cinema Journal
- **Star Rating System**: Rate movies from 1 to 10 stars.
- **Watch Date & Journal Notes**: Record when you watched it and log your personal review.
- **Custom Tags**: Tag movies with `#Masterpiece`, `#Mind-Bending`, `#Cinema IMAX`, `#Date Night`, etc.
- **Celebratory Confetti**: Interactive confetti animation on marking movies as watched.

### 4. ⏳ Loading, Error & Empty States
- **Skeleton Shimmer Loaders**: Smooth placeholder cards during live searches.
- **Network Error Resilience**: Automatic fallback to local catalog with retry banner if network fails.
- **Contextual Empty States**: Helpful prompts and demo data loader when lists are empty.

### 5. 💾 Local Storage Persistence & Backup
- **Automatic Sync**: All watchlist items, favorites, reviews, ratings, and settings persist automatically in `localStorage`.
- **JSON Export / Backup**: 1-click download of your entire watchlist as a JSON file.
- **Demo Data Loader**: Pre-loads rich sample movies, reviews, and ratings in one click.

### 6. 🌟 Extra Cinematic UI Upgrades
- **Hero Spotlight Carousel**: Dynamic rotating backdrop banner with taglines, trailers, and quick actions.
- **Interactive Details Modal with Embedded Trailers**: Full synopsis, cast, awards, Rotten Tomatoes/Metascore badges, and YouTube trailer player.
- **🎲 "What to Watch Tonight?" (Movie Roulette)**: Solves movie night decision paralysis with an animated random picker and confetti reveal.
- **📊 Letterboxd-Style Analytics Dashboard**:
  - Total movies completed
  - Total screen time (hours and minutes)
  - Average user rating
  - Watched genres distribution bar chart
  - Recent watch activity timeline

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Run

```bash
# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
```

Visit the app in your browser at `http://localhost:3000` or the port displayed in your terminal.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: React 19
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti & CSS Shimmer
