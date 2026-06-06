import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake, scoreIntake } from "@/lib/compiler";

describe("AX Spec Compiler", () => {
  it("scores the default Apply Digital workflow as delivery-ready", () => {
    const scores = scoreIntake(createDefaultIntake());

    expect(scores.businessValue).toBeGreaterThanOrEqual(70);
    expect(scores.feasibility).toBeGreaterThanOrEqual(65);
    expect(scores.readiness).toBeGreaterThanOrEqual(55);
  });

  it("raises risk and sensitivity for high-sensitivity workflows", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.integrations = [
      "Contentful",
      "Algolia",
      "Cloudinary",
      "Vertex AI",
      "CRM",
      "Data warehouse"
    ];
    intake.deadlinePressure = 95;

    const scores = scoreIntake(intake);

    expect(scores.risk).toBeGreaterThanOrEqual(70);
    expect(scores.dataSensitivity).toBe(88);
  });

  it("emits human approval boundaries and QA checks", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.autonomyBoundaries.join(" ")).toContain("Human approval");
    expect(output.qaChecks).toHaveLength(6);
    expect(output.toolPlan.some((item) => item.action === "Draft implementation spec")).toBe(
      true
    );
  });
});
