import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { GameCard } from "../GameCard";
import { GameDto } from "@/components/scoreboard/types";

describe("GameCard", () => {
  const baseGame = {
    date: "December 07, 2025",
    stadium: "Levi's Stadium",
    logoUrl: "https://example.com/logo.png",
    opponentCity: "Seattle",
    opponentName: "Seahawks",
    result: "W",
    score: "24-17",
  };

  test("renders date and stadium", () => {
    render(<GameCard game={baseGame as GameDto} />);

    expect(screen.getByText("December 07, 2025")).toBeInTheDocument();
    expect(screen.getByText("Levi's Stadium")).toBeInTheDocument();
  });

  test("renders opponent city and name", () => {
    render(<GameCard game={baseGame as any} />);

    expect(screen.getByText("VS")).toBeInTheDocument();
    expect(screen.getByText("Seattle")).toBeInTheDocument();
    expect(screen.getByText("Seahawks")).toBeInTheDocument();
  });

  test("renders result and score", () => {
    render(<GameCard game={baseGame as any} />);

    // "W 24-17" but W is inside <strong>, so test separately
    expect(screen.getByText("W")).toBeInTheDocument();
    expect(screen.getByText("24-17")).toBeInTheDocument();
  });

  test("renders logo image with correct src and alt", () => {
    render(<GameCard game={baseGame as any} />);

    const img = screen.getByRole("img", { name: "Seahawks logo" });
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
  });

  test("uses fallback alt text when opponentName is missing", () => {
    render(
      <GameCard
        game={{
          ...baseGame,
          opponentName: null,
          logoUrl: "https://example.com/logo2.png",
        } as any}
      />
    );

    const img = screen.getByRole("img", { name: "Opponent logo" });
    expect(img).toHaveAttribute("src", "https://example.com/logo2.png");
  });
});
