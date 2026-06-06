import { expect, test } from "@playwright/test";

test("compiles a governed AX workflow", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "AX Spec Compiler" })
  ).toBeVisible();

  await page.getByLabel("Workflow name").fill("Sports media content ops spec");
  await page
    .getByLabel("Business goal")
    .fill(
      "Convert a sports media content operations brief into approved coding-agent tasks for web, CMS, search, and analytics delivery."
    );
  await page.getByRole("button", { name: "Compile spec" }).click();

  await expect(
    page.getByText("Coding-agent-ready implementation spec")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sports media content ops spec" })
  ).toBeVisible();

  await page.getByRole("tab", { name: "QA checks" }).click();
  await expect(page.getByText("Accessibility: WCAG AA contrast")).toBeVisible();

  await page.getByRole("tab", { name: "Tool plan" }).click();
  await expect(
    page.getByRole("cell", { name: /Human before write, publish/ })
  ).toBeVisible();
});
