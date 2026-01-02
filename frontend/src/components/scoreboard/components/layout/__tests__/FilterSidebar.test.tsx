import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { FilterSidebar } from "../FilterSidebar";

describe("FilterSidebar", () => {
  it("renders the section headings", () => {
    render(<FilterSidebar />);

    expect(screen.getByRole("heading", { name: /user segments/i })).toBeInTheDocument();
    expect(screen.getByText(/aliquam ornare/i)).toBeInTheDocument();
    expect(screen.getByText(/nam gravida dolor/i)).toBeInTheDocument();
  });

  it("renders three checkboxes with their labels", () => {
    render(<FilterSidebar />);

    // Inputs are type=checkbox, labels are wrapped in <label> so accessible name comes from <span>
    expect(screen.getByRole("checkbox", { name: /lorem ipsum dolor/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /sit amet/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /vivamus interdum/i })).toBeInTheDocument();

    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("renders range inputs (From/To) and a text input (Type Here)", () => {
    render(<FilterSidebar />);

    expect(screen.getByPlaceholderText("From")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("To")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type Here")).toBeInTheDocument();
  });

  it("renders Apply and Clear buttons", () => {
    render(<FilterSidebar />);

    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("checkboxes can be toggled (UI-only behavior)", async () => {
    const user = userEvent.setup();
    render(<FilterSidebar />);

    const cb1 = screen.getByRole("checkbox", { name: /lorem ipsum dolor/i });
    const cb2 = screen.getByRole("checkbox", { name: /sit amet/i });

    expect(cb1).not.toBeChecked();
    expect(cb2).not.toBeChecked();

    await user.click(cb1);
    expect(cb1).toBeChecked();

    await user.click(cb2);
    expect(cb2).toBeChecked();

    await user.click(cb1);
    expect(cb1).not.toBeChecked();
  });

  it("inputs accept typing (uncontrolled inputs)", async () => {
    const user = userEvent.setup();
    render(<FilterSidebar />);

    const from = screen.getByPlaceholderText("From");
    const to = screen.getByPlaceholderText("To");
    const typeHere = screen.getByPlaceholderText("Type Here");

    await user.type(from, "10");
    await user.type(to, "20");
    await user.type(typeHere, "hello");

    expect(from).toHaveValue("10");
    expect(to).toHaveValue("20");
    expect(typeHere).toHaveValue("hello");
  });

  it("clicking Apply/Clear does not crash (no handlers attached)", async () => {
    const user = userEvent.setup();
    render(<FilterSidebar />);

    await user.click(screen.getByRole("button", { name: /apply/i }));
    await user.click(screen.getByRole("button", { name: /clear/i }));

    // Still rendered after clicks
    expect(screen.getByRole("heading", { name: /user segments/i })).toBeInTheDocument();
  });
});
