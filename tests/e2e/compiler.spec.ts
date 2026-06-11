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

  await page.getByRole("tab", { name: "Client plan" }).click();
  await expect(page.getByText("Client decision memo")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Can this workflow move into a funded pilot?" })).toBeVisible();
  await expect(page.getByText("Source grounding")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Next-action queue" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stakeholder commitments" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Success dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Buyer questions" })).toBeVisible();

  await page.getByRole("tab", { name: "Agent spec" }).click();
  await expect(
    page.getByText("Coding-agent-ready implementation contract")
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Issue-ready work orders" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence ledger" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Connector contracts" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Eval telemetry" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Release gates" })).toBeVisible();

  await page.getByRole("tab", { name: "Architecture" }).click();
  await expect(page.getByText("Production architecture blueprint")).toBeVisible();
  await expect(page.getByText("Google ADK or workflow router")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Production persistence and API blueprint" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "API route contracts" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Events, webhooks, and deployment gates" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Run API simulation" }).click();
  await expect(page.getByText(/Backend compile API returned/)).toBeVisible();
  await expect(page.getByText("Compile hash")).toBeVisible();

  await page.getByRole("tab", { name: "Pilot plan" }).click();
  await expect(page.getByText("30-day pilot plan")).toBeVisible();

  await page.getByRole("tab", { name: "Scale plan" }).click();
  await expect(page.getByText("Million-dollar product roadmap")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Enterprise workspace control room" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Environment promotion model" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Audit streams" })).toBeVisible();

  await page.getByRole("tab", { name: "Role proof" }).click();
  await expect(page.getByText("Role-fit proof matrix")).toBeVisible();

  await page.getByRole("tab", { name: "Demo mode" }).click();
  await expect(page.getByText("Five-minute demo mode")).toBeVisible();
  await expect(page.getByText("Boardroom run-of-show")).toBeVisible();
});

test("exports the client packet as Markdown", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .md" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe(
    "ax-client-packet-acx-retail-campaign-command-center.md"
  );
  await expect(page.getByText(/Client packet downloaded as/)).toBeVisible();

  await page.getByRole("button", { name: "Copy packet" }).click();
  await expect(page.getByText(/Client packet copied/).first()).toBeVisible();

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toContain("# ACx retail campaign command center - Client Packet");
  expect(clipboard).toContain("## Next-action queue");
  expect(clipboard).toContain("## Client readiness board");
  expect(clipboard).toContain("## Connector contracts");

  const workOrderDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download work orders" }).click();
  const workOrderDownload = await workOrderDownloadPromise;

  expect(workOrderDownload.suggestedFilename()).toBe(
    "ax-work-orders-acx-retail-campaign-command-center.json"
  );
  await expect(page.getByText(/Work orders downloaded as/)).toBeVisible();

  const backendDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download backend blueprint" }).click();
  const backendDownload = await backendDownloadPromise;

  expect(backendDownload.suggestedFilename()).toBe(
    "ax-backend-blueprint-acx-retail-campaign-command-center.json"
  );
  await expect(page.getByText(/Backend blueprint downloaded as/)).toBeVisible();
});

test("copies and restores a share link for the current intake", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await page.getByLabel("Workflow name").fill("Shared link commerce pilot");
  await page.getByRole("button", { name: "Copy share link" }).click();
  await expect(page.getByText(/Share link copied/).first()).toBeVisible();

  const shareLink = await page.evaluate(() => navigator.clipboard.readText());
  expect(shareLink).toContain("#ax=");

  const sharedPage = await context.newPage();
  await sharedPage.goto(shareLink);

  await expect(sharedPage.getByLabel("Workflow name")).toHaveValue(
    "Shared link commerce pilot"
  );
  await expect(sharedPage.getByText("Shared intake loaded from URL hash.")).toBeVisible();
});

test("saves, compares, restores, and deletes scenario snapshots", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Saved scenarios", { exact: true }).click();
  await page.getByLabel("Scenario name").fill("Baseline retail");
  await page.getByRole("button", { name: "Save scenario" }).click();

  const savedRow = page.locator(".snapshot-meta strong", { hasText: "Baseline retail" });
  await expect(savedRow).toBeVisible();

  await page.getByLabel("Workflow name").fill("Modified retail flow");
  await expect(
    page.getByRole("heading", { name: "Modified retail flow", exact: true })
  ).toBeVisible();

  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.getByText('Current vs "Baseline retail"')).toBeVisible();
  await expect(page.getByRole("cell", { name: "Modeled annual value" })).toBeVisible();

  await page.getByRole("button", { name: "Restore" }).click();
  await expect(page.getByLabel("Workflow name")).toHaveValue(
    "ACx retail campaign command center"
  );

  await page.reload();
  await page.getByText("Saved scenarios", { exact: true }).click();
  await expect(
    page.locator(".snapshot-meta strong", { hasText: "Baseline retail" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(
    page.locator(".snapshot-meta strong", { hasText: "Baseline retail" })
  ).toHaveCount(0);
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
