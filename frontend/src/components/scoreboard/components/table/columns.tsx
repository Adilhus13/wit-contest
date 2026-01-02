import { SortKey } from "../../types";

export const columns: Array<
  | { label: string }
  | { label: string; sortKey: SortKey }
> = [
  { label: "SEASON RANK" },
  { label: "GAME RANK" },
  { label: "#", sortKey: "jersey_number" },
  { label: "FIRST NAME", sortKey: "first_name" },
  { label: "LAST NAME", sortKey: "last_name" },
  { label: "POS", sortKey: "position" },
  { label: "HT", sortKey: "height_in" },
  { label: "WT", sortKey: "weight_lb" },
  { label: "AGE", sortKey: "age" },
  { label: "EXP", sortKey: "experience_years" },
  { label: "COLLEGE", sortKey: "college" },
];
