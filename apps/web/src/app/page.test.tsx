import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@bizniss/shared";
import Home from "./page";

describe("Home page", () => {
  it("has a labelled search and links to sign in / sign up", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/book trusted local services/i);
    expect(screen.getByRole("search")).toHaveAttribute("action", "/businesses");
    expect(screen.getByLabelText("What do you need?")).toHaveAttribute("name", "q");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/signin");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup");
  });

  it("lists every category", () => {
    render(<Home />);
    const list = screen.getByRole("heading", { name: "Popular categories" }).nextElementSibling as HTMLElement;
    expect(within(list).getAllByRole("link")).toHaveLength(CATEGORIES.length);
  });

  it("states the pay-on-arrival model and 15% commission", () => {
    render(<Home />);
    expect(screen.getByText("Pay on arrival")).toBeInTheDocument();
    expect(screen.getByText(/15% commission/)).toBeInTheDocument();
  });
});
