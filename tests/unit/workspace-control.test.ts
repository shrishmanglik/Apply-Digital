import { describe, expect, it } from "vitest";
import { compileSpec, createDefaultIntake } from "@/lib/compiler";

describe("workspace control room", () => {
  it("creates an enterprise workspace model for a pilot-ready workflow", () => {
    const output = compileSpec(createDefaultIntake());
    const workspace = output.workspaceControlRoom;

    expect(workspace.readinessScore).toBeGreaterThanOrEqual(70);
    expect(workspace.accessRoles).toHaveLength(6);
    expect(workspace.environments.map((item) => item.environment)).toEqual([
      "Discovery room",
      "Pilot sandbox",
      "Client staging",
      "Production handoff"
    ]);
    expect(workspace.cadences.map((item) => item.ritual)).toContain("Gate review");
    expect(workspace.auditStreams.map((item) => item.stream)).toContain(
      "Approvals and release gates"
    );
    expect(workspace.authModel).toContain("Named stakeholder access");
  });

  it("switches to stricter tenant and data controls for high-sensitivity scale workflows", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";
    intake.deliveryStage = "scale";

    const workspace = compileSpec(intake).workspaceControlRoom;

    expect(workspace.tenantModel).toContain("Client-owned workspace tenant");
    expect(workspace.authModel).toContain("SAML/OIDC");
    expect(workspace.dataResidency).toContain("client boundary");
    expect(workspace.escalationPath).toContain("sponsor");
  });
});
