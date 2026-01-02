import { LeaderboardApiRow, PlayerFormValues, UIPlayerRow } from "./types";

export const heightInToFtIn = (heightIn: number | null | undefined): string => {
  if (!heightIn || heightIn <= 0) return "";
  const feet = Math.floor(heightIn / 12);
  const inches = heightIn % 12;
  return `${feet}-${inches}`;
}

export const mapRow = (r: LeaderboardApiRow, idx: number): UIPlayerRow => {
  const rawId = (r as any).id ?? (r as any).player_id;
  const id = Number(rawId);
  const safeId = Number.isFinite(id) && id > 0 ? id : idx + 1;

  return {
    id: safeId,
    seasonRank: Number(r.season_rank ?? idx + 1),
    gameRank: Number(r.game_rank ?? idx + 1),
    jersey: Number(r.jersey_number ?? 0),
    firstName: r.first_name ?? "",
    lastName: r.last_name ?? "",
    pos: (r.position ?? "").toUpperCase(),
    ht: heightInToFtIn(r.height_in),
    wt: Number(r.weight_lb ?? 0),
    age: Number(r.age ?? 0),
    exp: Number(r.experience_years ?? 0),
    college: r.college ?? "",
    headshot_url: r.headshot_url ?? "",

  };
}

export const toNullOrNumber = (v: number | ""): number | null => {
  return v === "" ? null : Number(v);
}

export const toPlayerPayload = (values: PlayerFormValues) => {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    jersey_number: Number(values.jersey_number),
    position: values.position?.trim() || null,
    status: values.status,
    height_in: toNullOrNumber(values.height_in),
    weight_lb: toNullOrNumber(values.weight_lb),
    age: toNullOrNumber(values.age),
    experience_years: toNullOrNumber(values.experience_years),
    college: values.college?.trim() || null,
  };
}

export const toFormValues = (row?: UIPlayerRow | null): PlayerFormValues => {
  if (!row) {
    return {
      first_name: "",
      last_name: "",
      jersey_number: "",
      position: "",
      status: "active",
      height_in: "",
      weight_lb: "",
      age: "",
      experience_years: "",
      college: "",
    };
  }

  let height_in: number | "" = "";
  if (row.ht) {
    const [f, i] = row.ht.split("-").map((x) => parseInt(x, 10));
    if (Number.isFinite(f) && Number.isFinite(i)) height_in = f * 12 + i;
  }

  return {
    first_name: row.firstName ?? "",
    last_name: row.lastName ?? "",
    jersey_number: row.jersey ?? "",
    position: row.pos ?? "",
    status: "active",
    height_in,
    weight_lb: row.wt ?? "",
    age: row.age ?? "",
    experience_years: row.exp ?? "",
    college: row.college ?? "",
  };
}

export const parseNum = (v: string): number | "" => {
  if (v.trim() === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}
