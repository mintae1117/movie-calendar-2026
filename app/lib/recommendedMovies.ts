import { Movie } from "./tmdb";

/**
 * 주인장 추천 영화 목록
 * - 한글 제목과 영문 제목(original_title) 모두 포함
 * - 개봉일 순으로 정렬
 */
export const RECOMMENDED_MOVIES = [
  // 2026-01-14
  "28년 후: 뼈의 사원",
  "28 Years Later: The Bone Temple",
  "프로젝트 Y",
  "Project Y",
  // 2026-01-22
  "노 머시: 90분",
  "Mercy",
  // 2026-02-11
  "폭풍의 언덕",
  "Wuthering Heights",
  // 2026-02-11
  "고트",
  "GOAT",
  // 2026-02-11
  "휴민트",
  // 2026-02-12
  "크라임 101",
  "Crime 101",
  // 2026-03-04
  "호퍼스",
  "Hoppers",
  // 2026-03-18
  "프로젝트 헤일메리",
  "Project Hail Mary",
  // 2026-04-01
  "슈퍼 마리오 갤럭시",
  "The Super Mario Galaxy Movie",
  // 2026-04-22
  "마이클",
  "Michael",
  // 2026-04-29
  "악마는 프라다를 입는다 2",
  "The Devil Wears Prada 2",
  // 2026-05-20
  "만달로리안과 그로구",
  "Star Wars: The Mandalorian and Grogu",
  // 2026-06-04
  "마스터즈 오브 더 유니버스",
  "Masters of the Universe",
  // 2026-06-10
  "디스클로저 데이",
  "Disclosure Day",
  // 2026-06-17
  "토이 스토리 5",
  "Toy Story 5",
  // 2026-06-24
  "슈퍼걸",
  "Supergirl",
  // 2026-07-01
  "Minions 3",
  // 2026-07-08
  "모아나",
  "Moana",
  // 2026-07-15
  "오디세이",
  "The Odyssey",
  // 2026-07-29
  "스파이더맨: 브랜드 뉴 데이",
  "Spider-Man: Brand New Day",
  // 2026-09-16
  "레지던트 이블",
  "Resident Evil",
  // 2026-09-30
  "디거",
  "Digger",
  // 2026-10-07
  "소셜 레코닝",
  "The Social Reckoning",
  // 2026-10-15
  "스트리트 파이터",
  "Street Fighter",
  // 2026-11-18
  "헝거게임: 선라이즈 온 더 리핑",
  "The Hunger Games: Sunrise on the Reaping",
  // 2026-11-26
  "나니아",
  "Narnia",
  // 2026-11-26
  "햄넷",
  "Hamnet",
  // 2026-12-09
  "쥬만지 3",
  "Jumanji 3",
  // 2026-12-16
  "어벤져스: 둠스데이",
  "Avengers: Doomsday",
  // 2026-12-17
  "듄: 파트 3",
  "Dune: Part Three",
];

/**
 * 영화가 주인장 추천 목록에 있는지 확인
 */
export const isRecommended = (movie: Movie): boolean => {
  return (
    RECOMMENDED_MOVIES.includes(movie.title) ||
    RECOMMENDED_MOVIES.includes(movie.original_title)
  );
};
