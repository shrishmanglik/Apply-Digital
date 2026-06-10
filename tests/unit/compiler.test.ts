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
    expect(output.businessCase.annualValue).toBeGreaterThan(1000000);
    expect(output.businessCase.paybackWeeks).toBeLessThanOrEqual(3);
    expect(output.businessCase.valueMultiple).toBeGreaterThan(10);
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
    expect(output.commercialPackages).toHaveLength(3);
    expect(output.productRoadmap.map((item) => item.module).join(" ")).toContain(
      "Managed accelerator"
    );
    expect(output.boardroomObjections.map((item) => item.objection).join(" ")).toContain(
      "chatbot"
    );
    expect(output.clientDecisionMemo.recommendedDecision).toContain("pilot");
    expect(output.stakeholderCommitments).toHaveLength(5);
    expect(output.clientLaunchPlan).toHaveLength(5);
    expect(output.successDashboard.map((item) => item.metric).join(" ")).toContain(
      "Value realization"
    );
    expect(output.buyerQuestions.map((item) => item.question).join(" ")).toContain(
      "data and infrastructure"
    );
    expect(output.roleFitMatrix.map((row) => row.requirement).join(" ")).toContain(
      "RAG"
    );
    expect(output.nextActionQueue.length).toBeGreaterThanOrEqual(3);
    expect(output.nextActionQueue.length).toBeLessThanOrEqual(8);
    expect(output.readinessBoard).toHaveLength(6);
    expect(output.readinessBoard.map((item) => item.dimension).join(" ")).toContain(
      "Integration path"
    );
    expect(output.auditEvents.join(" ")).toContain("next actions queued");
    expect(output.auditEvents.join(" ")).toContain("readiness dimensions assessed");
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
