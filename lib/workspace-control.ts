import type {
  AgentWorkOrder,
  EvidenceLedgerItem,
  MaturityScores,
  ReleaseGate,
  Scores,
  WorkflowIntake
} from "@/lib/compiler";

export type WorkspaceAccessRole = {
  role: string;
  accessLevel: "Admin" | "Approver" | "Contributor" | "Observer";
  permissions: string;
  approvalRights: string;
  evidenceOwned: string;
};

export type WorkspaceEnvironment = {
  environment: string;
  purpose: string;
  dataPolicy: string;
  allowedActions: string;
  promotionRule: string;
  rollback: string;
};

export type CollaborationCadence = {
  ritual: string;
  cadence: string;
  participants: string;
  decision: string;
  artifact: string;
};

export type AuditStream = {
  stream: string;
  retention: string;
  piiHandling: string;
  owner: string;
  reviewTrigger: string;
};

export type WorkspaceControlRoom = {
  readinessScore: number;
  tenantModel: string;
  authModel: string;
  dataResidency: string;
  collaborationMode: string;
  escalationPath: string;
  accessRoles: WorkspaceAccessRole[];
  environments: WorkspaceEnvironment[];
  cadences: CollaborationCadence[];
  auditStreams: AuditStream[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function evidenceStatusScore(evidenceLedger: EvidenceLedgerItem[]): number {
  if (evidenceLedger.length === 0) {
    return 0;
  }

  const total = evidenceLedger.reduce((sum, item) => {
    if (item.status === "ready") {
      return sum + 100;
    }

    if (item.status === "needed") {
      return sum + 58;
    }

    return sum + 22;
  }, 0);

  return Math.round(total / evidenceLedger.length);
}

export function workspaceControlRoomFor(
  input: WorkflowIntake,
  scores: Scores,
  maturity: MaturityScores,
  releaseGates: ReleaseGate[],
  evidenceLedger: EvidenceLedgerItem[],
  workOrders: AgentWorkOrder[]
): WorkspaceControlRoom {
  const clearGateCount = releaseGates.filter((gate) => gate.status === "clear").length;
  const blockedGateCount = releaseGates.filter((gate) => gate.status === "blocked").length;
  const gateScore = releaseGates.length
    ? Math.round((clearGateCount / releaseGates.length) * 100)
    : 0;
  const workspaceReadiness = clampScore(
    scores.readiness * 0.28 +
      maturity.governanceConfidence * 0.24 +
      maturity.architectureReadiness * 0.2 +
      gateScore * 0.16 +
      evidenceStatusScore(evidenceLedger) * 0.12 -
      blockedGateCount * 5
  );

  const tenantModel =
    input.dataSensitivity === "high" || input.deliveryStage === "scale"
      ? "Client-owned workspace tenant with Apply-managed delivery access, SSO groups, environment separation, and full audit replay."
      : "Apply-led pilot workspace with client-owned source packets, scoped collaborator roles, and exportable handoff artifacts.";
  const authModel =
    input.deliveryStage === "scale"
      ? "SAML/OIDC SSO, SCIM group mapping, just-in-time access, quarterly access review, and break-glass owner approval."
      : "Named stakeholder access, role-based approval rights, local evidence exports, and documented production-auth path before scale.";
  const dataResidency =
    input.dataSensitivity === "high"
      ? "Sensitive data stays inside the client boundary; generated artifacts use masked fields, redacted source excerpts, and no secrets."
      : "Workspace stores source references, task metadata, eval summaries, and audit events; raw customer data remains out of scope.";
  const collaborationMode =
    input.deliveryStage === "discovery"
      ? "Discovery room: source owners, Apply architect, and sponsor align on scope before execution."
      : input.deliveryStage === "pilot"
        ? "Pilot control room: work orders move through evidence, approval, eval, and release gates."
        : "Scale operating room: portfolio workflow governance, connector contracts, telemetry, and account-level value reporting.";

  return {
    readinessScore: workspaceReadiness,
    tenantModel,
    authModel,
    dataResidency,
    collaborationMode,
    escalationPath:
      blockedGateCount > 0
        ? "Escalate blocked gates to sponsor, security/legal, and Apply engagement lead before any pilot budget or production date is committed."
        : "Escalate missed approval SLAs to the named gate owner, then sponsor, with audit event and revised decision date.",
    accessRoles: [
      {
        role: "Executive sponsor",
        accessLevel: "Approver",
        permissions: "View value case, readiness, release gates, decision log, and scale reporting.",
        approvalRights: "Pilot budget, stop/scale rule, and launch authorization.",
        evidenceOwned: "Finance-accepted value model and sponsor decision memo."
      },
      {
        role: "Apply engagement lead",
        accessLevel: "Admin",
        permissions: "Manage workspace cadence, work-order queue, decision calendar, and client readouts.",
        approvalRights: "Pilot start date, scope changes, and delivery escalation.",
        evidenceOwned: "30-day plan, launch gate status, and stakeholder commitment map."
      },
      {
        role: "Solution architect",
        accessLevel: "Contributor",
        permissions: "Draft source contract, connector contracts, architecture plan, and work-order boundaries.",
        approvalRights: "Technical readiness recommendation before task promotion.",
        evidenceOwned: "Architecture blueprint, API contract pack, and connector failure modes."
      },
      {
        role: "Security/legal owner",
        accessLevel: "Approver",
        permissions: "Review data boundaries, approval model, blocked actions, and audit streams.",
        approvalRights: "Sensitive-data handling, external-action gate, and connector promotion.",
        evidenceOwned: "Approval SLA, masking policy, risk register, and audit-retention policy."
      },
      {
        role: "Product/CX owner",
        accessLevel: "Contributor",
        permissions: "Own workflow scope, source freshness, success metric, and acceptance criteria.",
        approvalRights: "Source packet acceptance and workflow-slice scope.",
        evidenceOwned: "Signed source contract, business goal, and first-batch acceptance criteria."
      },
      {
        role: "QA/analytics owner",
        accessLevel: "Contributor",
        permissions: "Run eval telemetry, value instrumentation, accessibility, performance, and release checks.",
        approvalRights: "Eval exception recommendation and KPI evidence readiness.",
        evidenceOwned: "Eval threshold report, KPI baseline, and launch evidence pack."
      }
    ],
    environments: [
      {
        environment: "Discovery room",
        purpose: "Align source owners, workflow slice, value case, and governance posture.",
        dataPolicy: "No production credentials; source references and masked examples only.",
        allowedActions: "Read source packets, draft plans, compare scenarios, export client packet.",
        promotionRule: "Move to pilot sandbox when source packet, value case, and approval path are accepted.",
        rollback: "Reset to saved scenario snapshot and preserve rejected assumptions in the audit trail."
      },
      {
        environment: "Pilot sandbox",
        purpose: "Execute bounded work orders against sandbox contracts and eval thresholds.",
        dataPolicy:
          input.dataSensitivity === "high"
            ? "Masked data, redacted artifacts, and least-privilege sandbox access only."
            : "Approved pilot data with source-owner citation and no secrets in exported artifacts.",
        allowedActions: "Draft work orders, run eval telemetry, validate connector contracts, prepare release packet.",
        promotionRule: `${workOrders.length} work orders may promote only after release gates clear or owner exception is recorded.`,
        rollback: "Demote failed work order to draft, preserve evidence, and require owner re-approval."
      },
      {
        environment: "Client staging",
        purpose: "Validate implementation tasks, QA evidence, connector scopes, and stakeholder sign-off.",
        dataPolicy: "Client-owned staging data and audited access; no autonomous external actions.",
        allowedActions: "Run QA, staging review, source-coverage checks, and release-readiness readout.",
        promotionRule: "Move to production handoff when launch gate, QA, security, and sponsor approvals are complete.",
        rollback: "Return to pilot sandbox with failed gate, owner, evidence, and revised due date."
      },
      {
        environment: "Production handoff",
        purpose: "Package launch decision, audit trail, rollback path, and scale-reporting baseline.",
        dataPolicy: "Production writes stay human-approved and client-owned; generated artifacts remain traceable.",
        allowedActions: "Export release packet, decision log, work-order bundle, and value dashboard baseline.",
        promotionRule: "Scale only after pilot KPI evidence and connector telemetry meet sponsor threshold.",
        rollback: "Use client release process; preserve compiler packet as decision evidence, not a deployment authority."
      }
    ],
    cadences: [
      {
        ritual: "Sponsor checkpoint",
        cadence: input.deadlinePressure >= 80 ? "Twice weekly" : "Weekly",
        participants: "Sponsor, Apply engagement lead, product/CX owner, analytics owner",
        decision: "Budget, scope, stop/scale rule, and value evidence.",
        artifact: "Decision memo and value instrumentation readout."
      },
      {
        ritual: "Source and evidence triage",
        cadence: "Twice weekly during pilot",
        participants: "Product/CX owner, solution architect, QA/analytics owner",
        decision: "Source gaps, freshness rules, and evidence ledger status.",
        artifact: "Source contract and evidence ledger."
      },
      {
        ritual: "Gate review",
        cadence: "Per work-order batch",
        participants: "Security/legal, engineering lead, Apply architect, delivery owner",
        decision: "Connector promotion, approval exceptions, and release gate status.",
        artifact: "Release gates, connector contracts, and eval telemetry."
      },
      {
        ritual: "Launch readout",
        cadence: "End of pilot or launch week",
        participants: "Sponsor, Apply lead, QA/analytics, platform owner, product/CX owner",
        decision: "Ship, hold, rollback, or scale.",
        artifact: "Release packet, work-order bundle, KPI baseline, and audit summary."
      }
    ],
    auditStreams: [
      {
        stream: "Intake and assumptions",
        retention: "Pilot plus 12 months, then client retention policy.",
        piiHandling: "No raw PII; masked workflow facts and source references only.",
        owner: "Apply engagement lead",
        reviewTrigger: "Scenario restore, share-link load, or assumption change before sponsor readout."
      },
      {
        stream: "Source retrieval and citations",
        retention: "Per client source policy; minimum pilot duration plus one release cycle.",
        piiHandling: "Store citation metadata and source owner, not sensitive source body.",
        owner: "Product/CX owner",
        reviewTrigger: "Task lacks owner-approved citation or source freshness expires."
      },
      {
        stream: "Connector and tool events",
        retention: "Per security policy; production connector events require client-owned audit storage.",
        piiHandling: "Token, credential, and secret values are never stored in generated artifacts.",
        owner: "Platform architect",
        reviewTrigger: "Connector failure mode, blocked action attempt, or promotion request."
      },
      {
        stream: "Approvals and release gates",
        retention: "Pilot plus 24 months or client change-control policy.",
        piiHandling: "Store approver, decision, timestamp, gate, and evidence reference only.",
        owner: "Security/legal owner",
        reviewTrigger: "Gate moves to blocked, exception requested, or launch authorization changes."
      }
    ]
  };
}
