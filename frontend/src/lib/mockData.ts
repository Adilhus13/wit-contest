export type GameCard = {
  date: string;
  stadium: string;
  opponentCity: string;
  opponentName: string;
  result: "W" | "L";
  score: string;
  variant?: "gold" | "white";
};

export type PlayerRow = {
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

export const mockGames: GameCard[] = [
  { date: "NOVEMBER 19, 2023", stadium: "LEVI'S STADIUM", opponentCity: "TAMPA BAY", opponentName: "BUCCANEERS", result: "W", score: "27-14", variant: "gold" },
  { date: "NOVEMBER 23, 2023", stadium: "LUMEN FIELD", opponentCity: "SEATTLE", opponentName: "SEAHAWKS", result: "W", score: "31-13", variant: "gold" },
  { date: "DECEMBER 3, 2023", stadium: "LINCOLN FINANCIAL FIELD", opponentCity: "PHILADELPHIA", opponentName: "EAGLES", result: "W", score: "42-19", variant: "gold" },
  { date: "DECEMBER 10, 2023", stadium: "LEVI'S STADIUM", opponentCity: "SEATTLE", opponentName: "SEAHAWKS", result: "W", score: "28-26", variant: "gold" },
  { date: "DECEMBER 17, 2023", stadium: "STATE FARM STADIUM", opponentCity: "ARIZONA", opponentName: "CARDINALS", result: "W", score: "45-29", variant: "gold" },
  { date: "DECEMBER 25, 2023", stadium: "ALLEGIANT STADIUM", opponentCity: "BALTIMORE", opponentName: "RAVENS", result: "L", score: "19-33", variant: "white" },
  { date: "DECEMBER 31, 2023", stadium: "FEDEXFIELD", opponentCity: "WASHINGTON", opponentName: "COMMANDERS", result: "W", score: "27-10", variant: "gold" },
  { date: "JANUARY 7, 2024", stadium: "LEVI'S STADIUM", opponentCity: "LOS ANGELES", opponentName: "RAMS", result: "L", score: "20-21", variant: "gold" },
  { date: "JANUARY 20, 2024", stadium: "LEVI'S STADIUM", opponentCity: "GREEN BAY", opponentName: "PACKERS", result: "W", score: "24-21", variant: "gold" },
  { date: "JANUARY 28, 2024", stadium: "LEVI'S STADIUM", opponentCity: "DETROIT", opponentName: "LIONS", result: "W", score: "34-31", variant: "gold" },
  { date: "FEBRUARY 11, 2024", stadium: "ALLEGIANT STADIUM", opponentCity: "KANSAS CITY", opponentName: "CHIEFS", result: "L", score: "22-25", variant: "gold" },
];

export const mockWeeklyBars: { week: string; value: number }[] = [
  { week: "WK 1", value: 28 },
  { week: "WK 2", value: 44 },
  { week: "WK 3", value: 55 },
  { week: "WK 4", value: 48 },
  { week: "WK 5", value: 52 },
  { week: "WK 6", value: 53 },
  { week: "WK 7", value: 40 },
  { week: "WK 8", value: 38 },
  { week: "WK 9", value: 36 },
  { week: "WK 10", value: 22 },
  { week: "WK 11", value: 31 },
  { week: "WK 12", value: 29 },
  { week: "WK 13", value: 42 },
  { week: "WK 14", value: 35 },
  { week: "WK 15", value: 58 },
  { week: "WK 16", value: 49 },
];

// deterministic PRNG (same output on server + client)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(49_2024);

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function toHt(feet: number, inches: number) {
  return `${feet}-${inches}`;
}

const firstNames = [
  "Trent","Brock","Fred","Nick","Deebo","George","Brandon","Christian","Charvarius","Javon",
  "Dre","Talanoa","Arik","Sam","Kyle","Jake","Tashaun","Isaiah","Jordan","Colton",
];
const lastNames = [
  "Williams","Purdy","Warner","Bosa","Samuel","Kittle","Aiyuk","McCaffrey","Ward","Hargrave",
  "Greenlaw","Hufanga","Armstead","Darnold","Juszcyk","Moody","Gipson","Oliver","Mason","McKivitz",
];
const colleges = [
  "Oklahoma","Iowa State","BYU","Ohio State","South Carolina","Iowa","Arizona State","Stanford",
  "LSU","Georgia","Alabama","Clemson","Notre Dame","Michigan","USC","Texas","Florida","Miami",
];
const positions = ["QB","RB","WR","TE","OL","DL","LB","CB","S","K","P"] as const;

function makePlayer(id: number): PlayerRow {
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[(id * 3) % lastNames.length];
  const basePos = positions[id % positions.length];
  const pos = basePos === "OL" ? "T" : basePos;

  const ht = (() => {
    if (pos === "QB" || pos === "WR" || pos === "CB" || pos === "S") return toHt(6, randInt(0, 3));
    if (pos === "RB" || pos === "LB") return toHt(5, randInt(10, 11));
    if (pos === "TE") return toHt(6, randInt(3, 6));
    if (pos === "T" || pos === "DL") return toHt(6, randInt(4, 8));
    return toHt(6, randInt(0, 2));
  })();

  const wt = (() => {
    if (pos === "QB") return randInt(205, 245);
    if (pos === "RB") return randInt(195, 235);
    if (pos === "WR") return randInt(180, 225);
    if (pos === "TE") return randInt(235, 265);
    if (pos === "T") return randInt(285, 345);
    if (pos === "DL") return randInt(260, 325);
    if (pos === "LB") return randInt(220, 260);
    if (pos === "CB" || pos === "S") return randInt(185, 220);
    if (pos === "K" || pos === "P") return randInt(170, 215);
    return randInt(190, 240);
  })();

  const age = randInt(21, 36);
  const exp = Math.min(Math.max(age - 21, 0), 15);

  return {
    id,
    seasonRank: id,
    gameRank: id,
    jersey: randInt(0, 99),
    firstName,
    lastName,
    pos,
    ht,
    wt,
    age,
    exp,
    college: colleges[id % colleges.length],
  };
}

export const mockPlayers: PlayerRow[] = (() => {
  const count = 200;
  const rows = Array.from({ length: count }).map((_, i) => makePlayer(i + 1));

  rows[0] = {
    ...rows[0],
    jersey: 71,
    firstName: "Trent",
    lastName: "Williams",
    pos: "T",
    ht: "6-5",
    wt: 320,
    age: 36,
    exp: 15,
    college: "Oklahoma",
  };

  rows.forEach((r, idx) => (r.gameRank = idx + 1));

  const ranks = Array.from({ length: count }, (_, i) => i + 1);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  rows.forEach((r, idx) => (r.seasonRank = ranks[idx]));

  return rows;
})();
