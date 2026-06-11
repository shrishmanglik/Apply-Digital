import { describe, expect, it } from "vitest";
import { backendBlueprintFileName, compileSpec, createDefaultIntake } from "@/lib/compiler";

describe("backend migration blueprint", () => {
  it("creates a production backend blueprint for the default workflow", () => {
    const output = compileSpec(createDefaultIntake());
    const blueprint = output.backendMigrationBlueprint;

    expect(blueprint.entities.map((entity) => entity.entity)).toContain("workspace");
    expect(blueprint.entities.map((entity) => entity.entity)).toContain("audit_event");
    expect(blueprint.apiRoutes.map((route) => route.path)).toContain("/api/workflows/compile");
    expect(blueprint.events.map((event) => event.event)).toContain("workflow.compiled");
    expect(blueprint.webhooks.length).toBe(output.connectorContracts.length);
    expect(blueprint.authGroups.length).toBe(output.workspaceControlRoom.accessRoles.length);
    expect(blueprint.deploymentGates.map((gate) => gate.gate)).toContain(
      "Persistence schema accepted"
    );
  });

  it("uses stricter persistence language for high-sensitivity workflows", () => {
    const intake = createDefaultIntake();
    intake.dataSensitivity = "high";

    const blueprint = compileSpec(intake).backendMigrationBlueprint;

    expect(blueprint.persistenceModel).toContain("Sensitive source bodies remain");
    expect(blueprint.entities.find((entity) => entity.entity === "workflow_intake")?.privacy).toContain(
      "Masked"
    );
  });

  it("creates a safe backend blueprint filename", () => {
    expect(backendBlueprintFileName("ACx retail campaign command center")).toBe(
      "ax-backend-blueprint-acx-retail-campaign-command-center.json"
    );
    expect(backendBlueprintFileName("???")).toBe("ax-backend-blueprint-workflow.json");
  });
});
