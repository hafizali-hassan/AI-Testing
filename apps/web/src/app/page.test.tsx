import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CATEGORIES } from "@bizniss/shared";
import AppHome from "./page";

describe("App home page", () => {
  it("has a labelled search that stays on the app", () => {
    render(<AppHome />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("What do you need today?");
    expect(screen.getByRole("search")).toHaveAttribute("action", "/businesses");
    expect(screen.getByLabelText("Search services")).toHaveAttribute("name", "q");
  });

  it("uses relative links for sign in, sign up and categories", () => {
    render(<AppHome />);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/signin");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup");
    const list = screen.getByRole("heading", { name: "Browse by category" }).nextElementSibling as HTMLElement;
    expect(within(list).getAllByRole("link")).toHaveLength(CATEGORIES.length);
  });

  it("links back to the marketing site on the root domain", () => {
    vi.stubEnv("NEXT_PUBLIC_MARKETING_URL", "https://bizniss.pk");
    render(<AppHome />);
    expect(screen.getByRole("link", { name: "About Bizniss" })).toHaveAttribute("href", "https://bizniss.pk/");
  });
});
