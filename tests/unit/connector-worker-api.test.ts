import { describe, expect, it } from "vitest";
import { buildConnectorWorkerResponse } from "@/lib/connector-worker-api";
import { createDefaultIntake } from "@/lib/compiler";
import { POST } from "@/app/api/connectors/evaluate/route";

describe("connector worker API", () => {
  it("returns a deterministic sandbox worker result", () => {
    const intake = createDefaultIntake();
    const first = buildConnectorWorkerResponse({ intake, system: "Vertex AI" });
    const second = buildConnectorWorkerResponse({ intake, system: "Vertex AI" });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);

    if (!first.body.ok || !second.body.ok) {
      throw new Error("Expected successful connector worker responses");
    }

    expect(first.body.workerRunId).toBe(second.body.workerRunId);
    expect(first.body.system).toBe("Vertex AI");
    expect(first.body.contractVersion).toBe("ax-connector-worker.v1");
    expect(first.body.blockedActions).toContain("No autonomous");
    expect(first.body.verification).toContain("HMAC");
    expect(first.body.auditEvent.event).toBe("connector.worker_evaluated");
  });

  it("falls back to the first connector when the requested system is absent", () => {
    const result = buildConnectorWorkerResponse({
      intake: createDefaultIntake(),
      system: "Not a connector"
    });

    expect(result.status).toBe(200);

    if (!result.body.ok) {
      throw new Error("Expected successful connector worker response");
    }

    expect(result.body.system).toBe("Contentful");
  });

  it("rejects missing and invalid payloads", () => {
    expect(buildConnectorWorkerResponse({}).status).toBe(400);

    const invalid = createDefaultIntake() as Record<string, unknown>;
    invalid.approvalMode = "autonomous";

    const result = buildConnectorWorkerResponse({ intake: invalid });

    expect(result.status).toBe(422);
    expect(result.body.ok).toBe(false);
  });

  it("serves the Next.js route handler", async () => {
    const request = new Request("http://localhost/api/connectors/evaluate", {
      method: "POST",
      body: JSON.stringify({ intake: createDefaultIntake(), system: "Vector store" })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.system).toBe("Vector store");
    expect(body.auditEvent.correlationId).toBeTruthy();
  });

  it("rejects malformed JSON at the route handler", async () => {
    const request = new Request("http://localhost/api/connectors/evaluate", {
      method: "POST",
      body: "{not-json"
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });
});
