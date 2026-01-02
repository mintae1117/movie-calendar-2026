# Movie Calendar

Upcoming movie releases in a calendar view. [Live Demo](https://movie-calendar-2026.vercel.app/)

## Features

- **Calendar View** - Monthly calendar layout with movie release dates
- **Movie Details** - Poster, overview, runtime, genres, production info
- **Trailer Playback** - Watch trailers directly in modal
- **Movie Search** - Search any movie by title
- **Recommendations** - Highlighted with star icon (green badge)
- **Multi-Region** - Korea, USA, Japan, UK, France, Germany, or All
- **Multi-Language** - Korean / English interface
- **Dark/Light Mode** - Theme toggle
- **Responsive** - Desktop and mobile support
- **Parallel API Fetching** - Fast data loading with concurrent requests

## Tech Stack

| Category  | Technology                       |
| --------- | -------------------------------- |
| Framework | Next.js 15                       |
| Styling   | Styled Components + Tailwind CSS |
| State     | Zustand                          |
| Language  | TypeScript                       |
| API       | TMDb (The Movie Database)        |

## API

Uses [TMDb API](https://www.themoviedb.org/documentation/api) for movie data, search, and trailers.
