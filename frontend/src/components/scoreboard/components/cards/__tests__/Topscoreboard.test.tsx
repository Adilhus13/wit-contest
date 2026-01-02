import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/components/scoreboard/api";
import { TopScoreboard } from "../TopScoreboard";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/components/scoreboard/api", () => ({
  apiGet: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("../GameCard", () => ({
  GameCard: ({ game }: any) => <div data-testid="game-card">{game.id}</div>,
}));

jest.mock("../../common/Spinner", () => ({
  Spinner: ({ label }: any) => <div data-testid="spinner">{label}</div>,
}));

const mockUseQuery = useQuery as unknown as jest.Mock;
const mockApiGet = apiGet as unknown as jest.Mock;

describe("TopScoreboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the loading spinner when gamesQuery.isLoading is true", () => {
    mockUseQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
    });

    render(<TopScoreboard />);

    expect(screen.getByTestId("spinner")).toHaveTextContent("Loading games");
    expect(screen.queryAllByTestId("game-card")).toHaveLength(0);
  });

  it("renders header content (team name + season)", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: [],
    });

    render(<TopScoreboard />);

    expect(screen.getByText("San Francisco 49ers")).toBeInTheDocument();
    expect(screen.getByText("2023 - 2024 SEASON")).toBeInTheDocument();
  });

  it("renders a GameCard for each game when not loading", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: [{ id: "g1" }, { id: "g2" }, { id: "g3" }],
    });

    render(<TopScoreboard />);

    const cards = screen.getAllByTestId("game-card");
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveTextContent("g1");
    expect(cards[1]).toHaveTextContent("g2");
    expect(cards[2]).toHaveTextContent("g3");

    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });

  it("calls useQuery with the expected queryKey (limit 12)", () => {
    let capturedConfig: any;

    mockUseQuery.mockImplementation((config: any) => {
      capturedConfig = config;
      return { isLoading: true, data: undefined };
    });

    render(<TopScoreboard />);

    expect(mockUseQuery).toHaveBeenCalledTimes(1);
    expect(capturedConfig.queryKey).toEqual(["games", { limit: 12 }]);
    expect(typeof capturedConfig.queryFn).toBe("function");
  });

  it("queryFn calls apiGet with the correct URL and normalizes array response", async () => {
    let capturedConfig: any;

    mockUseQuery.mockImplementation((config: any) => {
      capturedConfig = config;
      return { isLoading: true, data: undefined };
    });

    render(<TopScoreboard />);

    mockApiGet.mockResolvedValueOnce([{ id: "a" }, { id: "b" }]);

    const result = await capturedConfig.queryFn();

    expect(mockApiGet).toHaveBeenCalledWith("/games?limit=12");
    expect(result).toEqual([{ id: "a" }, { id: "b" }]);
  });

  it("queryFn normalizes { data: GameDto[] } response shape", async () => {
    let capturedConfig: any;

    mockUseQuery.mockImplementation((config: any) => {
      capturedConfig = config;
      return { isLoading: true, data: undefined };
    });

    render(<TopScoreboard />);

    mockApiGet.mockResolvedValueOnce({ data: [{ id: "x" }] });

    const result = await capturedConfig.queryFn();

    expect(mockApiGet).toHaveBeenCalledWith("/games?limit=12");
    expect(result).toEqual([{ id: "x" }]);
  });

  it("queryFn returns [] when response is an object missing data", async () => {
    let capturedConfig: any;

    mockUseQuery.mockImplementation((config: any) => {
      capturedConfig = config;
      return { isLoading: true, data: undefined };
    });

    render(<TopScoreboard />);

    mockApiGet.mockResolvedValueOnce({});

    const result = await capturedConfig.queryFn();

    expect(mockApiGet).toHaveBeenCalledWith("/games?limit=12");
    expect(result).toEqual([]);
  });
});
