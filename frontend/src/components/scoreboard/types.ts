export type SortKey = "season_rank" | "game_rank" | "first_name" | "last_name" | 'jersey_number' | 'age' | 'position' | 'height_in' | 'weight_lb' | 'experience_years' | 'college';
export type SortOrder = "asc" | "desc";

export type LeaderboardApiRow = {
  id: number;
  playerId: number;
  seasonRank?: number | null;
  gameRank?: number | null;

  jerseyNumber?: number | null;
  firstName: string;
  lastName: string;

  position?: string | null;
  heightIn?: number | null;
  weightLb?: number | null;
  age?: number | null;
  experienceYears?: number | null;
  college?: string | null;
  headshotUrl?: string;
};

export type LeaderboardResponse = {
  data: LeaderboardApiRow[];
  links: unknown;
  meta: PaginatorMeta;
};

export type UIPlayerRow = {
  id: number;
  playerId: number;
  seasonRank: number;
  gameRank: number;
  jersey: number;
  firstName: string;
  lastName: string;
  pos: string;
  ht: string;
  wt: number;
  age: number;
  exp: number;
  college: string;
  headshotUrl?: string;
};

export type PaginatorMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
};

export type GameDto = {
  id: number;
  season?: number | null;
  date: string;
  stadium: string | null;
  opponentCity: string | null;
  opponentName: string | null;
  result: "W" | "L";
  score: string;
  logoUrl: string;
};

export type PlayerFormValues = {
  playerId: number;
  firstName: string;
  lastName: string;
  jerseyNumber: number | "";
  position: string;
  status: "active" | "inactive";
  heightIn: number | "";
  weightLb: number | "";
  age: number | "";
  experienceYears: number | "";
  college: string;
};

export type LeaderboardRow = {
  id: number;
  playerId: number;
  seasonRank: number;
  gameRank: number;
  jersey: number;
  firstName: string;
  lastName: string;
  pos: string;
  ht: string;     
  wt: number;    
  age: number;
  exp: number;
  college: string;
};

export type ModalMode = "create" | "edit";
