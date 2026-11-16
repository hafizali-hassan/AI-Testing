import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const actions = vi.hoisted(() => ({
  signUp: vi.fn(async () => ({})),
  signIn: vi.fn(async () => ({})),
  verifyCode: vi.fn(async () => ({})),
}));
vi.mock("./actions", () => actions);

const { SignInForm, SignUpForm, VerifyForm } = await import("./forms");

describe("SignUpForm", () => {
  it("has labelled name, email, phone and role fields with customer selected", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText("Full name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Mobile number")).toHaveAttribute("type", "tel");
    expect(screen.getByRole("radio", { name: "Book services" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Work as technician" })).not.toBeChecked();
  });

  it("submits the entered values and shows server field errors", async () => {
    actions.signUp.mockResolvedValueOnce({
      fieldErrors: { phone: ["Enter a valid Pakistani mobile number"] },
      values: { name: "Ali", email: "ali@example.com", phone: "123", role: "business" },
    });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText("Full name"), "Ali");
    await user.type(screen.getByLabelText("Email"), "ali@example.com");
    await user.type(screen.getByLabelText("Mobile number"), "123");
    await user.click(screen.getByRole("radio", { name: "List a business" }));
    await user.click(screen.getByRole("button", { name: "Create account" }));

    const fd = (actions.signUp.mock.calls[0] as unknown[])[1] as FormData;
    expect(Object.fromEntries(fd)).toEqual({
      name: "Ali",
      email: "ali@example.com",
      phone: "123",
      role: "business",
    });
    expect(await screen.findByText("Enter a valid Pakistani mobile number")).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile number")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("SignInForm", () => {
  it("shows a general error from the server", async () => {
    actions.signIn.mockResolvedValueOnce({ error: "We couldn't send a code right now." });
    const user = userEvent.setup();
    render(<SignInForm />);
    await user.type(screen.getByLabelText("Email"), "a@b.co");
    await user.click(screen.getByRole("button", { name: /email me a sign-in code/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("couldn't send a code");
  });
});

describe("VerifyForm", () => {
  it("sends the email with the code", async () => {
    const user = userEvent.setup();
    render(<VerifyForm email="a@b.co" />);
    const code = screen.getByLabelText("6-digit code");
    expect(code).toHaveAttribute("autocomplete", "one-time-code");
    await user.type(code, "123456");
    await user.click(screen.getByRole("button", { name: /verify/i }));
    await waitFor(() => expect(actions.verifyCode).toHaveBeenCalled());
    const fd = (actions.verifyCode.mock.calls[0] as unknown[])[1] as FormData;
    expect(Object.fromEntries(fd)).toEqual({ email: "a@b.co", token: "123456" });
  });
});
