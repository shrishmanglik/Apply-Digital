import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake, workOrderFileName } from "@/lib/compiler";

describe("agentic delivery factory", () => {
  it("generates issue-ready work orders from the bounded task batch", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.agentWorkOrders).toHaveLength(output.backlogTasks.length);
    expect(output.deliveryFactoryBundle.workOrders).toEqual(output.agentWorkOrders);
    expect(output.deliveryFactoryBundle.evidenceLedger).toEqual(output.evidenceLedger);

    for (const order of output.agentWorkOrders) {
      expect(order.id).toMatch(/^AX-\d{2}-/);
      expect(["P0", "P1", "P2"]).toContain(order.priority);
      expect(order.title).toBeTruthy();
      expect(order.systems).toBeTruthy();
      expect(order.requiredEvidence).toContain(":");
      expect(order.approvalGate).toBeTruthy();
      expect(order.rollbackPlan).toContain("manual owner review");
    }
  });

  it("blocks work orders behind governance evidence for risky intakes", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.approvalMode = "read-only";
    intake.sourceInputs = ["User stories"];
    intake.knowledgeSources = ["Product requirements"];

    const output = compileSpec(intake);

    expect(output.agentWorkOrders.some((order) => order.priority === "P0")).toBe(true);
    expect(output.agentWorkOrders.some((order) => order.blockedUntil !== "No blocking release gate.")).toBe(
      true
    );
    expect(output.evidenceLedger.map((item) => item.status)).toContain("blocked");
  });

  it("creates a safe work-order export filename", () => {
    expect(workOrderFileName("ACx retail campaign command center")).toBe(
      "ax-work-orders-acx-retail-campaign-command-center.json"
    );
    expect(workOrderFileName("???")).toBe("ax-work-orders-workflow.json");
  });
});
