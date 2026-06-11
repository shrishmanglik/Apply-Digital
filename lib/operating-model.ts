import type {
  BusinessCase,
  MaturityScores,
  NextAction,
  Scores,
  WorkflowIntake
} from "@/lib/compiler";

export type ConnectorContract = {
  system: string;
  mode: string;
  owner: string;
  permittedActions: string;
  blockedActions: string;
  dataBoundary: string;
  authScope: string;
  failureMode: string;
  evidenceRequired: string;
  promotionGate: string;
};

export type EvalTelemetryMetric = {
  metric: string;
  score: number;
  threshold: number;
  status: "pass" | "watch" | "fail";
  signal: string;
  evidence: string;
  owner: string;
};

export type ReleaseGate = {
  gate: string;
  status: "clear" | "needs evidence" | "blocked";
  owner: string;
  evidence: string;
  decision: string;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function telemetryStatus(score: number, threshold: number): EvalTelemetryMetric["status"] {
  if (score >= threshold) {
    return "pass";
  }

  if (score >= Math.max(45, threshold - 18)) {
    return "watch";
  }

  return "fail";
}

function gateStatus(
  blocked: boolean,
  score: number,
  threshold = 74
): ReleaseGate["status"] {
  if (blocked || score < threshold - 22) {
    return "blocked";
  }

  if (score < threshold) {
    return "needs evidence";
  }

  return "clear";
}

function ownerForIntegration(system: string): string {
  if (["Contentful", "Contentstack", "Cloudinary"].includes(system)) {
    return "Content and platform owner";
  }

  if (["BigCommerce", "commercetools"].includes(system)) {
    return "Commerce platform owner";
  }

  if (["Algolia", "Data warehouse"].includes(system)) {
    return "Search, analytics, or data owner";
  }

  if (["Vertex AI", "Google ADK", "Vector store", "GCP Pub/Sub", "Redis cache"].includes(system)) {
    return "Cloud platform architect";
  }

  if (system === "CRM") {
    return "CRM and privacy owner";
  }

  return "Technical owner";
}

function modeFor(input: WorkflowIntake, system: string): string {
  if (input.approvalMode === "read-only") {
    return "Read-only discovery";
  }

  if (["Vertex AI", "Google ADK", "Vector store", "GCP Pub/Sub", "Redis cache"].includes(system)) {
    return "Sandboxed orchestration with audit";
  }

  if (input.approvalMode === "human-before-external") {
    return "Draft and sandbox, human before external action";
  }

  return "Draft and sandbox, human before write";
}

function permittedActionsFor(system: string): string {
  if (["Contentful", "Contentstack"].includes(system)) {
    return "Read content models, draft entry changes, validate references, and prepare approval diffs.";
  }

  if (["BigCommerce", "commercetools"].includes(system)) {
    return "Read catalog, promotion, and checkout constraints; draft implementation tasks against sandbox contracts.";
  }

  if (system === "Algolia") {
    return "Read index schema, synonyms, ranking rules, and draft search relevance experiments.";
  }

  if (system === "Cloudinary") {
    return "Read asset metadata, transformation rules, and media budget assumptions.";
  }

  if (["Vertex AI", "Google ADK"].includes(system)) {
    return "Run bounded orchestration, tool routing, and eval jobs against approved source packets.";
  }

  if (system === "Vector store") {
    return "Index approved source packets, run retrieval coverage checks, and reject uncited task claims.";
  }

  if (system === "GCP Pub/Sub") {
    return "Queue workflow events, retries, and approval-state changes without mutating client systems.";
  }

  if (system === "Redis cache") {
    return "Cache non-sensitive orchestration state and replay-safe status records.";
  }

  if (system === "CRM") {
    return "Read anonymized segments, consent flags, and campaign metadata only after privacy approval.";
  }

  if (system === "Data warehouse") {
    return "Read aggregated KPI baselines, workflow volume, and value-model evidence.";
  }

  return "Read approved documentation and draft implementation tasks against sandbox evidence.";
}

function dataBoundaryFor(input: WorkflowIntake): string {
  if (input.dataSensitivity === "high") {
    return "Masked or redacted data only; no raw customer, employee, financial, or regulated records leave the client boundary.";
  }

  if (input.dataSensitivity === "moderate") {
    return "Approved working data only; customer identifiers are minimized, logged, and excluded from generated artifacts.";
  }

  return "Low-sensitivity source packets only; no secrets, tokens, or unpublished customer data in prompts or exports.";
}

export function connectorContractsFor(input: WorkflowIntake): ConnectorContract[] {
  const systems =
    input.integrations.length > 0 ? input.integrations : ["Manual source packet"];

  return systems.map((system) => ({
    system,
    mode: modeFor(input, system),
    owner: ownerForIntegration(system),
    permittedActions: permittedActionsFor(system),
    blockedActions:
      "No autonomous publish, delete, pricing, notification, customer-data mutation, credential change, or production write.",
    dataBoundary: dataBoundaryFor(input),
    authScope:
      input.deliveryStage === "scale"
        ? "Least-privilege service account with audit replay and environment-scoped secrets."
        : "Human-owned sandbox access or read-only token; production credentials are out of scope.",
    failureMode:
      "Circuit-break to manual review, preserve audit event, and require owner sign-off before retry or promotion.",
    evidenceRequired: `${system} owner confirms scope, API contract, failure modes, and approval SLA.`,
    promotionGate:
      input.approvalMode === "read-only"
        ? "Cannot promote beyond discovery until write and external-action approval paths are documented."
        : "Promote only after source coverage, eval, QA, and owner approval gates pass."
  }));
}

export function evalTelemetryFor(
  input: WorkflowIntake,
  scores: Scores,
  maturity: MaturityScores,
  businessCase: BusinessCase,
  nextActions: NextAction[],
  connectors: ConnectorContract[]
): EvalTelemetryMetric[] {
  const sourceCoverage = clampScore(
    30 + input.sourceInputs.length * 6 + input.knowledgeSources.length * 5
  );
  const approvalIntegrity = clampScore(
    maturity.governanceConfidence +
      (input.approvalMode === "read-only" ? -12 : 4) -
      (input.dataSensitivity === "high" ? 10 : 0)
  );
  const taskSpecificity = clampScore(
    scores.feasibility +
      (input.sourceInputs.includes("API contract") ? 8 : -6) +
      (input.componentNotes.trim() ? 5 : -5)
  );
  const connectorSafety = clampScore(
    44 +
      connectors.length * 4 +
      (input.integrations.includes("Vector store") ? 10 : 0) +
      (input.integrations.includes("Vertex AI") || input.integrations.includes("Google ADK") ? 8 : 0) +
      (input.sourceInputs.includes("API contract") ? 10 : -12) -
      (input.integrations.length > 9 ? 8 : 0)
  );
  const valueInstrumentation = clampScore(
    businessCase.confidence +
      (input.successMetric.trim() ? 7 : -14) +
      (input.knowledgeSources.includes("Analytics taxonomy") ? 6 : 0)
  );
  const releaseConfidence = clampScore(
    scores.readiness * 0.36 +
      maturity.architectureReadiness * 0.24 +
      maturity.governanceConfidence * 0.24 +
      (100 - nextActions.filter((action) => action.urgency === "now").length * 12) * 0.16
  );

  const metrics = [
    {
      metric: "Source coverage",
      score: sourceCoverage,
      threshold: 76,
      signal: `${input.sourceInputs.length} source inputs and ${input.knowledgeSources.length} knowledge sources declared.`,
      evidence: "Retrieval coverage report with source owner, freshness rule, and citation trace per task.",
      owner: "Product owner and Apply solution architect"
    },
    {
      metric: "Approval-gate integrity",
      score: approvalIntegrity,
      threshold: 74,
      signal: `${input.approvalMode} approval model with ${input.dataSensitivity} data sensitivity.`,
      evidence: "Approval SLA, masked-data policy, external-action boundary, and audit replay.",
      owner: "Security, legal, and delivery owners"
    },
    {
      metric: "Task specificity",
      score: taskSpecificity,
      threshold: 72,
      signal: `${scores.feasibility}/100 feasibility with API contract ${
        input.sourceInputs.includes("API contract") ? "present" : "missing"
      }.`,
      evidence: "Task packet with files, APIs, non-goals, acceptance criteria, tests, and rollback notes.",
      owner: "Engineering lead"
    },
    {
      metric: "Connector safety",
      score: connectorSafety,
      threshold: 70,
      signal: `${connectors.length} connector contract${connectors.length === 1 ? "" : "s"} generated.`,
      evidence: "Least-privilege scopes, failure modes, blocked action list, and promotion gate per integration.",
      owner: "Platform architect"
    },
    {
      metric: "Value instrumentation",
      score: valueInstrumentation,
      threshold: 74,
      signal: `${businessCase.confidence}/100 value confidence and ${businessCase.valueMultiple}x pilot multiple.`,
      evidence: "Baseline, target, owner, measurement source, and stop/scale decision rule.",
      owner: "Executive sponsor and analytics owner"
    },
    {
      metric: "Release confidence",
      score: releaseConfidence,
      threshold: 76,
      signal: `${scores.readiness}/100 readiness with ${nextActions.filter((action) => action.urgency === "now").length} blocking now action${nextActions.filter((action) => action.urgency === "now").length === 1 ? "" : "s"}.`,
      evidence: "Passed eval telemetry, QA checklist, risk register, and launch gate approval.",
      owner: "Apply engagement lead"
    }
  ];

  return metrics.map((metric) => ({
    ...metric,
    status: telemetryStatus(metric.score, metric.threshold)
  }));
}

export function releaseGatesFor(
  input: WorkflowIntake,
  scores: Scores,
  businessCase: BusinessCase,
  nextActions: NextAction[],
  telemetry: EvalTelemetryMetric[],
  connectors: ConnectorContract[]
): ReleaseGate[] {
  const telemetryByName = new Map(telemetry.map((metric) => [metric.metric, metric]));
  const blockingActions = nextActions.filter((action) => action.urgency === "now");
  const valueIsFundable =
    businessCase.valueMultiple >= 2 &&
    businessCase.paybackWeeks <= 26 &&
    businessCase.annualValue >= businessCase.pilotInvestment;

  return [
    {
      gate: "Source packet accepted",
      status: gateStatus(
        nextActions.some((action) => action.id === "close-source-gaps" && action.urgency === "now"),
        telemetryByName.get("Source coverage")?.score ?? 0,
        telemetryByName.get("Source coverage")?.threshold ?? 76
      ),
      owner: "Product owner",
      evidence: "Signed source contract and retrieval coverage report.",
      decision: "No coding-agent task leaves draft until source coverage clears."
    },
    {
      gate: "Governance approval path accepted",
      status: gateStatus(
        input.dataSensitivity === "high" && input.approvalMode === "read-only",
        telemetryByName.get("Approval-gate integrity")?.score ?? 0,
        telemetryByName.get("Approval-gate integrity")?.threshold ?? 74
      ),
      owner: "Security and legal owners",
      evidence: "Masking policy, approval SLA, blocked action list, and audit replay.",
      decision: "No write, publish, notify, or external action until owner approval is explicit."
    },
    {
      gate: "Connector contract accepted",
      status: gateStatus(
        connectors.some((connector) => connector.system !== "Manual source packet") &&
          !input.sourceInputs.includes("API contract"),
        telemetryByName.get("Connector safety")?.score ?? 0,
        telemetryByName.get("Connector safety")?.threshold ?? 70
      ),
      owner: "Platform architect",
      evidence: `${connectors.length} connector contract${connectors.length === 1 ? "" : "s"} with owner, auth scope, failure mode, and promotion gate.`,
      decision: "Connector work stays sandboxed until API contracts and failure modes are approved."
    },
    {
      gate: "Value case accepted",
      status: gateStatus(!valueIsFundable, telemetryByName.get("Value instrumentation")?.score ?? 0, 74),
      owner: "Executive sponsor",
      evidence: "Accepted baseline, value model, pilot budget, and stop/scale metric.",
      decision: "Do not ask for pilot budget until the value case is finance-defensible."
    },
    {
      gate: "Pilot launch authorized",
      status: gateStatus(blockingActions.length > 0 || scores.readiness < 76, scores.readiness, 76),
      owner: "Apply engagement lead",
      evidence: `${blockingActions.length} blocking action${blockingActions.length === 1 ? "" : "s"} open; readiness ${scores.readiness}/100.`,
      decision: "Launch only when readiness clears threshold and all blocking now-actions are closed."
    }
  ];
}
