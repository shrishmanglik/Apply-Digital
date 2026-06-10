import { describe, expect, it } from "vitest";
import { createDefaultIntake, createPresetIntake } from "@/lib/compiler";
import {
  compareScenarios,
  parseSnapshots,
  serializeSnapshots,
  type ScenarioSnapshot
} from "@/lib/snapshots";

function snapshotFor(name: string, presetId: string): ScenarioSnapshot {
  return {
    id: `snapshot-${name}`,
    name,
    savedAt: "2026-06-10T12:00:00.000Z",
    intake: createPresetIntake(presetId)
  };
}

describe("scenario snapshots", () => {
  it("round-trips snapshots through serialization", () => {
    const original = [snapshotFor("CPG baseline", "cpg-content")];
    const restored = parseSnapshots(serializeSnapshots(original));

    expect(restored).toHaveLength(1);
    expect(restored[0].id).toBe("snapshot-CPG baseline");
    expect(restored[0].name).toBe("CPG baseline");
    expect(restored[0].intake).toEqual(original[0].intake);
  });

  it("fails gracefully on corrupted or hostile storage payloads", () => {
    expect(parseSnapshots(null)).toEqual([]);
    expect(parseSnapshots("")).toEqual([]);
    expect(parseSnapshots("not json at all")).toEqual([]);
    expect(parseSnapshots('{"object":"not an array"}')).toEqual([]);
    expect(parseSnapshots('[{"id":"x"}]')).toEqual([]);

    const valid = snapshotFor("Valid", "retail-campaign");
    const broken = {
      id: "snapshot-broken",
      name: "Broken",
      savedAt: "2026-06-10T12:00:00.000Z",
      intake: { ...valid.intake, dataSensitivity: "extreme", channels: "not-a-list" }
    };
    const parsed = parseSnapshots(JSON.stringify([valid, broken]));

    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("Valid");
  });

  it("compares saved and current scenarios with direction-aware shifts", () => {
    const saved = createDefaultIntake();
    const current = createDefaultIntake();
    current.dataSensitivity = "high";
    current.approvalMode = "read-only";

    const rows = compareScenarios(saved, current);
    const byDimension = new Map(rows.map((row) => [row.dimension, row]));

    expect(byDimension.get("Readiness")?.shift).toContain("worse");
    expect(byDimension.get("Risk")?.shift).toContain("worse");
    expect(byDimension.get("Approval model")?.shift).toBe("changed");
    expect(byDimension.get("Modeled annual value")?.shift).toBe("unchanged");
  });

  it("reports an unchanged scenario as unchanged on every dimension", () => {
    const intake = createPresetIntake("sports-media");
    const rows = compareScenarios(intake, createPresetIntake("sports-media"));

    for (const row of rows) {
      expect(row.shift).toBe("unchanged");
    }
  });
});
