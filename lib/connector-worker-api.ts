import { createHash } from "node:crypto";
import { compileSpec, type ConnectorContract, type WorkflowIntake } from "@/lib/compiler";
import { sanitizeWorkflowIntake } from "@/lib/intake-codec";

export type ConnectorWorkerSuccess = {
  ok: true;
  contractVersion: string;
  workerRunId: string;
  workflow: string;
  system: string;
  mode: string;
  owner: string;
  status: "pass" | "watch" | "fail";
  score: number;
  threshold: number;
  dataBoundary: string;
  permittedActions: string;
  blockedActions: string;
  verification: string;
  evidence: string;
  releaseGate: string;
  releaseDecision: string;
  auditEvent: {
    event: string;
    actor: string;
    correlationId: string;
    redactionPolicy: string;
  };
  nextStep: string;
};

export type ConnectorWorkerError = {
  ok: false;
  error: string;
  expected: string;
};

export type ConnectorWorkerResult = {
  status: number;
  body: ConnectorWorkerSuccess | ConnectorWorkerError;
};

const CONTRACT_VERSION = "ax-connector-worker.v1";

function workerHash(intake: WorkflowIntake, connector: ConnectorContract): string {
  return createHash("sha256")
    .update(`${CONTRACT_VERSION}:${connector.system}:${JSON.stringify(intake)}`)
    .digest("hex")
    .slice(0, 18);
}

function selectConnector(
  connectors: ConnectorContract[],
  requestedSystem: unknown
): ConnectorContract | null {
  if (connectors.length === 0) {
    return null;
  }

  if (typeof requestedSystem === "string" && requestedSystem.trim()) {
    const normalized = requestedSystem.trim().toLowerCase();
    const exact = connectors.find((connector) => connector.system.toLowerCase() === normalized);

    if (exact) {
      return exact;
    }
  }

  return connectors[0];
}

export function buildConnectorWorkerResponse(payload: unknown): ConnectorWorkerResult {
  if (typeof payload !== "object" || payload === null || !("intake" in payload)) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Missing connector worker payload.",
        expected: "POST JSON shaped as { intake: WorkflowIntake, system?: string }."
      }
    };
  }

  const candidate = payload as { intake?: unknown; system?: unknown };
  const intake = sanitizeWorkflowIntake(candidate.intake);

  if (!intake) {
    return {
      status: 422,
      body: {
        ok: false,
        error: "Workflow intake failed schema validation.",
        expected:
          "A complete WorkflowIntake with strings, string arrays, finite numbers, and known enum values."
      }
    };
  }

  const output = compileSpec(intake);
  const connector = selectConnector(output.connectorContracts, candidate.system);

  if (!connector) {
    return {
      status: 422,
      body: {
        ok: false,
        error: "No connector contract is available for this workflow.",
        expected: "At least one integration or manual source packet connector contract."
      }
    };
  }

  const telemetry =
    output.evalTelemetry.find((metric) => metric.metric === "Connector safety") ??
    output.evalTelemetry[0];
  const releaseGate =
    output.releaseGates.find((gate) => gate.gate === "Connector contract accepted") ??
    output.releaseGates[0];
  const runId = workerHash(intake, connector);
  const canPromote = telemetry.status === "pass" && releaseGate.status === "clear";

  return {
    status: 200,
    body: {
      ok: true,
      contractVersion: CONTRACT_VERSION,
      workerRunId: runId,
      workflow: output.title,
      system: connector.system,
      mode: connector.mode,
      owner: connector.owner,
      status: telemetry.status,
      score: telemetry.score,
      threshold: telemetry.threshold,
      dataBoundary: connector.dataBoundary,
      permittedActions: connector.permittedActions,
      blockedActions: connector.blockedActions,
      verification:
        "HMAC signature, timestamp tolerance, idempotency key, source-system allowlist, and audit correlation id are required before real connector execution.",
      evidence: connector.evidenceRequired,
      releaseGate: releaseGate.gate,
      releaseDecision: releaseGate.decision,
      auditEvent: {
        event: "connector.worker_evaluated",
        actor: connector.owner,
        correlationId: runId,
        redactionPolicy:
          intake.dataSensitivity === "high"
            ? "masked-only, no source bodies, no secrets"
            : "metadata-only, no secrets"
      },
      nextStep: canPromote
        ? "Connector is eligible for sandbox worker execution after owner approval."
        : "Keep connector in draft/sandbox review until telemetry and release gate clear."
    }
  };
}
