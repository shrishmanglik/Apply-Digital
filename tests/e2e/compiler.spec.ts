import { expect, test } from "@playwright/test";

test("compiles a governed AX workflow", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "AX Spec Compiler" })
  ).toBeVisible();

  await page.getByRole("button", { name: /Sports media/ }).click();
  await expect(
    page.getByRole("heading", { name: "Sports media matchday ACx ops", exact: true })
  ).toBeVisible();

  await page.getByLabel("Workflow name").fill("Sports media content ops spec");
  await page
    .getByLabel("Business goal")
    .fill(
      "Convert a sports media content operations brief into approved coding-agent tasks for web, CMS, search, and analytics delivery."
    );
  await page.getByRole("button", { name: "Compile spec" }).click();

  await expect(page.getByText("Executive readout")).toBeVisible();
  await expect(page.getByText("hiring-signal proof")).toBeVisible();
  await expect(page.getByText("Estimated annual value")).toBeVisible();

  await page.getByRole("tab", { name: "Value case" }).click();
  await expect(page.getByText("Million-dollar thesis")).toBeVisible();
  await expect(page.getByText("Commercial packages")).toBeVisible();
  await expect(page.getByText("Boardroom objections")).toBeVisible();

  await page.getByRole("tab", { name: "Agent spec" }).click();
  await expect(
    page.getByText("Coding-agent-ready implementation contract")
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sports media content ops spec", exact: true })
  ).toBeVisible();

  await page.getByRole("tab", { name: "Risk + QA" }).click();
  await expect(page.getByText("Accessibility: WCAG AA contrast")).toBeVisible();
  await expect(page.getByText("Risk register")).toBeVisible();

  await page.getByRole("tab", { name: "RAG + tools" }).click();
  await expect(
    page.getByRole("cell", { name: /Human before write, publish/ })
  ).toBeVisible();
  await expect(page.getByText("Knowledge-source map")).toBeVisible();

  await page.getByRole("tab", { name: "Architecture" }).click();
  await expect(page.getByText("Production architecture blueprint")).toBeVisible();
  await expect(page.getByText("Google ADK or workflow router")).toBeVisible();

  await page.getByRole("tab", { name: "Pilot plan" }).click();
  await expect(page.getByText("30-day pilot plan")).toBeVisible();

  await page.getByRole("tab", { name: "Scale plan" }).click();
  await expect(page.getByText("Million-dollar product roadmap")).toBeVisible();

  await page.getByRole("tab", { name: "Role proof" }).click();
  await expect(page.getByText("Role-fit proof matrix")).toBeVisible();

  await page.getByRole("tab", { name: "Walkthrough" }).click();
  await expect(page.getByText("Interview walkthrough")).toBeVisible();
});

test("keeps the command center readable across desktop and mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 980 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "AX Spec Compiler" })).toBeVisible();
    await page.getByRole("tab", { name: "Value case" }).click();
    await expect(page.getByText("Million-dollar thesis")).toBeVisible();
    await page.getByRole("tab", { name: "Architecture" }).click();
    await expect(page.getByText("Production architecture blueprint")).toBeVisible();

    const bodyOverflow = await page.evaluate(() => {
      const pageWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth
      );

      return pageWidth - window.innerWidth;
    });

    expect(bodyOverflow).toBeLessThanOrEqual(2);

    const clippedButtons = await page.locator("button").evaluateAll((buttons) =>
      buttons
        .filter((button) => {
          const style = window.getComputedStyle(button);
          const text = button.textContent?.trim() ?? "";
          const visible =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            button.getBoundingClientRect().width > 0;

          return (
            text.length > 0 &&
            visible &&
            (button.scrollWidth > button.clientWidth + 2 ||
              button.scrollHeight > button.clientHeight + 2)
          );
        })
        .map((button) => button.textContent?.trim() ?? "")
    );

    expect(clippedButtons).toEqual([]);
  }
});
