import { describe, expect, it } from "vitest";
import { nextActionQueueFor } from "@/lib/action-queue";
import {
  compileSpec,
  createDefaultIntake,
  integrationOptions,
  scoreIntake
} from "@/lib/compiler";

function queueFor(intake: ReturnType<typeof createDefaultIntake>) {
  const scores = scoreIntake(intake);
  const output = compileSpec(intake);

  return nextActionQueueFor(intake, scores, output.businessCase);
}

describe("next-action queue", () => {
  it("gives a pilot-ready workflow a charter ask, source-owner work, and a kickoff date", () => {
    const queue = queueFor(createDefaultIntake());
    const ids = queue.map((action) => action.id);

    expect(ids).toContain("sign-pilot-charter");
    expect(ids).toContain("confirm-source-owners");
    expect(ids).toContain("book-kickoff-workshop");
    expect(ids).not.toContain("run-discovery-sprint");

    expect(queue[0].urgency).toBe("now");
    expect(queue[queue.length - 1].urgency).toBe("scheduled");

    for (const action of queue) {
      expect(action.owner.length).toBeGreaterThan(0);
      expect(action.action.length).toBeGreaterThan(0);
      expect(action.rationale.length).toBeGreaterThan(0);
      expect(action.evidenceRequired.length).toBeGreaterThan(0);
      expect(action.dueWindow.length).toBeGreaterThan(0);
      expect(action.successSignal.length).toBeGreaterThan(0);
    }
  });

  it("escalates governance actions for a high-risk, ungoverned intake", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.approvalMode = "read-only";
    intake.successMetric = "";
    intake.integrations = [...integrationOptions];
    intake.deadlinePressure = 95;
    intake.reworkRate = 40;
    intake.knowledgeSources = ["Product requirements"];
    intake.sourceInputs = ["User stories", "Content model"];

    const queue = queueFor(intake);
    const ids = queue.map((action) => action.id);

    expect(ids).toContain("accept-success-metric");
    expect(ids).toContain("mask-sensitive-data");
    expect(ids).toContain("define-write-path");
    expect(ids).not.toContain("sign-pilot-charter");
    expect(queue.length).toBeLessThanOrEqual(8);

    const ranks = queue.map((action) =>
      action.urgency === "now" ? 0 : action.urgency === "next" ? 1 : 2
    );
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);

    const masking = queue.find((action) => action.id === "mask-sensitive-data");
    expect(masking?.urgency).toBe("now");
    expect(masking?.owner).toContain("Security");
  });

  it("routes a thin source packet to discovery instead of a pilot ask", () => {
    const intake = createDefaultIntake();
    intake.sourceInputs = [];
    intake.knowledgeSources = [];
    intake.integrations = [];
    intake.deliveryStage = "discovery";

    const queue = queueFor(intake);
    const ids = queue.map((action) => action.id);

    expect(ids).toContain("close-source-gaps");
    expect(ids).toContain("stand-up-retrieval");
    expect(ids).toContain("map-knowledge-sources");
    expect(ids).toContain("run-discovery-sprint");
    expect(ids).not.toContain("sign-pilot-charter");
    expect(ids).not.toContain("book-kickoff-workshop");
  });

  it("flags a weak value model before any budget ask", () => {
    const intake = createDefaultIntake();
    intake.annualWorkflowVolume = 10;
    intake.currentCycleDays = 2;
    intake.targetCycleDays = 1.8;
    intake.teamCostPerDay = 500;
    intake.launchValuePerDay = 100;
    intake.pilotBudget = 500000;

    const queue = queueFor(intake);
    const ids = queue.map((action) => action.id);

    expect(ids).toContain("pressure-test-value-model");
    expect(ids).not.toContain("sign-pilot-charter");

    const valueAction = queue.find((action) => action.id === "pressure-test-value-model");
    expect(valueAction?.urgency).toBe("now");
    expect(valueAction?.rationale).toMatch(/\$\d/);
  });
});
