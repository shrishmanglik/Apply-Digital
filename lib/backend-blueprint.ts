import type {
  AgentWorkOrder,
  ConnectorContract,
  EvidenceLedgerItem,
  EvalTelemetryMetric,
  ReleaseGate,
  WorkspaceControlRoom,
  WorkflowIntake
} from "@/lib/compiler";

export type BackendEntity = {
  entity: string;
  purpose: string;
  keyFields: string;
  retention: string;
  privacy: string;
};

export type BackendApiRoute = {
  method: "GET" | "POST" | "PATCH";
  path: string;
  actor: string;
  purpose: string;
  guardrail: string;
  auditEvent: string;
};

export type BackendEvent = {
  event: string;
  producer: string;
  consumers: string;
  payload: string;
  retryPolicy: string;
};

export type WebhookContract = {
  system: string;
  trigger: string;
  payload: string;
  verification: string;
  failureHandling: string;
};

export type AuthGroup = {
  group: string;
  mapsToRole: string;
  minimumAccess: string;
  reviewCadence: string;
};

export type DeploymentGate = {
  gate: string;
  requirement: string;
  evidence: string;
  owner: string;
};

export type BackendMigrationBlueprint = {
  architecture: string;
  persistenceModel: string;
  authStrategy: string;
  eventingModel: string;
  entities: BackendEntity[];
  apiRoutes: BackendApiRoute[];
  events: BackendEvent[];
  webhooks: WebhookContract[];
  authGroups: AuthGroup[];
  deploymentGates: DeploymentGate[];
};

function connectorWebhookTrigger(system: string): string {
  if (["Contentful", "Contentstack"].includes(system)) {
    return "Entry, content model, or release webhook approved in sandbox.";
  }

  if (["BigCommerce", "commercetools"].includes(system)) {
    return "Catalog, promotion, checkout, or order-flow contract changed in sandbox.";
  }

  if (system === "Algolia") {
    return "Index schema, synonym, ranking, or query-rule change ready for eval.";
  }

  if (["Vertex AI", "Google ADK", "Vector store"].includes(system)) {
    return "Eval job, retrieval index, or orchestration run completes.";
  }

  if (system === "GCP Pub/Sub") {
    return "Workflow event, retry, approval-state change, or dead-letter event emitted.";
  }

  if (system === "CRM") {
    return "Segment metadata or consent-boundary export refreshed.";
  }

  if (system === "Data warehouse") {
    return "KPI baseline, value-model evidence, or pilot measurement dataset refreshed.";
  }

  return "Approved connector event enters the client-owned sandbox.";
}

export function backendMigrationBlueprintFor(
  input: WorkflowIntake,
  connectors: ConnectorContract[],
  telemetry: EvalTelemetryMetric[],
  releaseGates: ReleaseGate[],
  workOrders: AgentWorkOrder[],
  evidenceLedger: EvidenceLedgerItem[],
  workspace: WorkspaceControlRoom
): BackendMigrationBlueprint {
  const sensitive = input.dataSensitivity === "high";
  const hasPubSub = input.integrations.includes("GCP Pub/Sub");
  const hasVector = input.integrations.includes("Vector store");
  const hasVertex = input.integrations.includes("Vertex AI");

  return {
    architecture:
      "Next.js front end backed by a client-owned workspace API, Postgres-compatible transactional store, append-only audit/event ledger, queue-backed connector workers, object storage for approved exports, and optional Vertex AI/Google ADK orchestration behind human approval gates.",
    persistenceModel: sensitive
      ? "Store workflow metadata, source references, hashes, decisions, and eval summaries only. Sensitive source bodies remain in the client environment and are referenced through masked retrieval records."
      : "Store workflow metadata, source references, work orders, connector contracts, eval telemetry, release gates, exports, and audit events. Raw secrets and production credentials are never persisted in generated artifacts.",
    authStrategy: workspace.authModel,
    eventingModel: hasPubSub
      ? "Use GCP Pub/Sub topics for work-order, approval, connector, eval, and export events with dead-letter queues and audit replay."
      : "Start with an append-only event table and promote to Pub/Sub when connector workers or multi-workspace orchestration require asynchronous fanout.",
    entities: [
      {
        entity: "workspace",
        purpose: "Client/account tenant, access model, environment policy, and value-reporting boundary.",
        keyFields: "id, client_id, name, stage, data_sensitivity, tenant_model, auth_strategy",
        retention: "Client contract plus account retention policy.",
        privacy: "No customer PII; tenant metadata and governance posture only."
      },
      {
        entity: "workflow_intake",
        purpose: "Versioned ACx workflow inputs, assumptions, source selections, and value model.",
        keyFields: "id, workspace_id, version, intake_json, compiled_hash, created_by",
        retention: "Pilot plus 12 months, then client retention policy.",
        privacy: sensitive ? "Masked source references only." : "Business metadata and source references only."
      },
      {
        entity: "compiled_package",
        purpose: "Deterministic output snapshot for client packets, scores, gates, and exports.",
        keyFields: "id, workflow_intake_id, output_json, packet_markdown, readiness_score",
        retention: "Per release evidence policy.",
        privacy: "No secrets; redacted source excerpts only."
      },
      {
        entity: "agent_work_order",
        purpose: "Issue-ready tasks with owner, evidence, system scope, release gate, and rollback plan.",
        keyFields: "id, package_id, priority, owner, status, approval_gate, blocked_until",
        retention: "Work-order lifecycle plus audit retention.",
        privacy: "Task metadata only; linked source references use approved citations."
      },
      {
        entity: "connector_contract",
        purpose: "System permissions, blocked actions, auth scope, data boundary, and failure mode.",
        keyFields: "id, workspace_id, system, owner, mode, auth_scope, promotion_gate",
        retention: "Connector lifecycle plus 24 months.",
        privacy: "Never store tokens, secrets, or production credentials."
      },
      {
        entity: "eval_telemetry",
        purpose: "Source coverage, approval integrity, task specificity, connector safety, value, and release confidence.",
        keyFields: "id, package_id, metric, score, threshold, status, owner, evidence_ref",
        retention: "Pilot plus 24 months or client QA policy.",
        privacy: "Metric summaries and evidence references only."
      },
      {
        entity: "approval_event",
        purpose: "Human gate decisions for source, governance, connector, value, and launch approval.",
        keyFields: "id, gate, actor_id, decision, evidence_ref, decided_at",
        retention: "Client change-control policy.",
        privacy: "Approver identity, decision, and evidence reference only."
      },
      {
        entity: "audit_event",
        purpose: "Append-only replay stream for intake changes, exports, gate decisions, connector runs, and work-order transitions.",
        keyFields: "id, workspace_id, event_type, actor_id, payload_ref, created_at",
        retention: "Pilot plus 24 months or client audit policy.",
        privacy: "No raw PII, no secrets, no unredacted source bodies."
      }
    ],
    apiRoutes: [
      {
        method: "POST",
        path: "/api/workspaces",
        actor: "Apply engagement lead",
        purpose: "Create client workspace, environment policy, role map, and retention profile.",
        guardrail: "Requires sponsor and client/account metadata; no secrets accepted.",
        auditEvent: "workspace.created"
      },
      {
        method: "POST",
        path: "/api/workflows/compile",
        actor: "Product/CX owner or solution architect",
        purpose: "Compile versioned intake into deterministic package, packet, gates, and work orders.",
        guardrail: "Rejects unknown schema fields and stores compiled hash for replay.",
        auditEvent: "workflow.compiled"
      },
      {
        method: "PATCH",
        path: "/api/work-orders/:id",
        actor: "Work-order owner",
        purpose: "Update status, evidence reference, blocked-until reason, or owner note.",
        guardrail: "Cannot promote beyond release gate without approval event.",
        auditEvent: "work_order.updated"
      },
      {
        method: "POST",
        path: "/api/approvals",
        actor: "Named approver",
        purpose: "Record source, governance, connector, value, or launch gate decision.",
        guardrail: "Approver must map to role with approval rights for the requested gate.",
        auditEvent: "approval.recorded"
      },
      {
        method: "POST",
        path: "/api/connectors/:system/eval",
        actor: "Platform architect or QA owner",
        purpose: "Attach connector eval result, failure mode, retry state, and evidence reference.",
        guardrail: "Sandbox-only unless production handoff gate is clear.",
        auditEvent: "connector.eval_recorded"
      },
      {
        method: "POST",
        path: "/api/platform/self-test",
        actor: "Apply engagement lead or platform architect",
        purpose: "Run compile, connector, release-gate, artifact, and value checks as one launch-confidence report.",
        guardrail: "Read-only diagnostic; never executes external writes or bypasses owner approvals.",
        auditEvent: "platform.self_tested"
      },
      {
        method: "GET",
        path: "/api/exports/:packageId",
        actor: "Workspace member",
        purpose: "Download client packet, work-order JSON, release packet, or audit summary.",
        guardrail: "Export respects role access and redaction policy.",
        auditEvent: "export.downloaded"
      }
    ],
    events: [
      {
        event: "workflow.compiled",
        producer: "Compiler API",
        consumers: "Audit ledger, eval service, packet export, work-order queue",
        payload: "workspace_id, intake_id, package_id, compiled_hash, readiness_score",
        retryPolicy: "No retry needed; deterministic compile can be replayed from stored intake."
      },
      {
        event: "work_order.ready_for_review",
        producer: "Work-order service",
        consumers: "Approvers, QA, connector workers, notification queue",
        payload: "work_order_id, owner, priority, evidence_ref, approval_gate",
        retryPolicy: "Retry notification three times; preserve audit event and owner fallback."
      },
      {
        event: "approval.recorded",
        producer: "Approval service",
        consumers: "Release gate evaluator, audit ledger, work-order queue",
        payload: "gate, decision, approver, evidence_ref, timestamp",
        retryPolicy: "Append-only event; downstream consumers replay from audit ledger."
      },
      {
        event: "connector.eval_completed",
        producer: hasVertex || hasVector ? "Eval worker or Vertex AI job" : "QA/eval service",
        consumers: "Telemetry dashboard, release gate evaluator, audit ledger",
        payload: "connector_id, metric, score, threshold, status, evidence_ref",
        retryPolicy: "Retry failed eval once in sandbox; blocked production promotion until owner review."
      },
      {
        event: "export.generated",
        producer: "Export service",
        consumers: "Audit ledger, client packet archive, sponsor readout",
        payload: "package_id, export_type, redaction_policy, actor_id",
        retryPolicy: "Retry export generation twice; never bypass redaction policy."
      }
    ],
    webhooks: connectors.map((connector) => ({
      system: connector.system,
      trigger: connectorWebhookTrigger(connector.system),
      payload: "workspace_id, connector_id, event_type, source_ref, correlation_id, occurred_at",
      verification:
        "HMAC signature, timestamp tolerance, idempotency key, and source-system allowlist.",
      failureHandling: connector.failureMode
    })),
    authGroups: workspace.accessRoles.map((role) => ({
      group: `apply-ax-${role.role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      mapsToRole: role.role,
      minimumAccess: role.accessLevel,
      reviewCadence:
        role.accessLevel === "Admin" || role.accessLevel === "Approver"
          ? "Monthly during pilot and quarterly at scale"
          : "At pilot start, role change, and scale transition"
    })),
    deploymentGates: [
      ...releaseGates.map((gate) => ({
        gate: gate.gate,
        requirement: gate.decision,
        evidence: gate.evidence,
        owner: gate.owner
      })),
      {
        gate: "Persistence schema accepted",
        requirement: "Schema supports replay, redaction, workspace boundaries, and deterministic output snapshots.",
        evidence: `${workOrders.length} work orders and ${evidenceLedger.length} evidence ledger items map to persistent entities.`,
        owner: "Solution architect and platform architect"
      },
      {
        gate: "Eval telemetry storage accepted",
        requirement: "Every eval metric stores score, threshold, status, owner, evidence reference, and package link.",
        evidence: `${telemetry.length} eval telemetry metrics generated for this workflow.`,
        owner: "QA and analytics owners"
      },
      {
        gate: "Connector webhook contract accepted",
        requirement: "Every connector webhook has signature verification, idempotency, failure handling, and audit replay.",
        evidence: `${connectors.length} webhook contract${connectors.length === 1 ? "" : "s"} generated.`,
        owner: "Platform architect and security owner"
      }
    ]
  };
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function backendBlueprintFileName(title: string): string {
  return `ax-backend-blueprint-${slug(title) || "workflow"}.json`;
}
