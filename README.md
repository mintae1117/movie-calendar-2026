# Movie Calendar 2026

A web application that displays upcoming movie release dates in a calendar format. [Visit Site](https://movie-calendar-2026.vercel.app/)

## Features

- **Calendar View**: View movie releases by month in a clean calendar layout
- **Movie Details**: Click on any movie to see detailed information (poster, overview, runtime, genres, etc.)
- **Recommended Movies**: Special highlight for recommended movies with star icon
- **Responsive Design**: Works on desktop and mobile devices
- **TMDb Integration**: Real-time movie data from The Movie Database API

## Tech Stack

| Category      | Technology                       |
| ------------- | -------------------------------- |
| Framework     | Next.js 15                       |
| Styling       | Styled Components + Tailwind CSS |
| Icons         | React Icons                      |
| Date Handling | date-fns                         |
| Tooltips      | React Tooltip                    |
| Language      | TypeScript                       |
| API           | TMDb (The Movie Database)        |

## Project Structure

```
app/
├── components/
│   ├── MovieCalendar.tsx  # Main calendar component
│   └── MovieModal.tsx     # Movie details modal
├── lib/
│   ├── tmdb.ts            # TMDb API functions
│   └── registry.tsx       # styled-components SSR
└── page.tsx               # Main page
```

---

# 영화 개봉 캘린더 2026

2026년 이후 영화 개봉 일정을 캘린더 형식으로 보여주는 웹 애플리케이션입니다. [방문하기](https://movie-calendar-2026.vercel.app/)

## 기능

- **캘린더 뷰**: 월별로 영화 개봉 일정을 깔끔한 캘린더 레이아웃으로 확인
- **영화 상세정보**: 영화 클릭 시 포스터, 줄거리, 러닝타임, 장르 등 상세 정보 표시
- **추천 영화**: 주인장 추천 영화는 별 아이콘으로 특별 표시
- **반응형 디자인**: 데스크톱과 모바일 모두 지원
- **TMDb 연동**: The Movie Database API를 통한 실시간 영화 데이터

## 기술 스택

| 분류       | 기술                             |
| ---------- | -------------------------------- |
| 프레임워크 | Next.js 15                       |
| 스타일링   | Styled Components + Tailwind CSS |
| 아이콘     | React Icons                      |
| 날짜 처리  | date-fns                         |
| 툴팁       | React Tooltip                    |
| 언어       | TypeScript                       |
| API        | TMDb (The Movie Database)        |

## 프로젝트 구조

```
app/
├── components/
│   ├── MovieCalendar.tsx  # 메인 캘린더 컴포넌트
│   └── MovieModal.tsx     # 영화 상세 모달
├── lib/
│   ├── tmdb.ts            # TMDb API 함수
│   └── registry.tsx       # styled-components SSR
└── page.tsx               # 메인 페이지
```
