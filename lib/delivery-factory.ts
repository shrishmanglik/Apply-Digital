import type {
  BacklogTask,
  ConnectorContract,
  EvalTelemetryMetric,
  NextAction,
  ReleaseGate,
  WorkflowIntake
} from "@/lib/compiler";

export type WorkOrderPriority = "P0" | "P1" | "P2";
export type EvidenceStatus = "ready" | "needed" | "blocked";

export type AgentWorkOrder = {
  id: string;
  title: string;
  priority: WorkOrderPriority;
  workstream: string;
  owner: string;
  agentMode: string;
  sourceInputs: string;
  systems: string;
  requiredEvidence: string;
  acceptanceCriteria: string;
  testPlan: string;
  approvalGate: string;
  releaseGate: string;
  rollbackPlan: string;
  blockedUntil: string;
};

export type EvidenceLedgerItem = {
  evidence: string;
  status: EvidenceStatus;
  owner: string;
  usedBy: string;
  proofTest: string;
};

export type DeliveryFactoryBundle = {
  generatedBy: string;
  workflow: string;
  summary: string;
  workOrders: AgentWorkOrder[];
  evidenceLedger: EvidenceLedgerItem[];
};

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function priorityFor(index: number, releaseGates: ReleaseGate[]): WorkOrderPriority {
  const blockedGateCount = releaseGates.filter((gate) => gate.status === "blocked").length;

  if (blockedGateCount > 0 && index < 2) {
    return "P0";
  }

  if (index < 3) {
    return "P1";
  }

  return "P2";
}

function systemsFor(task: BacklogTask, connectors: ConnectorContract[]): ConnectorContract[] {
  const text = `${task.workstream} ${task.task}`.toLowerCase();
  const matches = connectors.filter((connector) => {
    const system = connector.system.toLowerCase();

    return (
      text.includes(system) ||
      (text.includes("content") && /contentful|contentstack|cloudinary/.test(system)) ||
      (text.includes("commerce") && /bigcommerce|commercetools/.test(system)) ||
      (text.includes("search") && system.includes("algolia")) ||
      (text.includes("analytics") && /analytics|data warehouse/.test(system)) ||
      (text.includes("rag") && /vector store|vertex ai|google adk/.test(system)) ||
      (text.includes("architecture") && /vertex ai|google adk|gcp pub\/sub|redis/.test(system))
    );
  });

  return matches.length > 0 ? matches : connectors.slice(0, 2);
}

function gateFor(task: BacklogTask, releaseGates: ReleaseGate[]): ReleaseGate {
  const text = `${task.workstream} ${task.task}`.toLowerCase();

  if (text.includes("source") || text.includes("rag") || text.includes("retrieval")) {
    return releaseGates.find((gate) => gate.gate === "Source packet accepted") ?? releaseGates[0];
  }

  if (text.includes("governance") || text.includes("approval") || text.includes("risk")) {
    return (
      releaseGates.find((gate) => gate.gate === "Governance approval path accepted") ??
      releaseGates[0]
    );
  }

  if (text.includes("integration") || text.includes("api") || text.includes("architecture")) {
    return (
      releaseGates.find((gate) => gate.gate === "Connector contract accepted") ?? releaseGates[0]
    );
  }

  if (text.includes("value") || text.includes("analytics")) {
    return releaseGates.find((gate) => gate.gate === "Value case accepted") ?? releaseGates[0];
  }

  return releaseGates.find((gate) => gate.gate === "Pilot launch authorized") ?? releaseGates[0];
}

function telemetryFor(task: BacklogTask, telemetry: EvalTelemetryMetric[]): EvalTelemetryMetric {
  const text = `${task.workstream} ${task.task}`.toLowerCase();

  if (text.includes("source") || text.includes("rag") || text.includes("retrieval")) {
    return telemetry.find((metric) => metric.metric === "Source coverage") ?? telemetry[0];
  }

  if (text.includes("governance") || text.includes("approval") || text.includes("risk")) {
    return telemetry.find((metric) => metric.metric === "Approval-gate integrity") ?? telemetry[0];
  }

  if (text.includes("integration") || text.includes("api") || text.includes("architecture")) {
    return telemetry.find((metric) => metric.metric === "Connector safety") ?? telemetry[0];
  }

  if (text.includes("value") || text.includes("analytics")) {
    return telemetry.find((metric) => metric.metric === "Value instrumentation") ?? telemetry[0];
  }

  return telemetry.find((metric) => metric.metric === "Task specificity") ?? telemetry[0];
}

export function agentWorkOrdersFor(
  input: WorkflowIntake,
  backlogTasks: BacklogTask[],
  connectors: ConnectorContract[],
  telemetry: EvalTelemetryMetric[],
  releaseGates: ReleaseGate[],
  nextActions: NextAction[]
): AgentWorkOrder[] {
  return backlogTasks.map((task, index) => {
    const matchedConnectors = systemsFor(task, connectors);
    const releaseGate = gateFor(task, releaseGates);
    const telemetryMetric = telemetryFor(task, telemetry);
    const sourceInputs =
      input.sourceInputs.length > 0
        ? input.sourceInputs.slice(0, 5).join(", ")
        : "Source contract required before agent execution";
    const blockingAction = nextActions.find((action) => action.urgency === "now");

    return {
      id: `AX-${String(index + 1).padStart(2, "0")}-${slug(task.workstream) || "work"}`,
      title: task.task,
      priority: priorityFor(index, releaseGates),
      workstream: task.workstream,
      owner: task.owner,
      agentMode:
        releaseGate.status === "clear"
          ? "Agent drafts implementation package; owner approves before write."
          : "Agent prepares analysis and task draft only; execution waits for gate evidence.",
      sourceInputs,
      systems: matchedConnectors.map((connector) => connector.system).join(", "),
      requiredEvidence: `${telemetryMetric.metric}: ${telemetryMetric.evidence}`,
      acceptanceCriteria: task.acceptanceCriteria,
      testPlan: `Pass ${telemetryMetric.metric} at ${telemetryMetric.threshold}+ and attach owner-approved evidence before release.`,
      approvalGate: releaseGate.gate,
      releaseGate: `${releaseGate.status}: ${releaseGate.decision}`,
      rollbackPlan:
        "Revert generated task bundle, preserve audit event, and return to manual owner review before retry.",
      blockedUntil:
        releaseGate.status === "clear"
          ? "No blocking release gate."
          : blockingAction?.action ?? releaseGate.evidence
    };
  });
}

export function evidenceLedgerFor(
  input: WorkflowIntake,
  connectors: ConnectorContract[],
  telemetry: EvalTelemetryMetric[],
  releaseGates: ReleaseGate[],
  nextActions: NextAction[]
): EvidenceLedgerItem[] {
  const openNowActions = nextActions.filter((action) => action.urgency === "now");
  const connectorGate = releaseGates.find((gate) => gate.gate === "Connector contract accepted");

  return [
    {
      evidence: "Signed source contract",
      status: input.sourceInputs.length >= 4 && input.knowledgeSources.length >= 4 ? "ready" : "needed",
      owner: "Product owner and Apply solution architect",
      usedBy: "Source coverage, task specificity, and first work-order release.",
      proofTest: "Every work order cites an owned source input and freshness rule."
    },
    {
      evidence: "API and connector contract pack",
      status:
        connectorGate?.status === "blocked"
          ? "blocked"
          : input.sourceInputs.includes("API contract")
            ? "ready"
            : "needed",
      owner: "Platform architect",
      usedBy: `${connectors.length} connector contract${connectors.length === 1 ? "" : "s"}.`,
      proofTest: "Each connector has auth scope, blocked actions, failure mode, and promotion gate."
    },
    {
      evidence: "Approval SLA and data-handling boundary",
      status:
        input.dataSensitivity === "high" && input.approvalMode === "read-only"
          ? "blocked"
          : input.approvalMode === "read-only"
            ? "needed"
            : "ready",
      owner: "Security, legal, and delivery owners",
      usedBy: "Approval-gate integrity and release authorization.",
      proofTest: "No work order can publish, write, notify, or mutate customer data autonomously."
    },
    {
      evidence: "Eval telemetry threshold report",
      status: telemetry.every((metric) => metric.status === "pass")
        ? "ready"
        : telemetry.some((metric) => metric.status === "fail")
          ? "blocked"
          : "needed",
      owner: "QA and analytics owners",
      usedBy: "Work-order promotion and pilot launch gate.",
      proofTest: "All eval telemetry metrics meet threshold or have owner-approved exception."
    },
    {
      evidence: "Finance-accepted value model",
      status: openNowActions.some((action) => action.id === "pressure-test-value-model")
        ? "needed"
        : "ready",
      owner: "Executive sponsor and finance partner",
      usedBy: "Pilot budget ask and scale-readiness decision.",
      proofTest: "Sponsor accepts baseline, target, payback, value multiple, and stop/scale rule."
    }
  ];
}

export function deliveryFactoryBundleFor(
  workflow: string,
  summary: string,
  workOrders: AgentWorkOrder[],
  evidenceLedger: EvidenceLedgerItem[]
): DeliveryFactoryBundle {
  return {
    generatedBy: "Apply Digital AX Spec Compiler",
    workflow,
    summary,
    workOrders,
    evidenceLedger
  };
}

export function workOrderFileName(title: string): string {
  return `ax-work-orders-${slug(title) || "workflow"}.json`;
}
