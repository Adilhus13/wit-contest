import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { HeaderCell } from "../HeaderCell";
import { SortOrder } from "@/components/scoreboard/types";

describe("HeaderCell", () => {
  it("renders a non-sortable header as a div (no button) when sortKey is not provided", () => {
    render(<HeaderCell label="PLAYER" />);

    expect(screen.getByText("PLAYER")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a sortable header as a button when sortKey is provided", () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();
     render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"season_rank"}
        order={"asc" as SortOrder}
        onSortChange={onSortChange}
      />
    );

    const btn = screen.getByRole("button", { name: "RANK" });
    expect(btn).toBeInTheDocument();
  });

  it("calls onSortChange with sortKey when clicked", async () => {
    const user = userEvent.setup();
    const onSortChange = jest.fn();

    render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank" }
        activeSort={"season_rank"}
        order={"asc"}
        onSortChange={onSortChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "RANK" }));
    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith("season_rank");
  });

  it("sets aria-sort='none' when not active", () => {
    render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"first_name"}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
      />
    );

    const btn = screen.getByRole("button", { name: "RANK" });
    expect(btn).toHaveAttribute("aria-sort", "none");
  });

    it("sets aria-sort='ascending' when active and order=asc", () => {
    render(
        <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"season_rank"}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
        />
    );

    const btn = screen.getByRole("button", { name: "RANK" });
    expect(btn).toHaveAttribute("aria-sort", "ascending");
    });

  it("sets aria-sort='descending' when active and order=desc", () => {
    render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"season_rank"}
        order={"desc" as SortOrder}
        onSortChange={jest.fn()}
      />
    );

    const btn = screen.getByRole("button", { name: "RANK" });
    expect(btn).toHaveAttribute("aria-sort", "descending");
  });

  it("renders the sort icon with correct opacities when inactive (both arrows full opacity)", () => {
    const { container } = render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"first_name"}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
      />
    );

    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(2);

    // inactive => both opacities should be 1
    expect(paths[0]).toHaveAttribute("opacity", "1");
    expect(paths[1]).toHaveAttribute("opacity", "1");
  });

  it("renders the sort icon opacities for active+asc (down arrow dimmed)", () => {
    const { container } = render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"season_rank"}
        order={"asc" as SortOrder}
        onSortChange={jest.fn()}
      />
    );

    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(2);

    // upOpacity = 1, downOpacity = 0.35
    expect(paths[0]).toHaveAttribute("opacity", "1");
    expect(paths[1]).toHaveAttribute("opacity", "0.35");
  });

  it("renders the sort icon opacities for active+desc (up arrow dimmed)", () => {
    const { container } = render(
      <HeaderCell
        label="RANK"
        sortKey={"season_rank"}
        activeSort={"season_rank"}
        order={"desc" as SortOrder}
        onSortChange={jest.fn()}
      />
    );

    const paths = container.querySelectorAll("svg path");
    expect(paths).toHaveLength(2);

    // upOpacity = 0.35, downOpacity = 1
    expect(paths[0]).toHaveAttribute("opacity", "0.35");
    expect(paths[1]).toHaveAttribute("opacity", "1");
  });
});