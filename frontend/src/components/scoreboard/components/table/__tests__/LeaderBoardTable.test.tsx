// LeaderboardTable.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { LeaderboardTable } from "../LeaderboardTable";


const headerCellSpy = jest.fn();
jest.mock("../HeaderCell", () => ({
  HeaderCell: (props: any) => {
    headerCellSpy(props);
    return (
      <div data-testid="header-cell">
        <span>{props.label}</span>
        {"sortKey" in props && props.sortKey ? (
          <button
            data-testid={`sort-${props.sortKey}`}
            onClick={() => props.onSortChange(props.sortKey)}
          >
            sort
          </button>
        ) : null}
      </div>
    );
  },
}));

jest.mock("../columns", () => ({
  columns: [
    { label: "Season Rank", sortKey: "season_rank" },
    { label: "First", sortKey: "first_name" },
    { label: "Jersey" },
  ],
}));

// ---- Mock Spinner ----
jest.mock("../../common/Spinner", () => ({
  Spinner: ({ label }: any) => <div data-testid="spinner">{label}</div>,
}));

const useVirtualizerMock = jest.fn();
jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: (args: any) => useVirtualizerMock(args),
}));

type SortKey = "season_rank" | "first_name";
type SortOrder = "asc" | "desc";

const makeRows = () => [
  {
    id: 1,
    playerId: 101,
    seasonRank: 1,
    gameRank: 5,
    jersey: 13,
    firstName: "Brock",
    lastName: "Purdy",
    pos: "QB",
    ht: "6-1",
    wt: "220",
    age: 24,
    exp: 2,
    college: "Iowa State",
  },
  {
    id: 2,
    playerId: 202,
    seasonRank: 2,
    gameRank: 1,
    jersey: 23,
    firstName: "Christian",
    lastName: "McCaffrey",
    pos: "RB",
    ht: "5-11",
    wt: "205",
    age: 27,
    exp: 7,
    college: "Stanford",
  },
];

describe("LeaderboardTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useVirtualizerMock.mockReturnValue({
      getVirtualItems: () => [
        { index: 0, start: 0 },
        { index: 1, start: 56 },
      ],
      getTotalSize: () => 112,
    });
  });

  it("renders header cells from columns and passes sort props to sortable headers", () => {
    const onSortChange = jest.fn();

    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={onSortChange}
        loading={false}
      />
    );

    expect(headerCellSpy).toHaveBeenCalled();

    expect(headerCellSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "Season Rank",
        sortKey: "season_rank",
        activeSort: "season_rank",
        order: "asc",
        onSortChange,
      })
    );

    expect(headerCellSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        label: "Jersey",
      })
    );

    expect(screen.getByTestId("sort-season_rank")).toBeInTheDocument();
  });

  it("renders virtualized rows and shows row content", () => {
    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    expect(screen.getByText("Brock")).toBeInTheDocument();
    expect(screen.getByText("Purdy")).toBeInTheDocument();
    expect(screen.getByText("Christian")).toBeInTheDocument();
    expect(screen.getByText("McCaffrey")).toBeInTheDocument();

    expect(screen.getByText("Iowa State")).toBeInTheDocument();
    expect(screen.getByText("Stanford")).toBeInTheDocument();
  });

  it("shows Spinner when loading=true", () => {
    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={true}
      />
    );

    expect(screen.getByTestId("spinner")).toHaveTextContent("Loading players");
  });

  it("calls onSelect with playerId when a row is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={onSelect}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    await user.click(screen.getByText("Brock"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(101);
  });

  it("toggles selection off when clicking the already-selected row", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const rows = makeRows();

    render(
      <LeaderboardTable
        rows={rows as any}
        selectedId={101}
        onSelect={onSelect}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    await user.click(screen.getByText("Brock"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("applies selected styling when selectedId matches row.playerId", () => {
    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={202}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    const cell = screen.getByText("McCaffrey");
    const rowButton = cell.closest("button");
    expect(rowButton).toBeInTheDocument();

    expect(rowButton).toHaveClass("bg-[#F6E6E6]");
    expect(rowButton).toHaveClass("border-[#C00000]");
  });

  it("uses react-virtual with the expected config (count, estimateSize, overscan)", () => {
    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    expect(useVirtualizerMock).toHaveBeenCalledTimes(1);
    const args = useVirtualizerMock.mock.calls[0][0];

    expect(args.count).toBe(2);
    expect(typeof args.getScrollElement).toBe("function");
    expect(typeof args.estimateSize).toBe("function");
    expect(args.estimateSize()).toBe(56);
    expect(args.overscan).toBe(10);
  });

  it("positions rows using translateY based on virtual row start", () => {
    useVirtualizerMock.mockReturnValueOnce({
      getVirtualItems: () => [{ index: 0, start: 123 }],
      getTotalSize: () => 56,
    });

    render(
      <LeaderboardTable
        rows={makeRows() as any}
        selectedId={null}
        onSelect={jest.fn()}
        sort={"season_rank" as SortKey}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        loading={false}
      />
    );

    const rowButton = screen.getByText("Brock").closest("button");
    expect(rowButton).toBeInTheDocument();
    expect(rowButton).toHaveStyle({ transform: "translateY(123px)" });
  });
});
