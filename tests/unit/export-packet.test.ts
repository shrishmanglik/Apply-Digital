import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake, createPresetIntake } from "@/lib/compiler";
import { buildClientPacket, packetFileName } from "@/lib/export-packet";

describe("client packet export", () => {
  it("builds a complete Markdown packet from the default intake", () => {
    const intake = createDefaultIntake();
    const output = compileSpec(intake);
    const packet = buildClientPacket(intake, output);

    expect(packet).toContain("# ACx retail campaign command center - Client Packet");

    for (const heading of [
      "## Executive brief",
      "## Readiness scorecard",
      "## Client readiness board",
      "## Value case",
      "## Client decision memo",
      "## Next-action queue",
      "## 30-day client launch plan",
      "## Architecture summary",
      "## Connector contracts",
      "## Eval telemetry and release gates",
      "## Risk register",
      "## QA and evaluation gates",
      "## Autonomy boundaries",
      "## Recorded intake assumptions"
    ]) {
      expect(packet).toContain(heading);
    }

    expect(packet).toContain("Modeled annual value");
    expect(packet).toMatch(/\$\d/);
    expect(packet).toContain(output.executiveBrief.headline);
    expect(packet).toContain(output.clientDecisionMemo.recommendedDecision);
    expect(packet).toContain("Source grounding");
    expect(packet).toContain("Integration path");
    expect(packet).toContain("Connector safety");
    expect(packet).toContain("Pilot launch authorized");

    for (const action of output.nextActionQueue) {
      expect(packet).toContain(action.owner);
      expect(packet).toContain(action.dueWindow);
    }

    expect(packet).not.toContain("undefined");
    expect(packet).not.toContain("NaN");
    expect(packet).not.toContain("[object");
  });

  it("keeps the packet table-safe and deterministic for every preset", () => {
    for (const presetId of [
      "retail-campaign",
      "sports-media",
      "cpg-content",
      "commerce-migration",
      "internal-platform"
    ]) {
      const intake = createPresetIntake(presetId);
      const output = compileSpec(intake);
      const first = buildClientPacket(intake, output);
      const second = buildClientPacket(intake, compileSpec(intake));

      expect(first).toBe(second);
      expect(first).toContain(`# ${output.title} - Client Packet`);
      expect(first).not.toContain("undefined");
    }
  });

  it("derives a safe filename from the workflow title", () => {
    expect(packetFileName("ACx retail campaign command center")).toBe(
      "ax-client-packet-acx-retail-campaign-command-center.md"
    );
    expect(packetFileName("???")).toBe("ax-client-packet-workflow.md");
    expect(packetFileName("A".repeat(200)).length).toBeLessThanOrEqual(
      "ax-client-packet-".length + 64 + ".md".length
    );
  });
});
