import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake } from "@/lib/compiler";

describe("client readiness board", () => {
  it("summarizes a pilot-ready default workflow across six dimensions", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.readinessBoard).toHaveLength(6);
    expect(output.readinessBoard.map((item) => item.dimension)).toEqual([
      "Business case",
      "Source grounding",
      "Governance",
      "Integration path",
      "Adoption",
      "Delivery runway"
    ]);

    expect(output.readinessBoard.every((item) => item.owner && item.evidence && item.nextMove)).toBe(
      true
    );
    expect(output.readinessBoard.filter((item) => item.status === "ready").length).toBeGreaterThanOrEqual(
      4
    );
  });

  it("blocks governance and source grounding when the intake is risky and thin", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.approvalMode = "read-only";
    intake.sourceInputs = [];
    intake.knowledgeSources = [];
    intake.integrations = [];
    intake.successMetric = "";

    const output = compileSpec(intake);
    const byDimension = new Map(output.readinessBoard.map((item) => [item.dimension, item]));

    expect(byDimension.get("Source grounding")?.status).toBe("blocked");
    expect(byDimension.get("Governance")?.status).toBe("blocked");
    expect(byDimension.get("Adoption")?.status).toBe("blocked");
    expect(output.auditEvents.join(" ")).toContain("readiness dimensions assessed");
  });
});
