import { createHash } from "node:crypto";
import { buildCompileApiResponse } from "@/lib/backend-api";
import { buildConnectorWorkerResponse } from "@/lib/connector-worker-api";
import { compileSpec, type WorkflowIntake } from "@/lib/compiler";
import { sanitizeWorkflowIntake } from "@/lib/intake-codec";

export type PlatformSelfTestCheck = {
  check: string;
  status: "pass" | "watch" | "fail";
  evidence: string;
  owner: string;
  nextStep: string;
};

export type PlatformSelfTestSuccess = {
  ok: true;
  contractVersion: string;
  selfTestRunId: string;
  generatedAt: string;
  workflow: string;
  launchConfidence: number;
  platformStatus: "pass" | "watch" | "fail";
  promotable: boolean;
  compiledHash: string;
  connectorWorkerRunId: string;
  connectorSystem: string;
  releaseGateSummary: {
    clear: number;
    needsEvidence: number;
    blocked: number;
  };
  checks: PlatformSelfTestCheck[];
  runtime: {
    environment: string;
    gitCommit: string;
    region: string;
  };
  auditEvent: {
    event: string;
    correlationId: string;
    redactionPolicy: string;
  };
  nextStep: string;
};

export type PlatformSelfTestError = {
  ok: false;
  error: string;
  expected: string;
};

export type PlatformSelfTestResult = {
  status: number;
  body: PlatformSelfTestSuccess | PlatformSelfTestError;
};

const CONTRACT_VERSION = "ax-platform-self-test.v1";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function selfTestHash(intake: WorkflowIntake, system: string): string {
  return createHash("sha256")
    .update(`${CONTRACT_VERSION}:${system}:${JSON.stringify(intake)}`)
    .digest("hex")
    .slice(0, 18);
}

function platformStatusFor(checks: PlatformSelfTestCheck[]): PlatformSelfTestSuccess["platformStatus"] {
  if (checks.some((check) => check.status === "fail")) {
    return "fail";
  }

  if (checks.some((check) => check.status === "watch")) {
    return "watch";
  }

  return "pass";
}

function launchConfidenceFor(
  intake: WorkflowIntake,
  checks: PlatformSelfTestCheck[],
  output: ReturnType<typeof compileSpec>
): number {
  const releaseConfidence =
    output.evalTelemetry.find((metric) => metric.metric === "Release confidence")?.score ??
    output.scores.readiness;
  const artifactCompleteness = Math.min(
    100,
    output.agentWorkOrders.length * 12 +
      output.evidenceLedger.length * 8 +
      output.backendMigrationBlueprint.apiRoutes.length * 5
  );
  const warningPenalty = checks.filter((check) => check.status === "watch").length * 8;
  const failurePenalty = checks.filter((check) => check.status === "fail").length * 24;
  const sensitivityPenalty = intake.dataSensitivity === "high" ? 4 : 0;

  return clampScore(
    output.scores.readiness * 0.34 +
      releaseConfidence * 0.28 +
      output.maturityScores.governanceConfidence * 0.18 +
      artifactCompleteness * 0.2 -
      warningPenalty -
      failurePenalty -
      sensitivityPenalty
  );
}

function statusFromScore(
  score: number,
  passThreshold: number,
  failThreshold: number
): PlatformSelfTestCheck["status"] {
  if (score >= passThreshold) {
    return "pass";
  }

  if (score < failThreshold) {
    return "fail";
  }

  return "watch";
}

export function buildPlatformSelfTestResponse(payload: unknown): PlatformSelfTestResult {
  if (typeof payload !== "object" || payload === null || !("intake" in payload)) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Missing platform self-test payload.",
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
  const selectedSystem =
    typeof candidate.system === "string" && candidate.system.trim()
      ? candidate.system.trim()
      : output.connectorContracts[0]?.system ?? "Manual source packet";
  const compileResult = buildCompileApiResponse({ intake });
  const connectorResult = buildConnectorWorkerResponse({ intake, system: selectedSystem });
  const compileBody = compileResult.body;
  const connectorBody = connectorResult.body;
  const releaseGateSummary = {
    clear: output.releaseGates.filter((gate) => gate.status === "clear").length,
    needsEvidence: output.releaseGates.filter((gate) => gate.status === "needs evidence").length,
    blocked: output.releaseGates.filter((gate) => gate.status === "blocked").length
  };
  const valueIsFundable =
    output.businessCase.valueMultiple >= 2 &&
    output.businessCase.annualValue >= output.businessCase.pilotInvestment &&
    output.businessCase.paybackWeeks <= 26;
  const artifactScore = Math.min(
    100,
    output.agentWorkOrders.length * 12 +
      output.evidenceLedger.length * 8 +
      output.backendMigrationBlueprint.apiRoutes.length * 5
  );

  const checks: PlatformSelfTestCheck[] = [
    {
      check: "Workflow intake schema",
      status: "pass",
      evidence: `${intake.channels.length} channels, ${intake.sourceInputs.length} source inputs, ${intake.knowledgeSources.length} knowledge sources, and ${intake.integrations.length} integrations validated.`,
      owner: "Product owner",
      nextStep: "Keep source, governance, and value-model fields versioned before client handoff."
    },
    {
      check: "Compile API boundary",
      status: compileResult.status === 200 && compileBody.ok ? "pass" : "fail",
      evidence: compileBody.ok
        ? `${compileBody.contractVersion} returned hash ${compileBody.compiledHash} with readiness ${compileBody.readiness}/100.`
        : compileBody.error,
      owner: "Solution architect",
      nextStep: "Replay this hash when a sponsor asks whether the package is deterministic."
    },
    {
      check: "Connector worker sandbox",
      status: connectorBody.ok
        ? connectorBody.status === "pass"
          ? "pass"
          : connectorBody.status === "watch"
            ? "watch"
            : "fail"
        : "fail",
      evidence: connectorBody.ok
        ? `${connectorBody.system} worker ${connectorBody.workerRunId} scored ${connectorBody.score}/${connectorBody.threshold} with ${connectorBody.releaseGate} gate.`
        : connectorBody.error,
      owner: "Platform architect",
      nextStep: connectorBody.ok
        ? connectorBody.nextStep
        : "Create a connector contract before attempting sandbox execution."
    },
    {
      check: "Release gates",
      status:
        releaseGateSummary.blocked > 0
          ? "fail"
          : releaseGateSummary.needsEvidence > 0
            ? "watch"
            : "pass",
      evidence: `${releaseGateSummary.clear} clear, ${releaseGateSummary.needsEvidence} need evidence, and ${releaseGateSummary.blocked} blocked.`,
      owner: "Apply engagement lead",
      nextStep:
        releaseGateSummary.blocked > 0
          ? "Close blocked gates before any pilot-budget ask."
          : "Attach owner evidence to every non-clear gate before launch."
    },
    {
      check: "Artifact factory",
      status: statusFromScore(artifactScore, 78, 52),
      evidence: `${output.agentWorkOrders.length} work orders, ${output.evidenceLedger.length} evidence items, ${output.backendMigrationBlueprint.apiRoutes.length} API contracts, and ${output.backendMigrationBlueprint.entities.length} entities generated.`,
      owner: "Delivery owner",
      nextStep: "Export work orders and backend blueprint for GitHub, Linear, Jira, or engineering handoff."
    },
    {
      check: "Value instrumentation",
      status: valueIsFundable ? "pass" : output.businessCase.valueMultiple >= 1 ? "watch" : "fail",
      evidence: `$${output.businessCase.annualValue.toLocaleString("en-US")} annual value, ${output.businessCase.valueMultiple}x pilot multiple, and ${output.businessCase.paybackWeeks}-week payback.`,
      owner: "Executive sponsor and analytics owner",
      nextStep: "Confirm baseline, value model, budget owner, and stop/scale threshold before funding."
    }
  ];
  const platformStatus = platformStatusFor(checks);
  const launchConfidence = launchConfidenceFor(intake, checks, output);
  const promotable =
    platformStatus === "pass" &&
    output.scores.readiness >= 76 &&
    releaseGateSummary.blocked === 0 &&
    valueIsFundable;
  const fallbackConnectorId = selfTestHash(intake, selectedSystem);

  return {
    status: 200,
    body: {
      ok: true,
      contractVersion: CONTRACT_VERSION,
      selfTestRunId: selfTestHash(intake, selectedSystem),
      generatedAt: new Date().toISOString(),
      workflow: output.title,
      launchConfidence,
      platformStatus,
      promotable,
      compiledHash: compileBody.ok ? compileBody.compiledHash : "unavailable",
      connectorWorkerRunId: connectorBody.ok ? connectorBody.workerRunId : fallbackConnectorId,
      connectorSystem: connectorBody.ok ? connectorBody.system : selectedSystem,
      releaseGateSummary,
      checks,
      runtime: {
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "local",
        gitCommit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
        region: process.env.VERCEL_REGION ?? "local"
      },
      auditEvent: {
        event: "platform.self_tested",
        correlationId: selfTestHash(intake, selectedSystem),
        redactionPolicy:
          intake.dataSensitivity === "high"
            ? "masked-only, no source bodies, no secrets"
            : "metadata-only, no secrets"
      },
      nextStep: promotable
        ? "Eligible for a funded pilot launch review after named owners approve the clear gate evidence."
        : "Keep in controlled pilot preparation until watch/fail checks have owner evidence."
    }
  };
}
