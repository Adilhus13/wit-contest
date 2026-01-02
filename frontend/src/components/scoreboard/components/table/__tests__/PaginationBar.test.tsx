import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PaginationBar } from "../PaginationBar";

type PaginatorMeta = {
  from?: number | null;
  to?: number | null;
  total: number;
  last_page: number;
};

describe("PaginationBar", () => {
  const setup = (overrides?: Partial<React.ComponentProps<typeof PaginationBar>>) => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    const onLimitChange = jest.fn();

    const props: React.ComponentProps<typeof PaginationBar> = {
      loading: false,
      meta: null,
      page: 1,
      canPrev: false,
      canNext: true,
      onPrev,
      onNext,
      limit: 20,
      onLimitChange,
      currentCount: 12,
      ...overrides,
    };

    render(<PaginationBar {...props} />);
    return { props, onPrev, onNext, onLimitChange };
  };

  it("renders fallback text 'Loading…' when meta is null and loading=true", () => {
    setup({ meta: null, loading: true });

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders fallback text 'Showing {currentCount} rows' when meta is null and loading=false", () => {
    setup({ meta: null, loading: false, currentCount: 7 });

    expect(screen.getByText("Showing 7 rows")).toBeInTheDocument();
  });

  it("renders meta-based range when meta is provided", () => {
    const meta: PaginatorMeta = { from: 21, to: 40, total: 123, last_page: 7 };
    setup({ meta });

    expect(screen.getByText(/Showing/i)).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("uses '-' when meta.from or meta.to are null/undefined", () => {
    const meta: PaginatorMeta = { from: null, to: undefined, total: 50, last_page: 5 };
    setup({ meta });

    // The component prints '-' for from/to in this case
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  it("shows 'Page X' and includes '/ last_page' only when meta exists", () => {
    // no meta: no "/ last_page"
    setup({ meta: null, page: 3 });
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText(/\/\s*\d+/)).not.toBeInTheDocument();

    // with meta: shows "/ last_page"
    const meta: PaginatorMeta = { from: 1, to: 10, total: 10, last_page: 9 };
    setup({ meta, page: 3 });
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("select shows current limit and changing it calls onLimitChange with a number", async () => {
    const user = userEvent.setup();
    const { onLimitChange } = setup({ limit: 20 });

    const select = screen.getByLabelText("Rows per page");
    expect(select).toHaveValue("20");

    await user.selectOptions(select, "50");
    expect(onLimitChange).toHaveBeenCalledTimes(1);
    expect(onLimitChange).toHaveBeenCalledWith(50);
  });


})
