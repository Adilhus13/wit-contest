// ScorecardPage.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import ScorecardPage from "../ScorecardPage";

// ✅ Adjust this import to your actual file path (e.g. app/scorecard/page)

// --------------------
// Mocks: next/navigation
// --------------------
const push = jest.fn((url: string) => {
  window.history.pushState({}, "", url);
});
const replace = jest.fn((url: string) => {
  window.history.replaceState({}, "", url);
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
  useSearchParams: () => ({
    get: (key: string) => new URLSearchParams(window.location.search).get(key),
  }),
}));

// --------------------
// Mocks: data/hooks/api/util
// --------------------
const useLeaderboardMock = jest.fn();

jest.mock("../hooks/useLeaderboard", () => ({
  useLeaderboard: (args: any) => useLeaderboardMock(args),
}));

jest.mock("../hooks/useDebouncedValue", () => ({
  useDebouncedValue: (v: any) => v,
}));

const exportLeaderboardCsv = jest.fn();
jest.mock("@/components/scoreboard/api", () => ({
  apiDelete: jest.fn(),
  apiGet: jest.fn(),
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  exportLeaderboardCsv: (...args: any[]) => exportLeaderboardCsv(...args),
  getToken: jest.fn(),
}));

const showToast = jest.fn();
jest.mock("../components/common/Toast", () => ({
  showToast: (args: any) => showToast(args),
}));

const toPlayerPayload = jest.fn((values: any) => ({ ...values, __payload: true }));
const mapRow = jest.fn((r: any) => r);
jest.mock("../mappers", () => ({
  toPlayerPayload: (v: any) => toPlayerPayload(v),
  mapRow: (r: any) => mapRow(r),
}));

// --------------------
// Mocks: leaf UI components (keep tests focused on ScorecardPage logic)
// --------------------
jest.mock("../components/cards/TopScoreboard", () => ({
  TopScoreboard: () => <div data-testid="top-scoreboard" />,
}));

jest.mock("../components/layout/FilterSidebar", () => ({
  FilterSidebar: () => <div data-testid="filter-sidebar" />,
}));

const rightPanelSpy = jest.fn();
jest.mock("../components/cards/RightPanel", () => ({
  RightPanel: (props: any) => {
    rightPanelSpy(props);
    return <div data-testid="right-panel" />;
  },
}));

const topBarSpy = jest.fn();
jest.mock("../components/layout/TopBar", () => ({
  TopBar: (props: any) => {
    topBarSpy(props);
    return (
      <div data-testid="top-bar">
        <div data-testid="top-bar-search">{props.search}</div>
        <button onClick={() => props.onSearchChange("cmc")} data-testid="btn-set-search">
          set-search
        </button>
        <button onClick={props.actions.onExport} data-testid="btn-export">
          export
        </button>
        <button onClick={props.actions.onAdd} data-testid="btn-add">
          add
        </button>
        <button onClick={props.actions.onEdit} data-testid="btn-edit">
          edit
        </button>
        <button onClick={props.actions.onDelete} data-testid="btn-delete">
          delete
        </button>
      </div>
    );
  },
}));

const leaderboardTableSpy = jest.fn();
jest.mock("../components/table/LeaderboardTable", () => ({
  LeaderboardTable: (props: any) => {
    leaderboardTableSpy(props);
    return (
      <div data-testid="leaderboard-table">
        <div data-testid="selected-id">{String(props.selectedId ?? "")}</div>
        <button onClick={() => props.onSortChange("season_rank")} data-testid="btn-sort-same">
          sort-same
        </button>
        <button onClick={() => props.onSortChange("name")} data-testid="btn-sort-diff">
          sort-diff
        </button>
        <button onClick={() => props.onSelect(props.rows?.[1]?.id)} data-testid="btn-select-second">
          select-second
        </button>
      </div>
    );
  },
}));

const paginationSpy = jest.fn();
jest.mock("../components/table/PaginationBar", () => ({
  PaginationBar: (props: any) => {
    paginationSpy(props);
    return (
      <div data-testid="pagination">
        <div data-testid="can-prev">{String(props.canPrev)}</div>
        <div data-testid="can-next">{String(props.canNext)}</div>
        <button onClick={props.onPrev} data-testid="btn-prev">
          prev
        </button>
        <button onClick={props.onNext} data-testid="btn-next">
          next
        </button>
        <button onClick={() => props.onLimitChange(50)} data-testid="btn-limit-50">
          limit-50
        </button>
      </div>
    );
  },
}));

jest.mock("../components/layout/ScorecardLayout", () => ({
  ScoreboardLayout: ({ hero, top, sidebar, right, children }: any) => (
    <div data-testid="layout">
      <div data-testid="slot-hero">{hero}</div>
      <div data-testid="slot-top">{top}</div>
      <div data-testid="slot-sidebar">{sidebar}</div>
      <div data-testid="slot-right">{right}</div>
      <div data-testid="slot-children">{children}</div>
    </div>
  ),
}));

const createEditModalSpy = jest.fn();
jest.mock("../components/modals/CreateEditPlayerModal", () => ({
  CreateEditPlayerModal: (props: any) => {
    createEditModalSpy(props);
    if (!props.open) return null;
    return (
      <div data-testid="create-edit-modal">
        <div data-testid="modal-mode">{props.mode}</div>
        <button
          data-testid="btn-modal-submit"
          onClick={() => props.onSubmit({ firstName: "Test", lastName: "Player" })}
        >
          submit
        </button>
        <button data-testid="btn-modal-close" onClick={props.onClose}>
          close
        </button>
      </div>
    );
  },
}));

const deleteModalSpy = jest.fn();
jest.mock("../components/modals/DeletePlayerModal", () => ({
  DeletePlayerModal: (props: any) => {
    deleteModalSpy(props);
    if (!props.open) return null;
    return (
      <div data-testid="delete-modal">
        <button data-testid="btn-delete-confirm" onClick={props.onConfirm}>
          confirm
        </button>
        <button data-testid="btn-delete-close" onClick={props.onClose}>
          close
        </button>
      </div>
    );
  },
}));

// --------------------
// Test helpers
// --------------------
const makeLeaderboardReturn = (overrides?: Partial<any>) => {
  const createPlayer = jest.fn(async () => {});
  const updatePlayer = jest.fn(async () => {});
  const deletePlayer = jest.fn(async () => {});

  const base = {
    createPlayer,
    createLoading: false,
    updatePlayer,
    updateLoading: false,
    deletePlayer,
    deleteLoading: false,
    leaderboardLoading: false,
    leaderboardData: {
      meta: { last_page: 3 },
      data: [
        { id: 101, playerId: 101, gameRank: 5, firstName: "A", lastName: "One", jersey: 1, pos: "QB" },
        { id: 202, playerId: 202, gameRank: 9, firstName: "B", lastName: "Two", jersey: 2, pos: "RB" },
      ],
    },
  };

  return { ...base, ...overrides };
};

const setUrl = (qs: string) => {
  window.history.replaceState({}, "", qs.startsWith("?") ? qs : `?${qs}`);
};

describe("ScorecardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUrl("?search=joe&sort=season_rank&order=asc&page=2&limit=20");
    useLeaderboardMock.mockReturnValue(makeLeaderboardReturn());
  });

  it("renders the layout slots and wires leaderboard hook with search params", async () => {
    render(<ScorecardPage />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("top-scoreboard")).toBeInTheDocument();
    expect(screen.getByTestId("filter-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("top-bar")).toBeInTheDocument();
    expect(screen.getByTestId("leaderboard-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();

    expect(screen.getByTestId("top-bar-search")).toHaveTextContent("joe");

    expect(useLeaderboardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        season: 2023,
        limit: 20,
        page: 2,
        sort: "season_rank",
        order: "asc",
        debouncedSearch: "joe",
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("selected-id")).toHaveTextContent("101");
    });

    expect(screen.getByTestId("right-panel")).toBeInTheDocument();
    expect(rightPanelSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selected: expect.objectContaining({ id: 101 }),
      })
    );
  });

  it("when searchInput changes, pushes updated query params (search + page=1)", async () => {
    const user = userEvent.setup();
    render(<ScorecardPage />);

    await waitFor(() => expect(screen.getByTestId("selected-id")).toHaveTextContent("101"));

    await user.click(screen.getByTestId("btn-set-search"));

    expect(push).toHaveBeenCalled();
    const pushedUrl = push.mock.calls[push.mock.calls.length - 1][0] as string;

    expect(pushedUrl).toEqual(expect.stringContaining("search=cmc"));
    expect(pushedUrl).toEqual(expect.stringContaining("page=1"));
    expect(pushedUrl).toEqual(expect.stringContaining("sort=season_rank"));
    expect(pushedUrl).toEqual(expect.stringContaining("order=asc"));
    expect(pushedUrl).toEqual(expect.stringContaining("limit=20"));
  });

  it("handleSortChange toggles order when clicking same sort key", async () => {
    const user = userEvent.setup();
    render(<ScorecardPage />);

    await user.click(screen.getByTestId("btn-sort-same"));

    const pushedUrl = push.mock.calls[push.mock.calls.length - 1][0] as string;
    expect(pushedUrl).toEqual(expect.stringContaining("sort=season_rank"));
    expect(pushedUrl).toEqual(expect.stringContaining("order=desc")); // asc -> desc
    expect(pushedUrl).toEqual(expect.stringContaining("page=1"));
  });

  it("handleSortChange sets order=asc when switching to a different sort key", async () => {
    const user = userEvent.setup();
    render(<ScorecardPage />);

    await user.click(screen.getByTestId("btn-sort-diff"));

    const pushedUrl = push.mock.calls[push.mock.calls.length - 1][0] as string;
    expect(pushedUrl).toEqual(expect.stringContaining("sort=name"));
    expect(pushedUrl).toEqual(expect.stringContaining("order=asc"));
    expect(pushedUrl).toEqual(expect.stringContaining("page=1"));
  });

  it("computes canPrev/canNext and passes them to PaginationBar", async () => {
    render(<ScorecardPage />);

    expect(screen.getByTestId("can-prev")).toHaveTextContent("true");
    expect(screen.getByTestId("can-next")).toHaveTextContent("true");

    expect(paginationSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 2,
        limit: 20,
        canPrev: true,
        canNext: true,
      })
    );
  });

  it("Add flow: opens create modal and submitting calls createPlayer(payload) then closes", async () => {
    const user = userEvent.setup();
    const lb = makeLeaderboardReturn();
    useLeaderboardMock.mockReturnValue(lb);

    render(<ScorecardPage />);

    await user.click(screen.getByTestId("btn-add"));

    expect(screen.getByTestId("create-edit-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-mode")).toHaveTextContent("create");

    await user.click(screen.getByTestId("btn-modal-submit"));

    expect(toPlayerPayload).toHaveBeenCalledWith({ firstName: "Test", lastName: "Player" });
    expect(lb.createPlayer).toHaveBeenCalledWith(expect.objectContaining({ __payload: true }));

    await waitFor(() => {
      expect(screen.queryByTestId("create-edit-modal")).not.toBeInTheDocument();
    });
  });

  it("Edit flow: opens edit modal and submitting calls updatePlayer({id, payload}) then closes", async () => {
    const user = userEvent.setup();
    const lb = makeLeaderboardReturn();
    useLeaderboardMock.mockReturnValue(lb);

    render(<ScorecardPage />);

    await waitFor(() => expect(screen.getByTestId("selected-id")).toHaveTextContent("101"));

    await user.click(screen.getByTestId("btn-edit"));

    expect(screen.getByTestId("create-edit-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-mode")).toHaveTextContent("edit");

    await user.click(screen.getByTestId("btn-modal-submit"));

    expect(toPlayerPayload).toHaveBeenCalledWith({ firstName: "Test", lastName: "Player" });
    expect(lb.updatePlayer).toHaveBeenCalledWith({
      id: 101,
      payload: expect.objectContaining({ __payload: true }),
    });

    await waitFor(() => {
      expect(screen.queryByTestId("create-edit-modal")).not.toBeInTheDocument();
    });
  });

  it("Delete flow: opens delete modal and confirming calls deletePlayer(selectedId), then clears selection and closes modal", async () => {
    const user = userEvent.setup();
    const lb = makeLeaderboardReturn();
    useLeaderboardMock.mockReturnValue(lb);

    render(<ScorecardPage />);

    await waitFor(() => expect(screen.getByTestId("selected-id")).toHaveTextContent("101"));
    expect(screen.getByTestId("right-panel")).toBeInTheDocument();

    await user.click(screen.getByTestId("btn-delete"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("btn-delete-confirm"));

    expect(lb.deletePlayer).toHaveBeenCalledWith(101);

    await waitFor(() => {
      expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("right-panel")).not.toBeInTheDocument();
    });
  });
});
