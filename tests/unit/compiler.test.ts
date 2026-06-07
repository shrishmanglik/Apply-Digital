import { describe, expect, it } from "vitest";
import {
  compileSpec,
  createDefaultIntake,
  createPresetIntake,
  scenarioPresets,
  scoreIntake
} from "@/lib/compiler";

describe("AX Spec Compiler", () => {
  it("scores the default Apply Digital workflow as a strong pilot candidate", () => {
    const intake = createDefaultIntake();
    const scores = scoreIntake(intake);
    const output = compileSpec(intake);

    expect(scores.businessValue).toBeGreaterThanOrEqual(80);
    expect(scores.feasibility).toBeGreaterThanOrEqual(75);
    expect(scores.readiness).toBeGreaterThanOrEqual(76);
    expect(output.maturityScores.hiringSignal).toBeGreaterThanOrEqual(90);
  });

  it("raises risk and sensitivity for high-sensitivity workflows", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.approvalMode = "read-only";
    intake.integrations = [
      "Contentful",
      "Contentstack",
      "BigCommerce",
      "commercetools",
      "Algolia",
      "Cloudinary",
      "Vertex AI",
      "Google ADK",
      "Vector store",
      "GCP Pub/Sub",
      "Redis cache",
      "CRM",
      "Data warehouse"
    ];
    intake.deadlinePressure = 95;

    const scores = scoreIntake(intake);

    expect(scores.risk).toBeGreaterThanOrEqual(60);
    expect(scores.dataSensitivity).toBe(88);
  });

  it("emits human approval boundaries, role proof, and QA checks", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.autonomyBoundaries.join(" ")).toContain("Human approval");
    expect(output.qaChecks).toHaveLength(7);
    expect(output.toolPlan.some((item) => item.action === "Run retrieval and eval checks")).toBe(true);
    expect(output.pilotPlan).toHaveLength(5);
    expect(output.roleFitMatrix.map((row) => row.requirement).join(" ")).toContain(
      "RAG"
    );
  });

  it("provides role-specific scenario presets", () => {
    expect(scenarioPresets.map((preset) => preset.id)).toEqual([
      "retail-campaign",
      "sports-media",
      "cpg-content",
      "commerce-migration",
      "internal-platform"
    ]);

    const sportsOutput = compileSpec(createPresetIntake("sports-media"));

    expect(sportsOutput.title).toContain("Sports media");
    expect(sportsOutput.backlogTasks).toHaveLength(6);
    expect(sportsOutput.architectureBlueprint.map((row) => row.designChoice).join(" ")).toContain(
      "Google ADK"
    );
    expect(sportsOutput.interviewNarrative.join(" ").toLowerCase()).toContain(
      "whiteboard"
    );
  });
});
