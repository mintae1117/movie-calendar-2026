# Movie Calendar 개발 규칙 (Claude Code)

## 프로젝트 개요
2026년 영화 개봉 일정을 캘린더 형식으로 보여주는 웹 애플리케이션. TMDb API를 활용하여 전 세계 영화 개봉 정보를 제공.

**Live URL**: https://movie-calendar-2026.vercel.app/

---

## 기본 원칙
- 모든 대화와 코드 주석은 한국어로 작성
- TypeScript 타입 안전성 준수
- SOLID 원칙 적용
- 모바일 우선 반응형 디자인

---

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | **Next.js** | 16.1.1 |
| React | React | 19.2.3 |
| Language | TypeScript | 5.x |
| State | **Zustand** | 5.0.9 |
| Styling | Styled Components + Tailwind | 6.1.19 / 4.x |
| Calendar | react-big-calendar | 1.19.4 |
| Date | date-fns + moment | 4.1.0 / 2.30.1 |
| Icons | react-icons | 5.5.0 |
| API | TMDb API | v3 |

---

## 개발 명령어

```bash
# 개발 서버 실행 (포트 3001)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트
npm run lint
```

---

## 프로젝트 구조

```
app/
├── components/
│   ├── Calendar/
│   │   ├── index.tsx           # 메인 캘린더 컴포넌트
│   │   ├── CalendarHeader.tsx  # 헤더 (로고, 테마, 언어, 지역)
│   │   ├── CalendarToolbar.tsx # 툴바 (월 이동, 검색, 범례)
│   │   ├── CalendarGrid.tsx    # 7열 그리드
│   │   └── styles.ts           # Styled Components (538줄)
│   └── Modal/
│       ├── index.tsx           # 영화 상세 모달
│       ├── ModalBackdrop.tsx   # 배경 + 트레일러
│       ├── ModalTitle.tsx      # 제목 섹션
│       ├── ModalBadges.tsx     # 정보 배지
│       ├── ModalContent.tsx    # 콘텐츠 (장르, 줄거리, 제작사)
│       └── styles.ts           # 모달 스타일
│
├── hooks/
│   ├── useMovies.ts            # 영화 데이터 fetch
│   ├── useMovieSearch.ts       # 검색 기능
│   ├── useMovieModal.ts        # 모달 데이터 fetch
│   ├── useMobile.ts            # 반응형 감지
│   ├── useClickOutside.ts      # 외부 클릭 감지
│   ├── useKeyboard.ts          # 키보드 이벤트
│   └── useBodyScrollLock.ts    # 스크롤 잠금
│
├── services/
│   ├── tmdb.ts                 # TMDb API 서비스
│   └── cache.ts                # 인메모리 캐시 (TTL 5분)
│
├── constants/
│   ├── index.ts                # API & UI 상수
│   ├── theme.ts                # 다크/라이트 테마 색상
│   ├── regions.ts              # 지역 데이터 (44개국)
│   └── translations.ts         # i18n 번역 (ko/en)
│
├── utils/
│   ├── date.ts                 # 날짜 유틸리티
│   ├── calendar.ts             # 캘린더 로직
│   ├── movie.ts                # 추천 영화 판별
│   └── country.ts              # 국가 코드 매핑
│
├── types/
│   └── index.ts                # TypeScript 인터페이스
│
├── lib/
│   ├── store.ts                # Zustand 스토어
│   ├── StoreProvider.tsx       # Provider 래퍼
│   ├── registry.tsx            # Styled Components 레지스트리
│   └── recommendedMovies.ts    # 추천 영화 목록 (50+)
│
├── layout.tsx                  # 루트 레이아웃
├── page.tsx                    # 홈 페이지
└── globals.css                 # 글로벌 스타일
```

---

## 환경변수

```bash
# .env.local
NEXT_PUBLIC_TMDB_API_KEY=<TMDb API 키>
```

---

## TMDb API 엔드포인트

| 엔드포인트 | 용도 |
|------------|------|
| `/discover/movie` | 월별/지역별 개봉 영화 조회 |
| `/movie/{id}` | 영화 상세 정보 |
| `/movie/{id}/videos` | 트레일러/티저 영상 |
| `/movie/{id}/release_dates` | 국가별 개봉일 |
| `/search/movie` | 영화 검색 |

**이미지 URL**: `https://image.tmdb.org/t/p/{size}/{path}`

---

## Zustand 스토어

```typescript
// app/lib/store.ts
interface SettingsStore {
  // State
  theme: "light" | "dark";
  language: "ko" | "en";
  region: Region;  // 44개 지역 옵션

  // Actions
  setTheme(theme): void;
  setLanguage(language): void;
  setRegion(region): void;

  // Helpers
  t(key): string;              // 번역 함수
  getRegionName(code): string; // 지역명 조회
}

// localStorage 키: "movie-calendar-settings"
```

---

## 캐싱 전략

```typescript
// app/services/cache.ts
class CacheService<T> {
  private ttl = 5 * 60 * 1000; // 5분

  get(key): T | null;
  set(key, value): void;
  getOrFetch(key, fetchFn): Promise<T>; // Race condition 방지
}

// 캐시 키 패턴
// upcoming-{year}-{month}-{language}-{region}
// details-{movieId}-{language}
// videos-{movieId}-{language}
// search-{query}-{language}
```

---

## 주요 기능

### 1. 캘린더 뷰
- 7열 월별 그리드
- 오늘 날짜 하이라이트
- 추천 영화 별표 표시 (초록색)

### 2. 영화 상세 모달
- 포스터, 제목, 태그라인
- 줄거리, 장르, 런타임
- 제작사, 개봉일
- YouTube 트레일러 재생

### 3. 검색 기능
- 디바운싱 (300ms)
- 최대 10개 결과
- 포스터 미리보기

### 4. 다국어 지원
- 한국어 (ko) / 영어 (en)
- constants/translations.ts

### 5. 다중 지역 지원
- 44개국 지원 (KR, US, JP, GB, FR, DE 등)
- "ALL" 옵션으로 전체 보기

### 6. 다크/라이트 모드
- localStorage 저장
- 20+ 테마 색상 변수
- 0.3s 전환 애니메이션

---

## 스타일링 가이드

### 테마 색상
```typescript
// app/constants/theme.ts
const THEME_COLORS = {
  dark: {
    background: "#000000",
    text: "#f3f4f6",
    primary: "#3b82f6",
    // ...
  },
  light: {
    background: "#ffffff",
    text: "#1f2937",
    primary: "#2563eb",
    // ...
  }
};
```

### 주요 색상
```css
/* 추천 영화 (초록) */
--recommended: #10b981;

/* 일반 영화 (회색) */
--regular: #6b7280;

/* 일요일 (빨강) */
--sunday: #ef4444;

/* 토요일 (파랑) */
--saturday: #3b82f6;
```

### 반응형 브레이크포인트
```css
/* 모바일 */
@media (max-width: 768px) { }
```

---

## 추천 영화 시스템

### 추천 기준 (하나라도 충족 시)
1. `recommendedMovies.ts`에 포함된 영화
2. 평균 평점 ≥ 7.2 AND 투표 수 ≥ 100
3. 인기도 ≥ 300

```typescript
// app/utils/movie.ts
export const isMovieRecommended = (movie: Movie): boolean => {
  // 수동 추천 목록 체크
  // 또는 자동 기준 충족 체크
};
```

---

## 성능 최적화

1. **병렬 API 호출**: 첫 5페이지 동시 fetch
2. **인메모리 캐싱**: TTL 5분
3. **디바운싱**: 검색 입력 300ms
4. **Memoization**: useMemo, useCallback 적극 활용
5. **월별 Lazy Loading**: 필요한 월만 로드

---

## 커스텀 훅 사용법

### useMovies
```typescript
const { movies, isLoading, loadMonth } = useMovies();
// movies: CalendarEvent[]
// loadMonth: (date: Date) => void
```

### useMovieSearch
```typescript
const {
  searchQuery,
  setSearchQuery,
  searchResults,
  handleMovieClick
} = useMovieSearch();
```

### useMovieModal
```typescript
const {
  movieDetails,
  videos,
  releaseInfo,
  isLoading
} = useMovieModal(movieId);
```

---

## 폰트 시스템

```css
/* app/globals.css */
--font-geist-sans     /* 기본 (영문) */
--font-geist-mono     /* 모노스페이스 */
--font-poppins        /* 헤딩 (400-800) */
--font-noto-sans-kr   /* 한글 (400-800) */
```

---

## 체크리스트

### 새 컴포넌트 추가 시
- [ ] TypeScript 인터페이스 정의 (types/index.ts)
- [ ] Styled Components로 스타일링
- [ ] 테마 색상 활용 (theme.ts)
- [ ] 반응형 스타일 (768px 브레이크포인트)
- [ ] 다국어 키 추가 (translations.ts)

### API 호출 추가 시
- [ ] services/tmdb.ts에 메서드 추가
- [ ] 캐시 키 패턴 정의
- [ ] 에러 핸들링

### 배포 전
- [ ] `npm run build` 성공
- [ ] `npm run lint` 경고 없음
- [ ] 환경변수 확인 (.env.local)

---

## Git 커밋 규칙

```
<type>: <subject>

# type
- feat: 새 기능
- fix: 버그 수정
- style: 스타일 변경
- refactor: 리팩토링
- perf: 성능 개선
- docs: 문서

# 예시
feat: 영화 필터 기능 추가
fix: 모달 스크롤 버그 수정
perf: API 병렬 호출 최적화
```

---

## 배포

- **플랫폼**: Vercel
- **URL**: https://movie-calendar-2026.vercel.app/
- **CI/CD**: Git push 시 자동 배포
