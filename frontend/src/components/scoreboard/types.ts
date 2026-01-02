export type SortKey = "season_rank" | "game_rank" | "first_name" | "last_name" | 'jersey_number' | 'age' | 'position' | 'height_in' | 'weight_lb' | 'experience_years' | 'college';
export type SortOrder = "asc" | "desc";

export type LeaderboardApiRow = {
  id: number;
  season_rank?: number | null;
  game_rank?: number | null;

  jersey_number?: number | null;
  first_name: string;
  last_name: string;

  position?: string | null;
  height_in?: number | null;
  weight_lb?: number | null;
  age?: number | null;
  experience_years?: number | null;
  college?: string | null;
  headshot_url?: string;
};

export type LeaderboardResponse = {
  data: LeaderboardApiRow[];
  links: unknown;
  meta: PaginatorMeta;
};

export type UIPlayerRow = {
  id: number;
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
  headshot_url?: string;
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
  logo_url: string;
};

export type PlayerFormValues = {
  first_name: string;
  last_name: string;
  jersey_number: number | "";
  position: string;
  status: "active" | "inactive";
  height_in: number | "";
  weight_lb: number | "";
  age: number | "";
  experience_years: number | "";
  college: string;
};

export type LeaderboardRow = {
  id: number;
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
