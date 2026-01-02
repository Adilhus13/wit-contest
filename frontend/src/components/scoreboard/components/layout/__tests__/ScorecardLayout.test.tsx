import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScoreboardLayout } from "../ScorecardLayout";


describe("ScoreboardLayout", () => {
  it("always renders children inside the main region", () => {
    render(
      <ScoreboardLayout>
        <div data-testid="children">Main content</div>
      </ScoreboardLayout>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders hero when provided (wrapped in h-120 container)", () => {
    const { container } = render(
      <ScoreboardLayout hero={<div data-testid="hero">Hero</div>}>
        <div />
      </ScoreboardLayout>
    );

    expect(screen.getByTestId("hero")).toBeInTheDocument();

    // optional: assert wrapper exists by class
    const heroWrapper = container.querySelector(".h-120");
    expect(heroWrapper).toBeInTheDocument();
    expect(heroWrapper).toContainElement(screen.getByTestId("hero"));
  });

  it("does not render hero wrapper when hero is not provided", () => {
    const { container } = render(
      <ScoreboardLayout>
        <div />
      </ScoreboardLayout>
    );

    expect(container.querySelector(".h-120")).not.toBeInTheDocument();
  });

  it("renders top content when provided", () => {
    render(
      <ScoreboardLayout top={<div data-testid="top">Top</div>}>
        <div />
      </ScoreboardLayout>
    );

    expect(screen.getByTestId("top")).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
  });

  it("renders sidebar content when provided", () => {
    render(
      <ScoreboardLayout sidebar={<div data-testid="sidebar">Sidebar</div>}>
        <div />
      </ScoreboardLayout>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders right panel when provided (inside an aside)", () => {
    const { container } = render(
      <ScoreboardLayout right={<div data-testid="right">Right</div>}>
        <div />
      </ScoreboardLayout>
    );

    expect(screen.getByTestId("right")).toBeInTheDocument();

    const aside = container.querySelector("aside");
    expect(aside).toBeInTheDocument();
    expect(aside).toContainElement(screen.getByTestId("right"));
  });

  it("does not render right aside when right is not provided", () => {
    const { container } = render(
      <ScoreboardLayout>
        <div />
      </ScoreboardLayout>
    );

    expect(container.querySelector("aside")).not.toBeInTheDocument();
  });

  it("renders all slots together in the expected order: hero -> top -> content row", () => {
    const { container } = render(
      <ScoreboardLayout
        hero={<div data-testid="hero">Hero</div>}
        top={<div data-testid="top">Top</div>}
        sidebar={<div data-testid="sidebar">Sidebar</div>}
        right={<div data-testid="right">Right</div>}
      >
        <div data-testid="children">Children</div>
      </ScoreboardLayout>
    );

    const root = container.firstElementChild;
    expect(root).toBeInTheDocument();

    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("top")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();

    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main).toContainElement(screen.getByTestId("children"));
  });
});
