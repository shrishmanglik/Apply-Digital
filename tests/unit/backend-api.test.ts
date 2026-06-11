import { describe, expect, it } from "vitest";
import { buildCompileApiResponse } from "@/lib/backend-api";
import { compileSpec, createDefaultIntake } from "@/lib/compiler";
import { POST } from "@/app/api/workflows/compile/route";

describe("compile API boundary", () => {
  it("returns a deterministic compact compile response for a valid intake", () => {
    const intake = createDefaultIntake();
    const output = compileSpec(intake);
    const first = buildCompileApiResponse({ intake });
    const second = buildCompileApiResponse({ intake });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    if (!first.body.ok || !second.body.ok) {
      throw new Error("Expected successful compile responses");
    }

    expect(first.body.compiledHash).toBe(second.body.compiledHash);
    expect(first.body.title).toBe(output.title);
    expect(first.body.readiness).toBe(output.scores.readiness);
    expect(first.body.counts.workOrders).toBe(output.agentWorkOrders.length);
    expect(first.body.counts.backendEntities).toBe(
      output.backendMigrationBlueprint.entities.length
    );
    expect(first.body.releaseGateStatuses).toHaveLength(output.releaseGates.length);
  });

  it("rejects missing and invalid intake payloads", () => {
    expect(buildCompileApiResponse({}).status).toBe(400);

    const invalid = createDefaultIntake() as Record<string, unknown>;
    invalid.dataSensitivity = "extreme";

    const result = buildCompileApiResponse({ intake: invalid });

    expect(result.status).toBe(422);
    expect(result.body.ok).toBe(false);
  });

  it("serves the Next.js route handler", async () => {
    const request = new Request("http://localhost/api/workflows/compile", {
      method: "POST",
      body: JSON.stringify({ intake: createDefaultIntake() })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.contractVersion).toBe("ax-compile-api.v1");
    expect(body.counts.apiRoutes).toBeGreaterThanOrEqual(6);
  });

  it("rejects malformed JSON at the route handler", async () => {
    const request = new Request("http://localhost/api/workflows/compile", {
      method: "POST",
      body: "{not-json"
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });
});
