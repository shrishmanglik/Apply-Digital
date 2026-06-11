import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake } from "@/lib/compiler";

describe("operating model", () => {
  it("generates connector contracts with bounded permissions for every integration", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.connectorContracts.length).toBeGreaterThan(3);

    for (const contract of output.connectorContracts) {
      expect(contract.owner).toBeTruthy();
      expect(contract.permittedActions).toBeTruthy();
      expect(contract.blockedActions).toContain("No autonomous");
      expect(contract.authScope).toContain("sandbox");
      expect(contract.failureMode).toContain("manual review");
      expect(contract.promotionGate).toContain("Promote only");
    }
  });

  it("scores eval telemetry and release gates for the default pilot", () => {
    const output = compileSpec(createDefaultIntake());

    expect(output.evalTelemetry).toHaveLength(6);
    expect(output.releaseGates).toHaveLength(5);
    expect(output.evalTelemetry.map((metric) => metric.metric)).toContain("Connector safety");
    expect(output.releaseGates.map((gate) => gate.gate)).toContain(
      "Connector contract accepted"
    );
    expect(output.evalTelemetry.every((metric) => metric.score >= 0 && metric.score <= 100)).toBe(
      true
    );
  });

  it("blocks connector promotion when API contracts are missing", () => {
    const intake = createDefaultIntake();
    intake.sourceInputs = intake.sourceInputs.filter((source) => source !== "API contract");
    intake.integrations = ["Contentful", "BigCommerce", "CRM"];

    const output = compileSpec(intake);
    const connectorGate = output.releaseGates.find(
      (gate) => gate.gate === "Connector contract accepted"
    );

    expect(connectorGate?.status).toBe("blocked");
    expect(connectorGate?.decision).toContain("sandboxed");
  });

  it("fails approval integrity for high-sensitivity read-only workflows", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.approvalMode = "read-only";

    const output = compileSpec(intake);
    const approval = output.evalTelemetry.find(
      (metric) => metric.metric === "Approval-gate integrity"
    );
    const governanceGate = output.releaseGates.find(
      (gate) => gate.gate === "Governance approval path accepted"
    );

    expect(approval?.status).not.toBe("pass");
    expect(governanceGate?.status).toBe("blocked");
  });
});
