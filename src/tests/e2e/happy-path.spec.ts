import { test, expect } from "@playwright/test";

/**
 * Happy-path E2E: sign up → create board → add metric → see it render
 *
 * Requires a running dev server at PLAYWRIGHT_BASE_URL (default: http://localhost:3000)
 * and a seeded or empty database.
 */

const unique = Date.now();
const TEST_EMAIL = `e2e-${unique}@pulseboard.test`;
const TEST_PASSWORD = "TestPass123!";
const TEST_NAME = "E2E Tester";
const BOARD_NAME = `E2E Board ${unique}`;
const METRIC_NAME = "Test Metric";
const METRIC_VALUE = "42";

test.describe("Happy path", () => {
  test("sign up → create board → add metric → see it render", async ({ page }) => {
    // ── 1. Sign up ────────────────────────────────────────────────────────────
    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

    await page.getByLabel("Full name").fill(TEST_NAME);
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /create account/i }).click();

    // After sign-up + auto sign-in, should land on /boards
    await expect(page).toHaveURL(/\/boards$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /my boards/i })).toBeVisible();

    // ── 2. Create a board ─────────────────────────────────────────────────────
    await page.getByRole("button", { name: /new board/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel(/board name/i).fill(BOARD_NAME);
    await page.getByRole("button", { name: /create board/i }).click();

    // Should navigate to the new board's detail page
    await expect(page).toHaveURL(/\/boards\/[a-z0-9]+$/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: BOARD_NAME })).toBeVisible();

    // ── 3. Add a metric ───────────────────────────────────────────────────────
    await page.getByRole("button", { name: /add metric/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel(/metric name/i).fill(METRIC_NAME);
    await page.getByLabel(/value/i).fill(METRIC_VALUE);
    // Submit the form (the button inside the dialog)
    await page.getByRole("dialog").getByRole("button", { name: /add metric/i }).click();

    // ── 4. Metric appears in the dashboard ───────────────────────────────────
    // KPI tile should appear
    await expect(
      page.getByText(METRIC_NAME, { exact: false })
    ).toBeVisible({ timeout: 8_000 });

    // Metric value should appear
    await expect(page.getByText("42")).toBeVisible({ timeout: 5_000 });
  });
});
