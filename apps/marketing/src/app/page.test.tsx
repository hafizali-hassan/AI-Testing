import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CATEGORIES } from "@bizniss/shared";
import Home from "./page";

describe("Marketing home page", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.bizniss.pk");
  });

  it("sends sign in, sign up and search to the app subdomain", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/book trusted local services/i);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "https://app.bizniss.pk/signin");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "https://app.bizniss.pk/signup");
    expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "https://app.bizniss.pk/signup");
    expect(screen.getByRole("search")).toHaveAttribute("action", "https://app.bizniss.pk/businesses");
    expect(screen.getByLabelText("What do you need?")).toHaveAttribute("name", "q");
  });

  it("links every category into the app", () => {
    render(<Home />);
    const list = screen.getByRole("heading", { name: "Popular categories" }).nextElementSibling as HTMLElement;
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(CATEGORIES.length);
    expect(links[0]).toHaveAttribute("href", `https://app.bizniss.pk/businesses?category=${CATEGORIES[0]}`);
  });

  it("falls back to the local app in development", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    render(<Home />);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "http://localhost:3000/signin");
  });

  it("states the pay-on-arrival model and 15% commission", () => {
    render(<Home />);
    expect(screen.getByText("Pay on arrival")).toBeInTheDocument();
    expect(screen.getByText(/15% commission/)).toBeInTheDocument();
  });
});
