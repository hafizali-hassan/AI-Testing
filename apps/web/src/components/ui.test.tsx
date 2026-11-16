import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthCard, Field, FormAlert, PrimaryButton } from "./ui";

describe("Field", () => {
  it("links label to input", () => {
    render(<Field label="Email" name="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
  });

  it("shows the first error and marks the input invalid", () => {
    render(<Field label="Email" name="email" errors={["Bad email", "Other"]} hint="We never share it" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Bad email");
    expect(screen.queryByText("Other")).not.toBeInTheDocument();
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(<Field label="Phone" name="phone" hint="e.g. 03001234567" />);
    expect(screen.getByText("e.g. 03001234567")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).not.toHaveAttribute("aria-invalid");
  });
});

describe("FormAlert", () => {
  it("renders nothing without a message", () => {
    const { container } = render(<FormAlert />);
    expect(container).toBeEmptyDOMElement();
  });

  it("announces the message", () => {
    render(<FormAlert>Something went wrong</FormAlert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });
});

describe("PrimaryButton and AuthCard", () => {
  it("renders a titled card with a button", () => {
    render(
      <AuthCard title="Sign in" subtitle="Welcome">
        <PrimaryButton disabled>Go</PrimaryButton>
      </AuthCard>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bizniss" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
  });
});
