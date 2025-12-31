# Movie Calendar

A web application that displays upcoming movie release dates in a calendar format. [Visit Site](https://movie-calendar-2026.vercel.app/)

## Features

- **Calendar View**: View movie releases by month in a clean calendar layout
- **Movie Details**: Click on any movie to see detailed information (poster, overview, runtime, genres, production companies, etc.)
- **Trailer Playback**: Watch movie trailers directly in the modal by clicking the play button on the backdrop image
- **Movie Search**: Search for any movie using the search bar and view its details
- **Recommended Movies**: Special highlight for recommended movies with star icon and green color
- **Multi-Region Support**: Filter movies by release region (Korea, USA, Japan, UK, France, Germany, or All)
- **Multi-Language Support**: Switch between Korean and English interface
- **Dark/Light Mode**: Toggle between dark and light themes
- **Today Highlight**: Current date is highlighted with a blue circle
- **Responsive Design**: Works on desktop and mobile devices
- **TMDb Integration**: Real-time movie data from The Movie Database API

## Tech Stack

| Category      | Technology                       |
| ------------- | -------------------------------- |
| Framework     | Next.js 15                       |
| Styling       | Styled Components + Tailwind CSS |
| State         | Zustand                          |
| Icons         | React Icons                      |
| Date Handling | date-fns                         |
| Tooltips      | React Tooltip                    |
| Language      | TypeScript                       |
| API           | TMDb (The Movie Database)        |

## Project Structure

```
app/
├── components/
│   ├── MovieCalendar.tsx  # Main calendar component with search
│   └── MovieModal.tsx     # Movie details modal with trailer
├── lib/
│   ├── tmdb.ts            # TMDb API functions (movies, search, videos)
│   ├── store.ts           # Zustand store (theme, language, region)
│   ├── recommendedMovies.ts # Recommended movies list
│   └── registry.tsx       # styled-components SSR
└── page.tsx               # Main page
```

## API

This project uses [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) for:

- Fetching upcoming movies by release date and region
- Getting movie details (runtime, genres, production companies)
- Searching movies by title
- Fetching movie trailers and videos
