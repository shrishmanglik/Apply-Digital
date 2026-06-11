import { describe, expect, it } from "vitest";
import { buildPlatformSelfTestResponse } from "@/lib/platform-self-test";
import { createDefaultIntake } from "@/lib/compiler";
import { POST } from "@/app/api/platform/self-test/route";

describe("platform self-test API", () => {
  it("returns a deterministic launch confidence report for a valid intake", () => {
    const intake = createDefaultIntake();
    const first = buildPlatformSelfTestResponse({ intake, system: "Vertex AI" });
    const second = buildPlatformSelfTestResponse({ intake, system: "Vertex AI" });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    if (!first.body.ok || !second.body.ok) {
      throw new Error("Expected successful self-test responses");
    }

    expect(first.body.selfTestRunId).toBe(second.body.selfTestRunId);
    expect(first.body.compiledHash).toBe(second.body.compiledHash);
    expect(first.body.contractVersion).toBe("ax-platform-self-test.v1");
    expect(first.body.connectorSystem).toBe("Vertex AI");
    expect(first.body.checks.map((check) => check.check)).toEqual([
      "Workflow intake schema",
      "Compile API boundary",
      "Connector worker sandbox",
      "Release gates",
      "Artifact factory",
      "Value instrumentation"
    ]);
    expect(first.body.launchConfidence).toBeGreaterThan(0);
    expect(first.body.auditEvent.event).toBe("platform.self_tested");
  });

  it("surfaces blocked gates as a non-promotable platform result", () => {
    const intake = createDefaultIntake();
    intake.sourceInputs = [];
    intake.integrations = ["Contentful", "Algolia"];

    const result = buildPlatformSelfTestResponse({ intake });

    expect(result.status).toBe(200);

    if (!result.body.ok) {
      throw new Error("Expected successful self-test response");
    }

    expect(result.body.platformStatus).toBe("fail");
    expect(result.body.promotable).toBe(false);
    expect(result.body.releaseGateSummary.blocked).toBeGreaterThan(0);
    expect(result.body.checks.find((check) => check.check === "Release gates")?.status).toBe(
      "fail"
    );
  });

  it("rejects missing and invalid payloads", () => {
    expect(buildPlatformSelfTestResponse({}).status).toBe(400);

    const invalid = createDefaultIntake() as Record<string, unknown>;
    invalid.deliveryStage = "enterprise";

    const result = buildPlatformSelfTestResponse({ intake: invalid });

    expect(result.status).toBe(422);
    expect(result.body.ok).toBe(false);
  });

  it("serves the Next.js route handler", async () => {
    const request = new Request("http://localhost/api/platform/self-test", {
      method: "POST",
      body: JSON.stringify({ intake: createDefaultIntake(), system: "Vector store" })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.contractVersion).toBe("ax-platform-self-test.v1");
    expect(body.connectorSystem).toBe("Vector store");
    expect(body.checks).toHaveLength(6);
  });

  it("rejects malformed JSON at the route handler", async () => {
    const request = new Request("http://localhost/api/platform/self-test", {
      method: "POST",
      body: "{not-json"
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });
});
