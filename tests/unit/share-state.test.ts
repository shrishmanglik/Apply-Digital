import { describe, expect, it } from "vitest";
import { createDefaultIntake } from "@/lib/compiler";
import { buildShareHash, buildShareUrl, parseSharedIntake } from "@/lib/share-state";

describe("share state", () => {
  it("round-trips an intake through the URL hash", () => {
    const intake = createDefaultIntake();
    intake.workflowName = "Shared CPG pilot";

    const hash = buildShareHash(intake);
    const restored = parseSharedIntake(hash);

    expect(hash).toContain("#ax=");
    expect(restored).toEqual(intake);
  });

  it("builds a share URL without changing existing path or query", () => {
    const intake = createDefaultIntake();
    const shareUrl = buildShareUrl("https://example.com/demo?view=client#old", intake);
    const url = new URL(shareUrl);

    expect(url.origin).toBe("https://example.com");
    expect(url.pathname).toBe("/demo");
    expect(url.search).toBe("?view=client");
    expect(parseSharedIntake(url.hash)).toEqual(intake);
  });

  it("ignores corrupted or incomplete share payloads", () => {
    expect(parseSharedIntake("")).toBeNull();
    expect(parseSharedIntake("#not-ax=true")).toBeNull();
    expect(parseSharedIntake("#ax=not-json")).toBeNull();
    expect(parseSharedIntake(`#ax=${encodeURIComponent(JSON.stringify({ workflowName: "x" }))}`)).toBeNull();
  });
});
