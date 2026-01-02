import {
  heightInToFtIn,
  mapRow,
  toNullOrNumber,
  toPlayerPayload,
  toFormValues,
  parseNum,
} from "../mappers";

describe("mappers", () => {
  describe("heightInToFtIn", () => {
    test("returns empty string for null/undefined/<=0", () => {
      expect(heightInToFtIn(null)).toBe("");
      expect(heightInToFtIn(undefined)).toBe("");
      expect(heightInToFtIn(0)).toBe("");
      expect(heightInToFtIn(-5)).toBe("");
    });

    test("converts inches to feet-inches", () => {
      expect(heightInToFtIn(72)).toBe("6-0");
      expect(heightInToFtIn(73)).toBe("6-1");
      expect(heightInToFtIn(80)).toBe("6-8");
    });
  });

  describe("mapRow", () => {
    test("maps API row to UI row and formats fields", () => {
      const ui = mapRow(
        {
          playerId: 57,
          seasonRank: 3,
          gameRank: 2,
          jerseyNumber: 99,
          firstName: "Test",
          lastName: "User",
          position: "fl",
          heightIn: 80,
          weightLb: 220,
          age: 20,
          experienceYears: 2,
          college: "Iowa",
          headshotUrl: "https://img",
        } as any,
        0
      );

      expect(ui.id).toBe(1); // because rawId fallback doesn't exist, idx+1
      expect(ui.playerId).toBe(57);
      expect(ui.seasonRank).toBe(3);
      expect(ui.gameRank).toBe(2);
      expect(ui.jersey).toBe(99);
      expect(ui.firstName).toBe("Test");
      expect(ui.lastName).toBe("User");
      expect(ui.pos).toBe("FL");
      expect(ui.ht).toBe("6-8");
      expect(ui.wt).toBe(220);
      expect(ui.age).toBe(20);
      expect(ui.exp).toBe(2);
      expect(ui.college).toBe("Iowa");
      expect(ui.headshotUrl).toBe("https://img");
    });

    test("uses r.id when present for UI id", () => {
      const ui = mapRow(
        {
          id: 999,
          playerId: 57,
          firstName: "A",
          lastName: "B",
          jerseyNumber: 1,
        } as any,
        5
      );

      expect(ui.id).toBe(999);
      expect(ui.playerId).toBe(57);
    });

    test("uses r.player_id when present for UI id", () => {
      const ui = mapRow(
        {
          player_id: 123,
          playerId: 57,
          firstName: "A",
          lastName: "B",
          jerseyNumber: 1,
        } as any,
        5
      );

      expect(ui.id).toBe(123);
      expect(ui.playerId).toBe(57);
    });
  });

  describe("toNullOrNumber", () => {
    test("converts empty string to null", () => {
      expect(toNullOrNumber("" as any)).toBeNull();
    });

    test("converts number to number", () => {
      expect(toNullOrNumber(0)).toBe(0);
      expect(toNullOrNumber(12)).toBe(12);
    });
  });

  describe("toPlayerPayload", () => {
    test("builds snake_case payload with trims and nulls", () => {
      const payload = toPlayerPayload({
        playerId: 57,
        firstName: "  John ",
        lastName: " Doe  ",
        jerseyNumber: 99,
        position: " qb ",
        status: "active",
        heightIn: "",
        weightLb: 220,
        age: "",
        experienceYears: "",
        college: "  Iowa  ",
      } as any);

      expect(payload).toEqual({
        first_name: "John",
        last_name: "Doe",
        jersey_number: 99,
        position: "qb",
        status: "active",
        height_in: null,
        weight_lb: 220,
        age: null,
        experience_years: null,
        college: "Iowa",
      });
    });
  });

  describe("toFormValues", () => {
    test("returns controlled defaults when no row", () => {
      const v = toFormValues(null);

      expect(v).toEqual({
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
      });
    });

    test("converts ht '6-8' to inches and maps fields", () => {
      const v = toFormValues({
        id: 1,
        playerId: 57,
        seasonRank: 1,
        gameRank: 1,
        jersey: 99,
        firstName: "A",
        lastName: "B",
        pos: "QB",
        ht: "6-8",
        wt: 250,
        age: 25,
        exp: 2,
        college: "Test",
        headshotUrl: "",
      } as any);

      expect(v.playerId).toBe(57);
      expect(v.firstName).toBe("A");
      expect(v.lastName).toBe("B");
      expect(v.jerseyNumber).toBe(99);
      expect(v.position).toBe("QB");
      expect(v.heightIn).toBe(80);
      expect(v.weightLb).toBe(250);
      expect(v.age).toBe(25);
      expect(v.experienceYears).toBe(2);
      expect(v.college).toBe("Test");
    });

    test("defaults playerId to 0 if missing", () => {
      const v = toFormValues({
        id: 1,
        seasonRank: 1,
        gameRank: 1,
        jersey: 99,
        firstName: "A",
        lastName: "B",
        pos: "QB",
        ht: "6-0",
        wt: 200,
        age: 25,
        exp: 2,
        college: "X",
      } as any);

      expect(v.playerId).toBe(0);
    });
  });

  describe("parseNum", () => {
    test("returns empty string for blank input", () => {
      expect(parseNum("")).toBe("");
      expect(parseNum("   ")).toBe("");
    });

    test("returns number for numeric input", () => {
      expect(parseNum("10")).toBe(10);
      expect(parseNum("0")).toBe(0);
    });

    test("returns empty string for non-numeric", () => {
      expect(parseNum("abc")).toBe("");
      expect(parseNum("12x")).toBe("");
    });
  });
});
