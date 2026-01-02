import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RightPanel } from "../RightPanel";


const rankingChartMock = jest.fn();
jest.mock("../RankingChartCard", () => ({
  RankingChartCard: (props: any) => {
    rankingChartMock(props);
    return <div data-testid="ranking-chart-card" />;
  },
}));

const playerSummaryMock = jest.fn();
jest.mock("../PlayerSummaryCard", () => ({
  PlayerSummaryCard: (props: any) => {
    playerSummaryMock(props);
    return <div data-testid="player-summary-card" />;
  },
}));

type UIPlayerRow = {
  gameRank: number;
  firstName: string;
  lastName: string;
  jersey: number | string;
  pos?: string | null;
  headshotUrl?: string | null;
};

describe("RightPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders RankingChartCard and PlayerSummaryCard", () => {
    const selected: UIPlayerRow = {
      gameRank: 3,
      firstName: "Brock",
      lastName: "Purdy",
      jersey: 13,
      pos: "QB",
      headshotUrl: null,
    };

    render(<RightPanel selected={selected as any} />);

    expect(screen.getByTestId("ranking-chart-card")).toBeInTheDocument();
    expect(screen.getByTestId("player-summary-card")).toBeInTheDocument();
  });

  it("passes selected.gameRank and the correct seasonLabel to RankingChartCard", () => {
    const selected: UIPlayerRow = {
      gameRank: 11,
      firstName: "Christian",
      lastName: "McCaffrey",
      jersey: 23,
      pos: "RB",
    };

    render(<RightPanel selected={selected as any} />);

    expect(rankingChartMock).toHaveBeenCalledTimes(1);
    expect(rankingChartMock).toHaveBeenCalledWith({
      ranking: 11,
      seasonLabel: "2023-2024 SEASON",
    });
  });

  it("passes the selected player object to PlayerSummaryCard as `player`", () => {
    const selected: UIPlayerRow = {
      gameRank: 1,
      firstName: "George",
      lastName: "Kittle",
      jersey: 85,
      pos: "TE",
      headshotUrl: "https://cdn.example.com/kittle.png",
    };

    render(<RightPanel selected={selected as any} />);

    expect(playerSummaryMock).toHaveBeenCalledTimes(1);
    expect(playerSummaryMock).toHaveBeenCalledWith({ player: selected });
  });
});
