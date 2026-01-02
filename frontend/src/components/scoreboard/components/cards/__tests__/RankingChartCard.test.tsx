import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RankingChartCard } from "../RankingChartCard";


jest.mock("@/lib/mockData", () => ({
  mockWeeklyBars: [
    { week: 1, value: 10 },
    { week: 2, value: 12 },
    { week: 3, value: 8 },
    { week: 4, value: 15 },
  ],
}));

jest.mock("recharts", () => {
  const React = require("react");

  return {
    ResponsiveContainer: ({ children, width, height }: any) => (
      <div data-testid="responsive-container" data-width={width} data-height={height}>
        {children}
      </div>
    ),
    BarChart: ({ children, data, barCategoryGap }: any) => (
      <div
        data-testid="bar-chart"
        data-data={JSON.stringify(data)}
        data-bar-category-gap={String(barCategoryGap)}
      >
        {children}
      </div>
    ),
    XAxis: ({ dataKey, hide }: any) => (
      <div data-testid="x-axis" data-data-key={dataKey} data-hide={String(!!hide)} />
    ),
    Bar: ({ dataKey, fill, radius, barSize }: any) => (
      <div
        data-testid="bar"
        data-data-key={dataKey}
        data-fill={fill}
        data-radius={JSON.stringify(radius)}
        data-bar-size={String(barSize)}
      />
    ),
  };
});

describe("RankingChartCard", () => {
  it("renders the ranking label and value", () => {
    render(<RankingChartCard ranking={7} seasonLabel="2023 2024 SEASON" />);

    expect(screen.getByText(/RANKING:/i)).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("does not render a second line when seasonLabel has only 1–2 words", () => {
    render(<RankingChartCard ranking={1} seasonLabel="POSTSEASON" />);

    expect(screen.getByText("POSTSEASON")).toBeInTheDocument();
    expect(screen.queryByText(/undefined|null/i)).not.toBeInTheDocument();
  });

  it("renders the last week label based on the last element in mockWeeklyBars", () => {
    render(<RankingChartCard ranking={10} seasonLabel="2023 2024" />);

    expect(screen.getByText("WK 4")).toBeInTheDocument();
  });

  it("passes mockWeeklyBars into the BarChart and uses expected chart props", () => {
    render(<RankingChartCard ranking={10} seasonLabel="2023 2024" />);

    const barChart = screen.getByTestId("bar-chart");
    const data = JSON.parse(barChart.getAttribute("data-data") || "[]");

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(4);
    expect(barChart).toHaveAttribute("data-bar-category-gap", "6");

    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-data-key", "week");
    expect(xAxis).toHaveAttribute("data-hide", "true");

    const bar = screen.getByTestId("bar");
    expect(bar).toHaveAttribute("data-data-key", "value");
    expect(bar).toHaveAttribute("data-fill", "#F7E37A");
    expect(bar).toHaveAttribute("data-radius", JSON.stringify([2, 2, 0, 0]));
    expect(bar).toHaveAttribute("data-bar-size", "10");
  });
});
