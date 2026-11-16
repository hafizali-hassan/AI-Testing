import { expect, test } from "@playwright/test";

test.describe("auth flows", () => {
  test("home page leads to sign up", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What do you need today?");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  });

  test("sign up shows validation errors for invalid input", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Full name").fill("A");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Mobile number").fill("12345");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Enter your full name")).toBeVisible();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
    await expect(page.getByText(/valid Pakistani mobile number/)).toBeVisible();
    // Entered values are kept so the user can fix them.
    await expect(page.getByLabel("Email")).toHaveValue("not-an-email");
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("sign up lets the user choose an account type", async ({ page }) => {
    await page.goto("/signup");
    const technician = page.getByRole("radio", { name: "Work as technician" });
    await expect(page.getByRole("radio", { name: "Book services" })).toBeChecked();
    await technician.check();
    await expect(technician).toBeChecked();
  });

  test("sign in validates the email", async ({ page }) => {
    await page.goto("/signin");
    await page.getByLabel("Email").fill("bad");
    await page.getByRole("button", { name: /email me a sign-in code/i }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("sign in and sign up link to each other", async ({ page }) => {
    await page.goto("/signin");
    await page.getByRole("link", { name: "Create an account" }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/signin$/);
  });

  test("verify page asks for the code sent to the email", async ({ page }) => {
    await page.goto("/verify?email=ali%40example.com");
    await expect(page.getByText("ali@example.com")).toBeVisible();
    await page.getByLabel("6-digit code").fill("12ab");
    await page.getByRole("button", { name: /verify/i }).click();
    await expect(page.getByText("Enter the 6-digit code from your email")).toBeVisible();
  });

  test("verify page without an email offers to start again", async ({ page }) => {
    await page.goto("/verify");
    await expect(page.getByRole("link", { name: "Start again" })).toHaveAttribute("href", "/signin");
  });

  test("pages fit a phone screen without horizontal scrolling", async ({ page }) => {
    for (const path of ["/", "/signup", "/signin"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });
});
