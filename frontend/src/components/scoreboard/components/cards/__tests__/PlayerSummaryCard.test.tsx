import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PlayerSummaryCard } from "../PlayerSummaryCard";
import { UIPlayerRow } from "@/components/scoreboard/types";

describe("PlayerSummaryCard", () => {
  const basePlayer: UIPlayerRow = {
    id: 1,
    playerId: 1,
    firstName: "LeBron",
    lastName: "James",
    headshotUrl: "https://cdn.example.com/lebron.png",
    jersey: 23,
    pos: "SF",
    seasonRank: 1,
    gameRank: 1,
    ht: "6-9",
    wt: 250,
    age: 36,
    exp: 18,
    college: "St. Vincent-St. Mary HS",
  };

  it("renders first name and last name", () => {
    render(<PlayerSummaryCard player={basePlayer as any} />);

    expect(screen.getByText("LeBron")).toBeInTheDocument();
    expect(screen.getByText("James")).toBeInTheDocument();
  });

  it("renders jersey number and position", () => {
    render(<PlayerSummaryCard player={basePlayer as any} />);

    // jersey / pos appear in the same line: "#{jersey}   {pos}"
    expect(screen.getByText(/#23/i)).toBeInTheDocument();
    expect(screen.getByText(/SF/i)).toBeInTheDocument();
  });

  it("uses player.headshotUrl when provided", () => {
    render(<PlayerSummaryCard player={basePlayer as any} />);

    const img = screen.getByRole("img", { name: "LeBron James" });
    expect(img).toHaveAttribute("src", "https://cdn.example.com/lebron.png");
  });

  it("falls back to placeholder image when headshotUrl is missing", () => {
    const playerNoHeadshot: UIPlayerRow = {
      ...basePlayer,
      headshotUrl: undefined,
    };

    render(<PlayerSummaryCard player={playerNoHeadshot as any} />);

    const img = screen.getByRole("img", { name: "LeBron James" });
    expect(img).toHaveAttribute("src", "/placeholder-headshot.png");
  });

  it("sets image alt text to '<firstName> <lastName>' trimmed", () => {
    const weirdSpacingName: UIPlayerRow = {
      ...basePlayer,
      firstName: "Prince",
      lastName: "", // will produce "Prince " then trim => "Prince"
    };

    render(<PlayerSummaryCard player={weirdSpacingName as any} />);

    const img = screen.getByRole("img", { name: "Prince" });
    expect(img).toBeInTheDocument();
  });
});
