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
    playerId: r.playerId,
    seasonRank: Number(r.seasonRank ?? idx + 1),
    gameRank: Number(r.gameRank ?? idx + 1),
    jersey: Number(r.jerseyNumber ?? 0),
    firstName: r.firstName ?? "",
    lastName: r.lastName ?? "",
    pos: (r.position ?? "").toUpperCase(),
    ht: heightInToFtIn(r.heightIn),
    wt: Number(r.weightLb ?? 0),
    age: Number(r.age ?? 0),
    exp: Number(r.experienceYears ?? 0),
    college: r.college ?? "",
    headshotUrl: r.headshotUrl ?? "",

  };
}

export const toNullOrNumber = (v: number | ""): number | null => {
  return v === "" ? null : Number(v);
}

export const toPlayerPayload = (values: PlayerFormValues) => {
  return {
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
    jersey_number: Number(values.jerseyNumber),
    position: values.position?.trim() || null,
    status: values.status,
    height_in: toNullOrNumber(values.heightIn),
    weight_lb: toNullOrNumber(values.weightLb),
    age: toNullOrNumber(values.age),
    experience_years: toNullOrNumber(values.experienceYears),
    college: values.college?.trim() || null,
  };
}

export const toFormValues = (row?: UIPlayerRow | null): PlayerFormValues => {
  if (!row) {
    return {
      playerId: 0,
      firstName: "",
      lastName: "",
      jerseyNumber: "",
      position: "",
      status: "active",
      heightIn: "",
      weightLb: "",
      age: "",
      experienceYears: "",
      college: "",
    };
  }

  let heightIn: number | "" = "";
  if (row.ht) {
    const [f, i] = row.ht.split("-").map((x) => parseInt(x, 10));
    if (Number.isFinite(f) && Number.isFinite(i)) heightIn = f * 12 + i;
  }

  return {
    playerId: row.playerId ?? 0,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    jerseyNumber: row.jersey ?? "",
    position: row.pos ?? "",
    status: "active",
    heightIn,
    weightLb: row.wt ?? "",
    age: row.age ?? "",
    experienceYears: row.exp ?? "",
    college: row.college ?? "",
  };
}

export const parseNum = (v: string): number | "" => {
  if (v.trim() === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}
