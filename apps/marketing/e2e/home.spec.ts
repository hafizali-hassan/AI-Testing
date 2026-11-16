import { expect, test } from "@playwright/test";

const APP = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

test.describe("marketing site", () => {
  test("shows the Bizniss pitch and how it works", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Book trusted local services");
    await expect(page.getByRole("heading", { name: "How Bizniss works" })).toBeVisible();
    await expect(page.getByText("Pay on arrival")).toBeVisible();
  });

  test("calls to action point to the app subdomain", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", `${APP}/signup`);
    await expect(page.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", `${APP}/signin`);
  });

  test("search submits to the app with the query", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("What do you need?").fill("dentist");
    const [request] = await Promise.all([
      page.waitForRequest((r) => r.url().startsWith(`${APP}/businesses`)),
      page.getByRole("button", { name: "Search" }).click(),
    ]);
    expect(new URL(request.url()).searchParams.get("q")).toBe("dentist");
  });

  test("fits a phone screen without horizontal scrolling", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
