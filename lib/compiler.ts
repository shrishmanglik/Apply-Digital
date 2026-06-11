import { nextActionQueueFor, type NextAction } from "@/lib/action-queue";
import {
  agentWorkOrdersFor,
  deliveryFactoryBundleFor,
  evidenceLedgerFor,
  type AgentWorkOrder,
  type DeliveryFactoryBundle,
  type EvidenceLedgerItem,
  workOrderFileName
} from "@/lib/delivery-factory";
import {
  connectorContractsFor,
  evalTelemetryFor,
  releaseGatesFor,
  type ConnectorContract,
  type EvalTelemetryMetric,
  type ReleaseGate
} from "@/lib/operating-model";
import { readinessBoardFor, type ReadinessDimension } from "@/lib/readiness-board";
import {
  workspaceControlRoomFor,
  type AuditStream,
  type CollaborationCadence,
  type WorkspaceAccessRole,
  type WorkspaceControlRoom,
  type WorkspaceEnvironment
} from "@/lib/workspace-control";

export type { NextAction } from "@/lib/action-queue";
export type {
  ConnectorContract,
  EvalTelemetryMetric,
  ReleaseGate
} from "@/lib/operating-model";
export type {
  AgentWorkOrder,
  DeliveryFactoryBundle,
  EvidenceLedgerItem
} from "@/lib/delivery-factory";
export { deliveryFactoryBundleFor, workOrderFileName } from "@/lib/delivery-factory";
export type { ReadinessDimension } from "@/lib/readiness-board";
export type {
  AuditStream,
  CollaborationCadence,
  WorkspaceAccessRole,
  WorkspaceControlRoom,
  WorkspaceEnvironment
} from "@/lib/workspace-control";

export type DataSensitivity = "low" | "moderate" | "high";
export type ApprovalMode =
  | "read-only"
  | "human-before-write"
  | "human-before-external";
export type DeliveryStage = "discovery" | "pilot" | "scale";

export type WorkflowIntake = {
  workflowName: string;
  businessGoal: string;
  audience: string;
  industry: string;
  channels: string[];
  sourceInputs: string[];
  componentNotes: string;
  brandConstraints: string;
  knowledgeSources: string[];
  integrations: string[];
  dataSensitivity: DataSensitivity;
  approvalMode: ApprovalMode;
  deliveryStage: DeliveryStage;
  deadlinePressure: number;
  successMetric: string;
  budgetGuardrail: string;
  riskNotes: string;
  annualWorkflowVolume: number;
  currentCycleDays: number;
  targetCycleDays: number;
  teamCostPerDay: number;
  reworkRate: number;
  launchValuePerDay: number;
  pilotBudget: number;
};

export type Scores = {
  businessValue: number;
  feasibility: number;
  risk: number;
  dataSensitivity: number;
  readiness: number;
};

export type MaturityScores = {
  strategicFit: number;
  architectureReadiness: number;
  governanceConfidence: number;
  deliveryVelocity: number;
  hiringSignal: number;
};

export type RagSource = {
  source: string;
  owner: string;
  freshness: string;
  retrievalUse: string;
  guardrail: string;
};

export type ToolAction = {
  action: string;
  system: string;
  autonomy: string;
  approvalGate: string;
  evidence: string;
};

export type BacklogTask = {
  workstream: string;
  owner: string;
  task: string;
  acceptanceCriteria: string;
};

export type ArchitectureLayer = {
  layer: string;
  designChoice: string;
  applySignal: string;
};

export type PilotPlanStep = {
  phase: string;
  timeline: string;
  artifact: string;
  decisionGate: string;
};

export type RoleFitRow = {
  requirement: string;
  prototypeProof: string;
  candidateProof: string;
};

export type RiskRegisterRow = {
  risk: string;
  signal: string;
  mitigation: string;
  owner: string;
};

export type ImpactMetric = {
  metric: string;
  baseline: string;
  target: string;
  rationale: string;
};

export type ExecutiveBrief = {
  headline: string;
  boardroomPitch: string;
  applySignal: string[];
  demoClose: string;
};

export type BusinessCase = {
  annualValue: number;
  cycleTimeValue: number;
  reworkValue: number;
  speedToMarketValue: number;
  pilotInvestment: number;
  paybackWeeks: number;
  valueMultiple: number;
  confidence: number;
  headline: string;
  thesis: string;
};

export type CommercialPackage = {
  packageName: string;
  buyer: string;
  priceBand: string;
  includes: string;
  expansionTrigger: string;
};

export type ProductRoadmapItem = {
  horizon: string;
  module: string;
  whyItMatters: string;
  proofNeeded: string;
};

export type BoardroomObjection = {
  objection: string;
  answer: string;
  evidence: string;
};

export type ClientDecisionMemo = {
  recommendedDecision: string;
  whyNow: string;
  sponsorAsk: string;
  firstWorkshop: string;
  dataPosition: string;
  adoptionPosition: string;
};

export type StakeholderCommitment = {
  stakeholder: string;
  decisionNeeded: string;
  requiredInput: string;
  operatingCadence: string;
};

export type ClientLaunchStep = {
  timeline: string;
  clientAction: string;
  applyAction: string;
  evidence: string;
};

export type SuccessDashboardMetric = {
  metric: string;
  target: string;
  owner: string;
  evidenceSource: string;
};

export type BuyerQuestion = {
  question: string;
  answer: string;
  proofPoint: string;
};

export type ScenarioPreset = {
  id: string;
  label: string;
  summary: string;
  intake: WorkflowIntake;
};

export type CompilerOutput = {
  title: string;
  summary: string;
  scores: Scores;
  maturityScores: MaturityScores;
  decisionMode: string;
  nextBestAction: string;
  riskPosture: string;
  executiveBrief: ExecutiveBrief;
  businessCase: BusinessCase;
  implementationSpec: string[];
  autonomyBoundaries: string[];
  ragMap: RagSource[];
  toolPlan: ToolAction[];
  backlogTasks: BacklogTask[];
  architectureBlueprint: ArchitectureLayer[];
  pilotPlan: PilotPlanStep[];
  roleFitMatrix: RoleFitRow[];
  riskRegister: RiskRegisterRow[];
  impactModel: ImpactMetric[];
  commercialPackages: CommercialPackage[];
  productRoadmap: ProductRoadmapItem[];
  boardroomObjections: BoardroomObjection[];
  clientDecisionMemo: ClientDecisionMemo;
  stakeholderCommitments: StakeholderCommitment[];
  clientLaunchPlan: ClientLaunchStep[];
  successDashboard: SuccessDashboardMetric[];
  buyerQuestions: BuyerQuestion[];
  nextActionQueue: NextAction[];
  readinessBoard: ReadinessDimension[];
  connectorContracts: ConnectorContract[];
  evalTelemetry: EvalTelemetryMetric[];
  releaseGates: ReleaseGate[];
  agentWorkOrders: AgentWorkOrder[];
  evidenceLedger: EvidenceLedgerItem[];
  deliveryFactoryBundle: DeliveryFactoryBundle;
  workspaceControlRoom: WorkspaceControlRoom;
  architectureNotes: string[];
  evaluationPlan: string[];
  qaChecks: string[];
  handoffNotes: string[];
  interviewNarrative: string[];
  auditEvents: string[];
};

export const channelOptions = [
  "Web",
  "Mobile",
  "CMS",
  "Commerce",
  "Search",
  "Email",
  "Loyalty",
  "Analytics",
  "Internal ops"
];

export const sourceInputOptions = [
  "User stories",
  "Customer journey",
  "Sitemap",
  "Content model",
  "Design system",
  "Brand strategy",
  "API contract",
  "Architecture decision record",
  "Analytics goals",
  "Security rules"
];

export const knowledgeSourceOptions = [
  "Product requirements",
  "Content guidelines",
  "Design tokens",
  "Customer support docs",
  "API documentation",
  "SEO/GEO rules",
  "Accessibility standards",
  "Release history",
  "Client playbook",
  "MACH blueprint",
  "Experiment results"
];

export const integrationOptions = [
  "Contentful",
  "Contentstack",
  "BigCommerce",
  "commercetools",
  "Algolia",
  "Cloudinary",
  "Braze",
  "Twilio Segment",
  "Vertex AI",
  "Google ADK",
  "Vector store",
  "GCP Pub/Sub",
  "Redis cache",
  "Data warehouse",
  "CRM"
];

export const defaultIntake: WorkflowIntake = {
  workflowName: "ACx retail campaign command center",
  businessGoal:
    "Turn a seasonal retail campaign brief into a governed implementation package for coding agents, with SEO/GEO, accessibility, content approval, search indexing, and analytics gates.",
  audience: "Product, UX, content, engineering, QA, analytics, and delivery leads",
  industry: "Retail, commerce, and consumer brands",
  channels: ["Web", "CMS", "Commerce", "Search", "Analytics"],
  sourceInputs: [
    "User stories",
    "Customer journey",
    "Sitemap",
    "Content model",
    "Design system",
    "Brand strategy",
    "API contract",
    "Analytics goals"
  ],
  componentNotes:
    "Campaign landing page, product teaser rail, offer module, loyalty content block, search-index metadata, and analytics events.",
  brandConstraints:
    "Respect brand voice, design token usage, performance budget, WCAG AA, promotion rules, and no unapproved customer-facing copy.",
  knowledgeSources: [
    "Product requirements",
    "Content guidelines",
    "Design tokens",
    "API documentation",
    "SEO/GEO rules",
    "Accessibility standards",
    "Release history",
    "Client playbook",
    "MACH blueprint"
  ],
  integrations: [
    "Contentful",
    "BigCommerce",
    "Algolia",
    "Cloudinary",
    "Vertex AI",
    "Vector store",
    "GCP Pub/Sub",
    "Data warehouse"
  ],
  dataSensitivity: "moderate",
  approvalMode: "human-before-external",
  deliveryStage: "pilot",
  deadlinePressure: 68,
  successMetric: "Reduce campaign-to-code cycle time while keeping every release decision auditable.",
  budgetGuardrail: "Use deterministic scoring first and reserve LLM calls for grounded synthesis, not control flow.",
  riskNotes:
    "Customer-facing copy, search metadata, offer rules, and analytics events require named owner approval before release.",
  annualWorkflowVolume: 160,
  currentCycleDays: 7,
  targetCycleDays: 1.5,
  teamCostPerDay: 4200,
  reworkRate: 22,
  launchValuePerDay: 3000,
  pilotBudget: 185000
};

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "retail-campaign",
    label: "ACx retail",
    summary: "Campaign-to-code command center for commerce CX launches.",
    intake: defaultIntake
  },
  {
    id: "sports-media",
    label: "Sports media",
    summary: "Matchday content operations with live-event governance.",
    intake: {
      workflowName: "Sports media matchday ACx ops",
      businessGoal:
        "Convert a matchday content operations brief into approved coding-agent tasks for web, CMS, search, live metadata, and analytics delivery without autonomous publishing.",
      audience: "Editorial, product, engineering, search, analytics, and delivery leads",
      industry: "Sports and media brands",
      channels: ["Web", "CMS", "Mobile", "Search", "Analytics", "Internal ops"],
      sourceInputs: [
        "User stories",
        "Customer journey",
        "Sitemap",
        "Content model",
        "Design system",
        "Brand strategy",
        "API contract",
        "Analytics goals"
      ],
      componentNotes:
        "Live event hub, editorial modules, match schedule rail, rights-aware content states, search metadata, and analytics taxonomy.",
      brandConstraints:
        "Protect editorial voice, rights-sensitive content, accessibility, performance budget, and approval before publish.",
      knowledgeSources: [
        "Product requirements",
        "Content guidelines",
        "Design tokens",
        "API documentation",
        "SEO/GEO rules",
        "Release history",
        "Experiment results"
      ],
      integrations: [
        "Contentful",
        "Algolia",
        "Cloudinary",
        "Vertex AI",
        "Vector store",
        "GCP Pub/Sub",
        "Data warehouse"
      ],
      dataSensitivity: "moderate",
      approvalMode: "human-before-external",
      deliveryStage: "pilot",
      deadlinePressure: 82,
      successMetric: "Move live-event content changes from ambiguous requests to approved task packets in one editorial cycle.",
      budgetGuardrail: "Only summarize grounded sources; never let an agent publish or alter rights-sensitive content.",
      riskNotes:
        "Schedule changes, rights-sensitive content, and live-event metadata need owner review before release.",
      annualWorkflowVolume: 220,
      currentCycleDays: 4,
      targetCycleDays: 0.75,
      teamCostPerDay: 3600,
      reworkRate: 28,
      launchValuePerDay: 2400,
      pilotBudget: 165000
    }
  },
  {
    id: "cpg-content",
    label: "CPG brands",
    summary: "Multi-brand product content governance for regulated claims.",
    intake: {
      workflowName: "CPG product content governance accelerator",
      businessGoal:
        "Translate product, legal, content, and brand inputs into governed specs for coding agents while preserving claim review, regional variants, and search quality.",
      audience: "Brand, legal, content, product, engineering, QA, and analytics owners",
      industry: "CPG, food, and multi-brand consumer portfolios",
      channels: ["Web", "CMS", "Commerce", "Search", "Email", "Analytics"],
      sourceInputs: [
        "User stories",
        "Content model",
        "Brand strategy",
        "Security rules",
        "Architecture decision record",
        "Analytics goals"
      ],
      componentNotes:
        "Product detail content blocks, claim callouts, comparison modules, structured metadata, approval states, and reusable CMS fields.",
      brandConstraints:
        "No unapproved claims, no off-brand substitutions, WCAG AA, reusable content model, and human approval before customer-facing copy.",
      knowledgeSources: [
        "Product requirements",
        "Content guidelines",
        "SEO/GEO rules",
        "Accessibility standards",
        "Release history",
        "Client playbook",
        "MACH blueprint"
      ],
      integrations: [
        "Contentstack",
        "Algolia",
        "Braze",
        "Twilio Segment",
        "Vertex AI",
        "Vector store",
        "Data warehouse",
        "CRM"
      ],
      dataSensitivity: "high",
      approvalMode: "human-before-external",
      deliveryStage: "scale",
      deadlinePressure: 58,
      successMetric: "Increase content reuse across brands while reducing legal and QA rework.",
      budgetGuardrail: "Mask sensitive content and treat claims as draft-only until legal approval is recorded.",
      riskNotes:
        "Claims, regional content variants, and lifecycle status must be reviewed before customer-facing release.",
      annualWorkflowVolume: 300,
      currentCycleDays: 9,
      targetCycleDays: 2.5,
      teamCostPerDay: 3900,
      reworkRate: 34,
      launchValuePerDay: 1800,
      pilotBudget: 240000
    }
  },
  {
    id: "commerce-migration",
    label: "Composable commerce",
    summary: "Legacy-to-composable migration plan with agentic task release controls.",
    intake: {
      workflowName: "Composable commerce migration blueprint",
      businessGoal:
        "Convert legacy commerce, CMS, search, loyalty, and analytics requirements into a phased migration blueprint for agent-assisted build teams.",
      audience: "Executive sponsor, architecture, engineering, product, commerce, data, and delivery leads",
      industry: "Composable commerce transformation",
      channels: ["Web", "Mobile", "CMS", "Commerce", "Search", "Loyalty", "Analytics"],
      sourceInputs: [
        "User stories",
        "Customer journey",
        "Sitemap",
        "Content model",
        "API contract",
        "Architecture decision record",
        "Security rules",
        "Analytics goals"
      ],
      componentNotes:
        "Checkout boundary map, product catalog, promotions, loyalty moments, search experience, CMS routing, data events, and migration rollback plan.",
      brandConstraints:
        "Protect conversion-critical journeys, phased rollout, progressive enhancement, data contracts, accessibility, and rollback safety.",
      knowledgeSources: [
        "Product requirements",
        "API documentation",
        "MACH blueprint",
        "Design tokens",
        "Release history",
        "Experiment results"
      ],
      integrations: [
        "commercetools",
        "Contentful",
        "Algolia",
        "Braze",
        "Twilio Segment",
        "Vertex AI",
        "Google ADK",
        "GCP Pub/Sub",
        "Redis cache",
        "Data warehouse"
      ],
      dataSensitivity: "high",
      approvalMode: "human-before-write",
      deliveryStage: "scale",
      deadlinePressure: 52,
      successMetric: "Release composable slices without breaking conversion, loyalty, analytics, or content operations.",
      budgetGuardrail: "Use agents to draft migration tasks and tests; keep production writes in human-approved pipelines.",
      riskNotes:
        "Checkout, loyalty, promotions, and customer data flows require extra controls before any production change.",
      annualWorkflowVolume: 96,
      currentCycleDays: 14,
      targetCycleDays: 4,
      teamCostPerDay: 6800,
      reworkRate: 24,
      launchValuePerDay: 9500,
      pilotBudget: 325000
    }
  },
  {
    id: "internal-platform",
    label: "Delivery desk",
    summary: "Internal agentic delivery desk for backlog translation and multi-team handoff.",
    intake: {
      workflowName: "Internal agentic delivery desk",
      businessGoal:
        "Turn product, UX, content, and architecture backlog inputs into governed coding-agent task sets across concurrent delivery teams.",
      audience: "Product, delivery, architecture, engineering managers, technical leads, and QA",
      industry: "Internal platform and shared services",
      channels: ["Internal ops", "Analytics", "Support"],
      sourceInputs: [
        "User stories",
        "Design system",
        "API contract",
        "Architecture decision record",
        "Security rules",
        "Analytics goals"
      ],
      componentNotes:
        "Backlog intake, task boundary editor, owner assignment, risk register, eval harness, and release handoff packet.",
      brandConstraints:
        "Deterministic first, audit every handoff, enforce owner assignment, and block ambiguous autonomous actions.",
      knowledgeSources: [
        "Product requirements",
        "Design tokens",
        "API documentation",
        "Accessibility standards",
        "Release history",
        "Client playbook"
      ],
      integrations: ["Google ADK", "GCP Pub/Sub", "Redis cache", "Data warehouse", "CRM"],
      dataSensitivity: "moderate",
      approvalMode: "human-before-write",
      deliveryStage: "pilot",
      deadlinePressure: 46,
      successMetric: "Turn ambiguous backlog items into agent-safe tasks with fewer clarification loops.",
      budgetGuardrail: "Score and route tasks before LLM drafting; cap AI use by workflow and risk tier.",
      riskNotes:
        "Concurrent team dependencies and unclear ownership should block task release until resolved.",
      annualWorkflowVolume: 520,
      currentCycleDays: 3.5,
      targetCycleDays: 0.75,
      teamCostPerDay: 2800,
      reworkRate: 18,
      launchValuePerDay: 900,
      pilotBudget: 145000
    }
  }
];

function cloneIntake(intake: WorkflowIntake): WorkflowIntake {
  return {
    ...intake,
    channels: [...intake.channels],
    sourceInputs: [...intake.sourceInputs],
    knowledgeSources: [...intake.knowledgeSources],
    integrations: [...intake.integrations]
  };
}

export function createDefaultIntake(): WorkflowIntake {
  return cloneIntake(defaultIntake);
}

export function createPresetIntake(presetId: string): WorkflowIntake {
  const preset = scenarioPresets.find((item) => item.id === presetId);
  return cloneIntake(preset?.intake ?? defaultIntake);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasValue(text: string): boolean {
  return text.trim().length > 0;
}

function termCount(text: string, terms: string[]): number {
  const normalized = text.toLowerCase();
  return terms.filter((term) => normalized.includes(term)).length;
}

function includesAny(values: string[], terms: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

export function scoreIntake(input: WorkflowIntake): Scores {
  const valueTerms = termCount(`${input.businessGoal} ${input.successMetric}`, [
    "revenue",
    "conversion",
    "customer",
    "campaign",
    "velocity",
    "seo",
    "geo",
    "accessibility",
    "approval",
    "support",
    "commerce",
    "loyalty",
    "personalized"
  ]);
  const sourceCompleteness =
    (hasValue(input.workflowName) ? 8 : 0) +
    (hasValue(input.businessGoal) ? 10 : 0) +
    (hasValue(input.componentNotes) ? 7 : 0) +
    (hasValue(input.brandConstraints) ? 7 : 0) +
    (hasValue(input.successMetric) ? 8 : 0) +
    (hasValue(input.budgetGuardrail) ? 5 : 0) +
    Math.min(input.sourceInputs.length * 3, 22) +
    Math.min(input.knowledgeSources.length * 3, 22);
  const agenticInfra =
    (includesAny(input.integrations, ["Vertex AI", "Google ADK", "Vector store"]) ? 10 : 0) +
    (includesAny(input.integrations, ["GCP Pub/Sub", "Redis cache"]) ? 7 : 0);
  const integrationLoad = Math.max(0, input.integrations.length - 7) * 3;
  const sensitivityPenalty =
    input.dataSensitivity === "high" ? 18 : input.dataSensitivity === "moderate" ? 8 : 0;
  const approvalBonus =
    input.approvalMode === "read-only"
      ? 2
      : input.approvalMode === "human-before-write"
        ? 7
        : 10;
  const stageBonus = input.deliveryStage === "scale" ? 4 : input.deliveryStage === "pilot" ? 7 : 2;

  const businessValue = clampScore(
    46 +
      valueTerms * 4 +
      Math.min(input.channels.length * 3, 21) +
      Math.round(input.deadlinePressure / 8) +
      stageBonus
  );
  const feasibility = clampScore(
    34 +
      sourceCompleteness +
      agenticInfra -
      integrationLoad -
      sensitivityPenalty -
      Math.round(input.deadlinePressure / 14)
  );
  const risk = clampScore(
    18 +
      sensitivityPenalty +
      integrationLoad +
      Math.round(input.deadlinePressure / 9) +
      (hasValue(input.riskNotes) ? 7 : 0) -
      approvalBonus
  );
  const dataSensitivity = clampScore(
    input.dataSensitivity === "high" ? 88 : input.dataSensitivity === "moderate" ? 58 : 24
  );
  const readiness = clampScore(
    businessValue * 0.3 + feasibility * 0.34 + (100 - risk) * 0.21 + agenticInfra * 1.5
  );

  return {
    businessValue,
    feasibility,
    risk,
    dataSensitivity,
    readiness
  };
}

function maturityScoresFor(input: WorkflowIntake, scores: Scores): MaturityScores {
  const hasGcp = includesAny(input.integrations, ["Vertex AI", "Google ADK", "GCP Pub/Sub"]);
  const hasComposable = includesAny(input.integrations, [
    "Contentful",
    "Contentstack",
    "BigCommerce",
    "commercetools",
    "Algolia"
  ]);
  const hasGovernance = input.knowledgeSources.length >= 6 && input.approvalMode !== "read-only";

  return {
    strategicFit: clampScore(scores.businessValue + (hasComposable ? 8 : 0)),
    architectureReadiness: clampScore(scores.feasibility + (hasGcp ? 10 : 0)),
    governanceConfidence: clampScore(100 - scores.risk + (hasGovernance ? 14 : 0)),
    deliveryVelocity: clampScore(48 + Math.round(input.deadlinePressure / 2) + scores.readiness / 5),
    hiringSignal: clampScore(
      64 +
        (hasGcp ? 10 : 0) +
        (hasComposable ? 7 : 0) +
        (input.sourceInputs.includes("Architecture decision record") ? 6 : 0) +
        (input.knowledgeSources.includes("MACH blueprint") ? 5 : 0) +
        (input.integrations.includes("Vector store") ? 5 : 0)
    )
  };
}

function dollars(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
}

function businessCaseFor(
  input: WorkflowIntake,
  scores: Scores,
  maturity: MaturityScores
): BusinessCase {
  const volume = Math.max(0, input.annualWorkflowVolume);
  const savedDays = Math.max(0, input.currentCycleDays - input.targetCycleDays);
  const teamCost = Math.max(0, input.teamCostPerDay);
  const launchValue = Math.max(0, input.launchValuePerDay);
  const reworkRate = Math.max(0, Math.min(100, input.reworkRate)) / 100;
  const pilotInvestment = Math.max(1, input.pilotBudget);

  const cycleTimeValue = Math.round(volume * savedDays * teamCost);
  const reworkValue = Math.round(volume * reworkRate * input.currentCycleDays * teamCost * 0.55);
  const speedToMarketValue = Math.round(volume * savedDays * launchValue * 0.35);
  const annualValue = cycleTimeValue + reworkValue + speedToMarketValue;
  const weeklyValue = Math.max(1, annualValue / 52);
  const paybackWeeks = Math.round((pilotInvestment / weeklyValue) * 10) / 10;
  const valueMultiple = Math.round((annualValue / pilotInvestment) * 10) / 10;
  const confidence = clampScore(
    scores.readiness * 0.35 +
      maturity.architectureReadiness * 0.22 +
      maturity.governanceConfidence * 0.23 +
      maturity.hiringSignal * 0.2
  );

  return {
    annualValue,
    cycleTimeValue,
    reworkValue,
    speedToMarketValue,
    pilotInvestment,
    paybackWeeks,
    valueMultiple,
    confidence,
    headline: `${dollars(annualValue)} annual value thesis with ${paybackWeeks} week modeled payback.`,
    thesis:
      "The commercial case is built on fewer handoff loops, less rework, faster release readiness, and reusable governance patterns that Apply can package across clients."
  };
}

function commercialPackagesFor(
  input: WorkflowIntake,
  businessCase: BusinessCase
): CommercialPackage[] {
  const pilotLow = dollars(businessCase.pilotInvestment * 0.8);
  const pilotHigh = dollars(businessCase.pilotInvestment * 1.3);
  const managedMonthly = dollars(Math.max(45000, businessCase.pilotInvestment * 0.28));
  const rolloutLow = dollars(Math.max(450000, businessCase.annualValue * 0.12));
  const rolloutHigh = dollars(Math.max(900000, businessCase.annualValue * 0.22));

  return [
    {
      packageName: "ACx Agentic Pilot",
      buyer: "VP Product, CX, Commerce, or Delivery",
      priceBand: `${pilotLow}-${pilotHigh}`,
      includes:
        "Workflow scorecard, source contract, RAG pack, task factory, eval harness, and one production-path pilot memo.",
      expansionTrigger: `Sponsor accepts ${input.successMetric || "the pilot success metric"} with measurable owner approval.`
    },
    {
      packageName: "Managed Agentic Delivery Desk",
      buyer: "Digital delivery, platform, and client operations leaders",
      priceBand: `${managedMonthly}/month plus implementation`,
      includes:
        "Reusable workflow templates, task-release governance, agent evals, approval telemetry, and monthly value readout.",
      expansionTrigger:
        "Two or more client workflows show repeatable source contracts, stable eval thresholds, and measurable rework reduction."
    },
    {
      packageName: "Enterprise ACx Accelerator",
      buyer: "Executive sponsor, CIO, CMO, CDO, or transformation lead",
      priceBand: `${rolloutLow}-${rolloutHigh}+ program`,
      includes:
        "Multi-workflow rollout, GCP/Vertex architecture, CMS/commerce/search connectors, audit store, enablement, and operating model.",
      expansionTrigger:
        "Client wants the accelerator embedded across campaign ops, content governance, commerce migration, or delivery operations."
    }
  ];
}

function productRoadmapFor(businessCase: BusinessCase): ProductRoadmapItem[] {
  return [
    {
      horizon: "Now",
      module: "Value-backed workflow scorer",
      whyItMatters:
        "Turns a vague AI opportunity into ranked client workflows with quantified value, risk, readiness, and payback.",
      proofNeeded: `${dollars(businessCase.annualValue)} modeled annual value, source assumptions, and owner-accepted metric.`
    },
    {
      horizon: "30 days",
      module: "Agentic task factory",
      whyItMatters:
        "Packages source-grounded work for coding agents with files, APIs, tests, non-goals, rollback notes, and approval gates.",
      proofNeeded: "One client workflow moves from source packet to approved implementation tasks with less review churn."
    },
    {
      horizon: "60 days",
      module: "RAG and eval control plane",
      whyItMatters:
        "Creates the defensible layer: source coverage, hallucination checks, accessibility, SEO/GEO, security, cost, and audit telemetry.",
      proofNeeded: "Eval dashboard shows source coverage, task accuracy, gate pass rate, and cost per approved task."
    },
    {
      horizon: "90 days",
      module: "Managed accelerator packaging",
      whyItMatters:
        "Turns the pilot into a reusable Apply Digital offer that can be sold across ACx, commerce, content, and platform accounts.",
      proofNeeded: "Repeatable playbook, connector backlog, price bands, case-study metrics, and enablement pack."
    },
    {
      horizon: "Scale",
      module: "Enterprise integration layer",
      whyItMatters:
        "Connects CMS, commerce, search, analytics, work management, and cloud services while keeping production writes governed.",
      proofNeeded: "Security review, connector SLAs, audit replay, failure-mode tests, and executive value reporting."
    }
  ];
}

function boardroomObjectionsFor(businessCase: BusinessCase): BoardroomObjection[] {
  return [
    {
      objection: "Is this just another chatbot demo?",
      answer:
        "No. The LLM is optional drafting support; the product value is the deterministic source contract, task-release governance, eval harness, and audit trail.",
      evidence: "Compiler output includes bounded tasks, RAG guardrails, approval gates, risk register, and replayable audit events."
    },
    {
      objection: "Can this create real client value?",
      answer:
        "Yes, if the pilot targets repeated workflows with measurable cycle-time, rework, or speed-to-market waste.",
      evidence: `${dollars(businessCase.annualValue)} modeled annual value and ${businessCase.valueMultiple}x value-to-pilot multiple.`
    },
    {
      objection: "Will governance slow the team down?",
      answer:
        "The governance is the acceleration layer: it prevents ambiguous agent work, review churn, and unsafe external actions.",
      evidence: "Every task includes owner, source, non-goal, acceptance criteria, approval gate, and rollback expectation."
    },
    {
      objection: "Can Apply sell this repeatedly?",
      answer:
        "Yes. The same operating model packages into pilots, managed delivery desks, and enterprise accelerator programs.",
      evidence: "The system emits price bands, buyer map, expansion triggers, and a 90-day product roadmap."
    }
  ];
}

function clientDecisionMemoFor(
  input: WorkflowIntake,
  scores: Scores,
  businessCase: BusinessCase
): ClientDecisionMemo {
  const decision =
    scores.readiness >= 76
      ? "Approve a 30-day production-ready pilot for this workflow."
      : "Run a 5-day source and governance discovery sprint before pilot approval.";

  return {
    recommendedDecision: decision,
    whyNow:
      "The client problem is not lack of AI ideas; it is execution. The system turns a repeated ACx workflow into a scoped, measurable, governed launch path instead of another generic pilot.",
    sponsorAsk: `Approve ${dollars(businessCase.pilotInvestment)} for the first pilot, name one executive sponsor, and accept the stop/scale metric tied to ${input.successMetric || "the agreed business outcome"}.`,
    firstWorkshop:
      "Run a 90-minute workflow-mapping session with product, content, brand/legal, engineering, analytics, QA, and delivery owners. Leave with source owners, workflow boundaries, approval gates, and value assumptions.",
    dataPosition:
      "Use the client's own environment, systems, source documents, and approved retrieval packs. Production writes stay gated; sensitive data is masked before any model-assisted drafting.",
    adoptionPosition:
      "Treat adoption as part of delivery: named owners, weekly value readout, QA evidence, enablement for reviewers, and a clear handoff from pilot team to operating team."
  };
}

function stakeholderCommitmentsFor(input: WorkflowIntake): StakeholderCommitment[] {
  return [
    {
      stakeholder: "Executive sponsor",
      decisionNeeded: "Approve pilot budget, workflow scope, and stop/scale criteria.",
      requiredInput: input.successMetric || "Business metric, workflow priority, and accountable owner.",
      operatingCadence: "Kickoff, midpoint value review, and final go/no-go readout."
    },
    {
      stakeholder: "Product or CX lead",
      decisionNeeded: "Confirm the customer journey slice and what should not be automated.",
      requiredInput: "User stories, acceptance criteria, non-goals, and customer-impact risks.",
      operatingCadence: "Two working sessions in week 1; weekly task packet review."
    },
    {
      stakeholder: "Brand, content, and legal owners",
      decisionNeeded: "Approve brand, claim, regional, and customer-facing content rules.",
      requiredInput: "Brand guidelines, content policy, legal rules, regional exceptions, and approval SLAs.",
      operatingCadence: "Policy review in week 1; exception review during eval week."
    },
    {
      stakeholder: "Engineering, security, and platform owners",
      decisionNeeded: "Approve integration boundaries, data handling, tool scopes, and rollback plan.",
      requiredInput: "API contracts, environment constraints, access model, security requirements, and logging needs.",
      operatingCadence: "Architecture review in week 1; integration readiness review in week 3."
    },
    {
      stakeholder: "Analytics and QA owners",
      decisionNeeded: "Approve measurement design, evidence thresholds, and release blockers.",
      requiredInput: "Baseline data, event taxonomy, KPI definitions, and QA acceptance thresholds.",
      operatingCadence: "Metric setup in week 1; evidence review before production path."
    }
  ];
}

function clientLaunchPlanFor(input: WorkflowIntake): ClientLaunchStep[] {
  return [
    {
      timeline: "Day 0",
      clientAction: "Name sponsor, workflow owner, and first pilot workflow.",
      applyAction: "Confirm business metric, commercial assumptions, and delivery team.",
      evidence: "Signed pilot charter and initial value model."
    },
    {
      timeline: "Week 1",
      clientAction: "Provide source packet, brand/legal rules, API owners, and baseline metrics.",
      applyAction: "Create source contract, stakeholder map, retrieval pack, and governance policy.",
      evidence: "Source coverage report and owner-approved workflow boundary."
    },
    {
      timeline: "Week 2",
      clientAction: "Review the first task packet and approve sandbox execution boundaries.",
      applyAction: "Configure task factory, tool plan, eval harness, and audit events.",
      evidence: "Bounded coding-agent task batch with tests, non-goals, and rollback notes."
    },
    {
      timeline: "Week 3",
      clientAction: "Validate generated outputs, approval routing, and exception handling.",
      applyAction: "Run accessibility, SEO/GEO, brand, security, source-coverage, and cost evals.",
      evidence: "Eval dashboard and risk register with resolved or owned blockers."
    },
    {
      timeline: "Week 4",
      clientAction: "Choose scale, repeat, or stop based on the pilot readout.",
      applyAction: "Deliver operating model, training plan, connector backlog, and scale roadmap.",
      evidence: `Production-readiness memo tied to ${input.successMetric || "the accepted client outcome"}.`
    }
  ];
}

function successDashboardFor(
  input: WorkflowIntake,
  businessCase: BusinessCase
): SuccessDashboardMetric[] {
  return [
    {
      metric: "Cycle-time reduction",
      target: `${input.currentCycleDays} days to ${input.targetCycleDays} days for approved workflow packets.`,
      owner: "Product or delivery owner",
      evidenceSource: "Workflow timestamp audit events and task-release history."
    },
    {
      metric: "Value realization",
      target: `${dollars(businessCase.annualValue)} annual value thesis with ${businessCase.paybackWeeks} week modeled payback.`,
      owner: "Executive sponsor",
      evidenceSource: "Baseline assumptions, actual throughput, rework reduction, and launch timing."
    },
    {
      metric: "Approval SLA",
      target: "Named owners respond to customer-facing or external-action gates within agreed SLA.",
      owner: "Brand, legal, content, and delivery owners",
      evidenceSource: "Approval queue events, exception log, and unresolved blocker count."
    },
    {
      metric: "Agent task acceptance",
      target: "At least 80% of generated task packets accepted without major scope rewrite.",
      owner: "Technical lead",
      evidenceSource: "Task review outcomes, rejected-task reasons, and coding-agent handoff notes."
    },
    {
      metric: "Governance confidence",
      target: "No release without source citation, owner, non-goal, eval result, and rollback expectation.",
      owner: "QA and security owners",
      evidenceSource: "Eval harness, risk register, audit log, and release memo."
    },
    {
      metric: "Adoption",
      target: "Pilot reviewers use the workflow weekly and can explain the approval model without AI expertise.",
      owner: "Change and enablement lead",
      evidenceSource: "Usage events, reviewer feedback, enablement attendance, and support questions."
    }
  ];
}

function buyerQuestionsFor(businessCase: BusinessCase): BuyerQuestion[] {
  return [
    {
      question: "How do we get past pilot purgatory?",
      answer:
        "Start with one repeated workflow, one metric, named owners, and production-readiness evidence in 30 days.",
      proofPoint: `${businessCase.confidence}/100 confidence score and a week-by-week client launch plan.`
    },
    {
      question: "Who owns the data and infrastructure?",
      answer:
        "The client does. The plan assumes the client's own cloud environment, approved source packs, scoped access, and masked sensitive fields.",
      proofPoint: "Architecture blueprint includes environment, retrieval, tool-scope, and audit boundaries."
    },
    {
      question: "Is it secure enough for enterprise workflows?",
      answer:
        "Security is handled as an operating requirement: least-privilege tools, approval gates, audit replay, masked data, and no autonomous production writes.",
      proofPoint: "Risk register, autonomy boundaries, and QA/eval checks are emitted for every scenario."
    },
    {
      question: "Do our teams need AI expertise?",
      answer:
        "No. The system hides prompt engineering behind source contracts, templates, decision gates, and reviewer-friendly evidence.",
      proofPoint: "Stakeholder commitments focus on business, brand, engineering, QA, and delivery decisions."
    },
    {
      question: "How is this different from off-the-shelf AI tools?",
      answer:
        "It is built around the client's workflows, systems, data, brand rules, approval model, and measurable business outcome.",
      proofPoint: "Commercial packages and launch plan show how it becomes a repeatable client-specific accelerator."
    },
    {
      question: "How do we know it is worth funding?",
      answer:
        "The system exposes the value assumptions, payback, package price bands, and evidence needed to prove or disprove the business case.",
      proofPoint: `${dollars(businessCase.annualValue)} modeled annual value and ${businessCase.valueMultiple}x value-to-pilot multiple.`
    }
  ];
}

function ownerForSource(source: string): string {
  if (source.includes("Design") || source.includes("Accessibility")) {
    return "UX or design-system owner";
  }

  if (source.includes("Content") || source.includes("SEO")) {
    return "Content strategy owner";
  }

  if (source.includes("API") || source.includes("Release") || source.includes("MACH")) {
    return "Engineering or architecture owner";
  }

  if (source.includes("Experiment")) {
    return "Analytics owner";
  }

  return "Product owner";
}

function approvalLabel(mode: ApprovalMode): string {
  if (mode === "read-only") {
    return "Agent may draft and classify only";
  }

  if (mode === "human-before-write") {
    return "Human approval before writes";
  }

  return "Human approval before external or customer-facing actions";
}

function sensitivityLabel(sensitivity: DataSensitivity): string {
  if (sensitivity === "high") {
    return "High sensitivity";
  }

  if (sensitivity === "moderate") {
    return "Moderate sensitivity";
  }

  return "Low sensitivity";
}

function decisionModeFor(input: WorkflowIntake, scores: Scores): string {
  if (scores.risk >= 72 || input.dataSensitivity === "high") {
    return "Human-led agentic pilot";
  }

  if (scores.readiness >= 78 && scores.feasibility >= 76) {
    return "Pilot-ready agentic build";
  }

  if (input.deliveryStage === "scale") {
    return "Architecture review before scale";
  }

  return "Discovery sprint before agent handoff";
}

function nextBestActionFor(input: WorkflowIntake, scores: Scores): string {
  if (scores.feasibility < 62) {
    return "Clarify source packet, owners, acceptance criteria, and architecture decisions before task release.";
  }

  if (scores.risk >= 72) {
    return "Run privacy, security, and approval review before any external action.";
  }

  if (!input.integrations.includes("Vector store")) {
    return "Add retrieval architecture before treating generated specs as implementation-ready.";
  }

  if (input.deliveryStage === "discovery") {
    return "Package the discovery sprint with owner interviews, source map, and a no-write prototype.";
  }

  return "Package the first bounded coding-agent task batch and assign owner review.";
}

function riskPostureFor(input: WorkflowIntake, scores: Scores): string {
  if (input.dataSensitivity === "high") {
    return "Tight governance: mask data, require named approvals, and keep agents draft-only until release gates pass.";
  }

  if (scores.risk >= 62) {
    return "Moderate governance: allow drafts and sandbox reads, but gate writes and publish actions.";
  }

  return "Standard governance: bounded agent execution is acceptable after source-owner signoff.";
}

function backlogTasksFor(input: WorkflowIntake): BacklogTask[] {
  const channels = input.channels.join(", ") || "selected channels";
  const integrations = input.integrations.join(", ") || "declared systems";

  return [
    {
      workstream: "Source contract",
      owner: "Product architect",
      task: "Normalize source inputs into a signed implementation contract.",
      acceptanceCriteria:
        "Contract includes goal, owners, source links, non-goals, assumptions, acceptance criteria, and escalation path."
    },
    {
      workstream: "Experience map",
      owner: "UX and content owners",
      task: `Map ${channels} requirements into components, content slots, metadata, states, and approval paths.`,
      acceptanceCriteria:
        "Every component and content slot has an owner, state, accessibility rule, analytics event, and release condition."
    },
    {
      workstream: "Agent task release",
      owner: "Technical lead",
      task: "Generate coding-agent task packets with files, APIs, edge cases, test expectations, and rollback notes.",
      acceptanceCriteria:
        "Tasks are bounded, testable, source-grounded, and blocked from autonomous production writes."
    },
    {
      workstream: "Integration plan",
      owner: "Platform architect",
      task: `Define read, write, cache, queue, and failure handling for ${integrations}.`,
      acceptanceCriteria:
        "External writes are gated; read paths, retries, rollback notes, and audit events are explicit."
    },
    {
      workstream: "Evaluation harness",
      owner: "QA and analytics lead",
      task: "Build deterministic checks for accessibility, SEO/GEO, performance, security, analytics, and agent boundaries.",
      acceptanceCriteria:
        "Critical checks run before release and produce owner-readable pass/fail evidence."
    },
    {
      workstream: "Executive handoff",
      owner: "Delivery owner",
      task: "Prepare pilot memo, open risks, decision gates, and first production-safe task batch.",
      acceptanceCriteria:
        "Business, technical, and QA owners can accept or reject the pilot without a clarification meeting."
    }
  ];
}

function architectureBlueprintFor(input: WorkflowIntake): ArchitectureLayer[] {
  const retrieval =
    input.integrations.includes("Vector store") || input.integrations.includes("Vertex AI")
      ? "Vector store with source metadata, recency filters, and owner-approved retrieval packs."
      : "Manual source packet now; add vector retrieval before scale.";

  return [
    {
      layer: "Intake and source contract",
      designChoice:
        "Typed intake schema normalizes business goal, channels, source inputs, owners, risk, and success metrics.",
      applySignal: "Spec-driven development that turns ambiguous ACx work into accountable delivery artifacts."
    },
    {
      layer: "Retrieval and grounding",
      designChoice: retrieval,
      applySignal: "RAG-ready architecture aligned to knowledge-source ownership and freshness."
    },
    {
      layer: "Agent orchestration",
      designChoice:
        "Google ADK or workflow router coordinates draft, critique, test-plan, and handoff agents with deterministic routing.",
      applySignal: "Agentic accelerator pattern without making the LLM the control plane."
    },
    {
      layer: "Execution boundary",
      designChoice:
        "Coding agents receive bounded tasks with files, APIs, non-goals, tests, rollback notes, and no autonomous external writes.",
      applySignal: "Hands-on AI coding-agent practice translated into enterprise-safe operating rules."
    },
    {
      layer: "Platform services",
      designChoice:
        "Cloud Run or serverless APIs, Pub/Sub or Cloud Tasks for long jobs, Redis cache, and Postgres or BigQuery audit storage.",
      applySignal: "Distributed systems fundamentals: queues, cache, APIs, persistence, and replayable audits."
    },
    {
      layer: "Evaluation and observability",
      designChoice:
        "Evals track source coverage, hallucination risk, accessibility, SEO/GEO, performance, security, cost, and owner approvals.",
      applySignal: "Quality gates make agentic delivery measurable instead of theatrical."
    }
  ];
}

function pilotPlanFor(input: WorkflowIntake): PilotPlanStep[] {
  return [
    {
      phase: "01. Workflow selection",
      timeline: "Day 1-2",
      artifact: "Client workflow scorecard and one recommended pilot slice.",
      decisionGate: "Executive sponsor agrees the slice is high-value, bounded, and measurable."
    },
    {
      phase: "02. Source contract",
      timeline: "Day 3-5",
      artifact: "Signed source map, owner map, approval policy, and retrieval pack.",
      decisionGate: "Product, UX, content, engineering, and QA owners accept the source contract."
    },
    {
      phase: "03. Agentic task factory",
      timeline: "Week 2",
      artifact: "First coding-agent task batch with tests, non-goals, rollback notes, and audit events.",
      decisionGate: "Tech lead approves bounded agent execution in sandbox or branch."
    },
    {
      phase: "04. Evaluation harness",
      timeline: "Week 3",
      artifact: "Accessibility, SEO/GEO, performance, security, source-coverage, and cost evals.",
      decisionGate: "QA owner accepts evidence thresholds and release blockers."
    },
    {
      phase: "05. Production path",
      timeline: "Week 4",
      artifact: `Pilot readout tied to ${input.successMetric || "the agreed success metric"}.`,
      decisionGate: "Sponsor chooses scale, repeat, or stop based on measured value and residual risk."
    }
  ];
}

function roleFitMatrixFor(input: WorkflowIntake): RoleFitRow[] {
  return [
    {
      requirement: "Spec-driven development and senior architecture judgment",
      prototypeProof:
        "The compiler converts source packets into bounded implementation specs, architecture decisions, QA gates, and owner handoff.",
      candidateProof:
        "VCOS/MIDAS and JobFlow translate strategy, user stories, constraints, tests, and release notes into coding-agent-ready work."
    },
    {
      requirement: "Hands-on AI coding agents and prompt/system design",
      prototypeProof:
        "Agent task release includes files, APIs, non-goals, edge cases, evals, rollback notes, and human gates.",
      candidateProof:
        "Built deterministic-first workflows with Claude, ChatGPT, Gemini, custom tools, skills, and API integrations."
    },
    {
      requirement: "RAG, vector stores, and knowledge architecture",
      prototypeProof:
        `${input.knowledgeSources.length} source types are mapped to owners, freshness rules, retrieval use, and guardrails.`,
      candidateProof:
        "Designs RAG-ready workflows, knowledge capture loops, and multi-agent operating systems at Million Dollar AI Studio."
    },
    {
      requirement: "GCP, Vertex AI, Google Gen AI APIs, and ADK-ready thinking",
      prototypeProof:
        "Blueprint includes Vertex AI, Google ADK, Pub/Sub or Cloud Tasks, Cloud Run/serverless APIs, and eval telemetry.",
      candidateProof:
        "Hands-on Google Gemini and Google AI Studio experience, plus production-minded API, automation, and deployment planning."
    },
    {
      requirement: "Distributed systems fundamentals",
      prototypeProof:
        "Architecture covers queues, caching, API contracts, audit persistence, retries, failure modes, and rollback paths.",
      candidateProof:
        "TELUS Health work involves sensitive HRIS feeds, reconciliation, compliance reporting, and enterprise stakeholder escalation."
    },
    {
      requirement: "Client-facing delivery and business value",
      prototypeProof:
        "Pilot plan ties every task batch to business impact, owner acceptance, and a measurable success metric.",
      candidateProof:
        "Combines enterprise operations, data analysis, product buildout, stakeholder management, and founder-level delivery ownership."
    }
  ];
}

function riskRegisterFor(input: WorkflowIntake): RiskRegisterRow[] {
  const approval = approvalLabel(input.approvalMode);

  return [
    {
      risk: "Ungrounded agent output",
      signal: "Task claims cannot be traced to source packet, owner, or retrieval result.",
      mitigation: "Fail source-coverage eval and route to assumption register before task release.",
      owner: "Product architect"
    },
    {
      risk: "Autonomous external action",
      signal: `Workflow requires ${approval.toLowerCase()}.`,
      mitigation: "Gate writes, publishing, notifications, pricing, and customer-facing copy behind human approval.",
      owner: "Delivery owner"
    },
    {
      risk: "Sensitive data leakage",
      signal: `${sensitivityLabel(input.dataSensitivity)} workflow with ${input.integrations.length} integration boundaries.`,
      mitigation: "Mask sensitive fields, restrict tool scopes, and audit every retrieval and draft event.",
      owner: "Security or privacy owner"
    },
    {
      risk: "Composable dependency drift",
      signal: "CMS, commerce, search, analytics, and data contracts evolve independently.",
      mitigation: "Cache source packets, version API contracts, and rerun evals when release history changes.",
      owner: "Platform architect"
    },
    {
      risk: "Pilot value is unclear",
      signal: input.successMetric || "No success metric has been accepted.",
      mitigation: "Tie phase gates to measurable cycle-time, quality, cost, or revenue-adjacent outcomes.",
      owner: "Executive sponsor"
    }
  ];
}

function impactModelFor(input: WorkflowIntake, scores: Scores): ImpactMetric[] {
  const readinessBand = scores.readiness >= 78 ? "high" : scores.readiness >= 64 ? "medium" : "early";

  return [
    {
      metric: "Campaign-to-code cycle time",
      baseline: "5-10 business days of clarification and handoff loops",
      target: "1-2 days to a signed task packet",
      rationale: `Readiness is ${readinessBand}; source contracts and deterministic templates reduce repeated interpretation work.`
    },
    {
      metric: "Unowned release decisions",
      baseline: "Open questions scattered across product, content, QA, and engineering threads",
      target: "Zero unowned blockers before coding-agent task release",
      rationale: "Every source, integration, risk, and acceptance criterion is assigned to a named owner."
    },
    {
      metric: "Agent rework",
      baseline: "Ambiguous prompts create broad changes and review churn",
      target: "Bounded tasks with non-goals, tests, rollback notes, and source links",
      rationale: "Coding agents receive implementation contracts, not vague business goals."
    },
    {
      metric: "Governance evidence",
      baseline: "Manual review notes and inconsistent approvals",
      target: "Replayable audit events for source normalization, scoring, gates, and handoff",
      rationale: "The audit trail makes enterprise controls visible without slowing the team down."
    }
  ];
}

function architectureNotesFor(input: WorkflowIntake): string[] {
  const externalSystems = input.integrations.length > 0 ? input.integrations.join(", ") : "none";

  return [
    "Keep deterministic rules in charge of scoring, task boundaries, risk gates, and eval routing.",
    `Treat integrations as explicit boundaries: ${externalSystems}. Reads may be autonomous; writes need approval gates.`,
    "Use queue-backed orchestration for long-running content, search, media, analytics, or migration jobs.",
    "Cache source packets and retrieval results per campaign or sprint to reduce repeated lookups and make audit replay possible.",
    "Store audit events for source normalization, score changes, owner approvals, task release, eval results, and release handoff."
  ];
}

function evaluationPlanFor(input: WorkflowIntake, scores: Scores): string[] {
  const sensitivityCheck =
    input.dataSensitivity === "high"
      ? "Verify masking and redaction before any model-assisted draft or external tool call."
      : "Verify source traceability and approval gates before release.";

  return [
    `Readiness threshold: ship only when readiness is at least 76 or the delivery owner explicitly accepts a ${scores.readiness} score.`,
    sensitivityCheck,
    "Compare generated tasks against source inputs; fail if any task lacks owner, file or surface, acceptance criteria, or non-goal.",
    "Run accessibility, SEO/GEO, performance, security, analytics, and source-coverage checks before coding-agent execution.",
    "Review agent failure modes: source conflict, missing owner, integration outage, ambiguous brand rule, risky external action, and stale retrieval result.",
    `Measure pilot success against: ${input.successMetric || "the agreed client outcome."}`
  ];
}

function executiveBriefFor(
  input: WorkflowIntake,
  scores: Scores,
  maturity: MaturityScores,
  businessCase: BusinessCase
): ExecutiveBrief {
  return {
    headline: `${input.workflowName || "AX workflow"} is ${scores.readiness >= 76 ? "pilot-ready" : "ready for a bounded discovery sprint"} with a ${dollars(businessCase.annualValue)} value thesis.`,
    boardroomPitch:
      "This turns Apply's agentic customer experience promise into an operating system: source-grounded, composable, measurable, and safe enough for enterprise teams to adopt.",
    applySignal: [
      "ACx workflow focus",
      "TORQ-style accelerator pattern",
      "Composable platform alignment",
      "GCP and Vertex AI ready",
      businessCase.headline,
      `${maturity.hiringSignal}/100 hiring-signal proof`
    ],
    demoClose:
      "I would use this in the interview to ask for one real client workflow, score it live, price the pilot, and leave behind a buildable accelerator plan."
  };
}

function interviewNarrativeFor(input: WorkflowIntake, outputMode: string): string[] {
  return [
    `Open with the client workflow: "${input.workflowName}" is an ACx use case where speed only matters if governance survives handoff.`,
    "Show the source contract: product, UX, content, API, brand, analytics, and compliance inputs become one implementation packet.",
    `Name the safe autonomy level: ${outputMode}. The agent drafts, but deterministic rules decide gates and owners approve risky action.`,
    "Whiteboard the architecture: intake, retrieval, orchestration, bounded coding-agent tasks, eval harness, audit store, and release handoff.",
    "Translate to Apply value: this can become a repeatable accelerator for campaign ops, composable commerce, content governance, or internal delivery.",
    "Close by asking which client workflow has the highest value and lowest governance ambiguity for a 30-day pilot."
  ];
}

export function compileSpec(input: WorkflowIntake): CompilerOutput {
  const scores = scoreIntake(input);
  const maturityScores = maturityScoresFor(input, scores);
  const sourceList = input.sourceInputs.join(", ") || "source package";
  const integrationList = input.integrations.join(", ") || "no external integrations";
  const channelList = input.channels.join(", ") || "single internal channel";
  const approval = approvalLabel(input.approvalMode);
  const sensitivity = sensitivityLabel(input.dataSensitivity);
  const decisionMode = decisionModeFor(input, scores);
  const nextBestAction = nextBestActionFor(input, scores);
  const riskPosture = riskPostureFor(input, scores);
  const architectureBlueprint = architectureBlueprintFor(input);
  const pilotPlan = pilotPlanFor(input);
  const roleFitMatrix = roleFitMatrixFor(input);
  const riskRegister = riskRegisterFor(input);
  const impactModel = impactModelFor(input, scores);
  const businessCase = businessCaseFor(input, scores, maturityScores);
  const executiveBrief = executiveBriefFor(input, scores, maturityScores, businessCase);
  const commercialPackages = commercialPackagesFor(input, businessCase);
  const productRoadmap = productRoadmapFor(businessCase);
  const boardroomObjections = boardroomObjectionsFor(businessCase);
  const clientDecisionMemo = clientDecisionMemoFor(input, scores, businessCase);
  const stakeholderCommitments = stakeholderCommitmentsFor(input);
  const clientLaunchPlan = clientLaunchPlanFor(input);
  const successDashboard = successDashboardFor(input, businessCase);
  const buyerQuestions = buyerQuestionsFor(businessCase);
  const nextActionQueue = nextActionQueueFor(input, scores, businessCase);
  const connectorContracts = connectorContractsFor(input);
  const evalTelemetry = evalTelemetryFor(
    input,
    scores,
    maturityScores,
    businessCase,
    nextActionQueue,
    connectorContracts
  );
  const releaseGates = releaseGatesFor(
    input,
    scores,
    businessCase,
    nextActionQueue,
    evalTelemetry,
    connectorContracts
  );
  const backlogTasks = backlogTasksFor(input);
  const agentWorkOrders = agentWorkOrdersFor(
    input,
    backlogTasks,
    connectorContracts,
    evalTelemetry,
    releaseGates,
    nextActionQueue
  );
  const evidenceLedger = evidenceLedgerFor(
    input,
    connectorContracts,
    evalTelemetry,
    releaseGates,
    nextActionQueue
  );
  const workspaceControlRoom = workspaceControlRoomFor(
    input,
    scores,
    maturityScores,
    releaseGates,
    evidenceLedger,
    agentWorkOrders
  );
  const deliveryFactoryBundle = deliveryFactoryBundleFor(
    input.workflowName || "Untitled AX workflow",
    input.businessGoal ||
      "A governed agentic workflow that converts source inputs into implementation-ready delivery artifacts.",
    agentWorkOrders,
    evidenceLedger
  );
  const readinessBoard = readinessBoardFor(
    input,
    scores,
    maturityScores,
    businessCase,
    nextActionQueue
  );

  const implementationSpec = [
    `Normalize intake from ${sourceList} into a signed implementation contract with owner, acceptance criteria, non-goals, assumptions, and escalation path.`,
    `Map ${channelList} requirements into page, component, API, content, search, analytics, accessibility, and release workstreams.`,
    "Generate coding-agent tasks with expected files, API contracts, edge cases, tests, rollback notes, and explicit no-write boundaries.",
    `Apply brand and governance constraints: ${input.brandConstraints || "brand, accessibility, performance, and approval rules must be declared before generation."}`,
    `Route integrations through ${integrationList}; every external write receives an approval gate and audit entry.`,
    `Measure success against: ${input.successMetric || "the accepted pilot success metric."}`,
    `Respect cost and model-use guardrail: ${input.budgetGuardrail || "deterministic rules first; AI only for grounded synthesis."}`,
    `Commercial case: ${businessCase.headline} with ${businessCase.confidence}/100 confidence and ${businessCase.valueMultiple}x value-to-pilot multiple.`
  ];

  const autonomyBoundaries = [
    `${approval}; no autonomous publishing, customer messaging, pricing changes, production writes, or external notifications.`,
    `${sensitivity} workflow; customer, employee, financial, or regulated data is masked before any drafting step.`,
    "Coding agents receive bounded implementation contracts, not open-ended business goals.",
    "Search metadata, content, accessibility, analytics, commerce, and loyalty changes require named owner sign-off before release.",
    "If source inputs conflict, the compiler emits an assumption register instead of resolving by preference.",
    "Tool permissions are scoped by workflow stage: discovery is read-only, pilot is sandboxed, scale requires policy and audit review."
  ];

  const ragMap =
    input.knowledgeSources.length > 0
      ? input.knowledgeSources.map((source) => ({
          source,
          owner: ownerForSource(source),
          freshness: source.includes("Release")
            ? "Per deployment"
            : source.includes("Experiment")
              ? "Per experiment cycle"
              : "Per campaign or sprint",
          retrievalUse: `Ground ${source.toLowerCase()} references for task drafting, source coverage, and QA checks.`,
          guardrail: "Reject task claims that cannot cite this source or an approved fallback owner."
        }))
      : [
          {
            source: "Manual source packet",
            owner: "Product owner",
            freshness: "Per request",
            retrievalUse: "Ground agent tasks before any draft output is accepted.",
            guardrail: "Block release until source owner approves the packet."
          }
        ];

  const toolPlan = [
    {
      action: "Read source package",
      system: "CMS, commerce, product tracker, design handoff, repository docs, and analytics taxonomy",
      autonomy: "Autonomous read",
      approvalGate: "Source owner confirms scope",
      evidence: "Source map, owner map, and retrieval coverage report"
    },
    {
      action: "Draft implementation spec",
      system: "Deterministic compiler with optional grounded LLM synthesis",
      autonomy: "Autonomous draft",
      approvalGate: "Product and engineering review",
      evidence: "Implementation contract, assumptions, and score trace"
    },
    {
      action: "Prepare coding-agent task set",
      system: "GitHub issues, Linear, Jira, or backlog export",
      autonomy: "Draft only",
      approvalGate: "Tech lead accepts task boundaries",
      evidence: "Files, APIs, non-goals, tests, and rollback notes"
    },
    {
      action: "Run retrieval and eval checks",
      system: "Vector store, Vertex AI evals, deterministic QA harness, and audit store",
      autonomy: "Autonomous read and test",
      approvalGate: "QA owner accepts evidence threshold",
      evidence: "Source coverage, risk, accessibility, SEO/GEO, performance, and security results"
    },
    {
      action: "Plan integration work",
      system: integrationList,
      autonomy: "Read or sandbox only",
      approvalGate: "Human before write, publish, delete, notify, or change customer data",
      evidence: "Integration boundary map and failure-mode register"
    },
    {
      action: "Emit release packet",
      system: "QA checklist, handoff notes, pilot memo, and audit log",
      autonomy: "Draft only",
      approvalGate: "Delivery owner signs release",
      evidence: "Pilot decision memo and measurable success readout"
    }
  ];

  const qaChecks = [
    "Spec completeness: every story has owner, input, output, acceptance criteria, non-goal, and source citation.",
    "Accessibility: WCAG AA contrast, semantic structure, keyboard flow, focus states, alt text policy, and reduced-motion behavior.",
    "SEO/GEO: canonical metadata, structured content fields, indexability, content source traceability, and human copy approval.",
    "Performance: media budget, Core Web Vitals risk, cache plan, queue latency, and search indexing latency.",
    "Security and privacy: sensitive data masking, least-privilege tool access, audit log coverage, and no secrets in specs.",
    "Agent reliability: bounded tasks, retry rules, failure states, assumption register, stale-retrieval handling, and rollback path.",
    "Business impact: pilot metric, baseline, target, owner, and evidence source are visible before scale."
  ];

  const handoffNotes = [
    `Business owner: validate that "${input.businessGoal || input.workflowName}" is the highest-value workflow slice.`,
    "Executive sponsor: approve pilot metric, stop/scale criteria, and where agentic acceleration should compound.",
    "Delivery owner: confirm sprint fit, dependencies, and which tasks are safe for coding-agent execution.",
    "Technical owner: review integration writes, API contracts, queue/cache assumptions, observability, and rollback path.",
    "QA owner: run accessibility, performance, security, source-coverage, analytics, and release-readiness checks before production handoff.",
    "Interview walkthrough: use the compiler output as a whiteboard artifact for autonomy, governance, business value, and implementation tradeoffs."
  ];

  const auditEvents = [
    "Input normalized through deterministic rules.",
    `Scores computed: value ${scores.businessValue}, feasibility ${scores.feasibility}, risk ${scores.risk}, readiness ${scores.readiness}.`,
    `Maturity computed: strategic fit ${maturityScores.strategicFit}, architecture ${maturityScores.architectureReadiness}, governance ${maturityScores.governanceConfidence}, hiring signal ${maturityScores.hiringSignal}.`,
    `${autonomyBoundaries.length} autonomy boundaries emitted.`,
    `${ragMap.length} knowledge sources mapped.`,
    `${toolPlan.length} tool actions prepared.`,
    `${qaChecks.length} QA checks prepared.`,
    `${pilotPlan.length} pilot phases generated.`,
    `Business case generated: ${dollars(businessCase.annualValue)} annual value, ${businessCase.paybackWeeks} week payback, ${businessCase.valueMultiple}x pilot multiple.`,
    `${nextActionQueue.length} next actions queued with owners and evidence requirements.`,
    `${readinessBoard.length} readiness dimensions assessed for client pilot funding.`,
    `${connectorContracts.length} connector contracts generated with auth scope and failure modes.`,
    `${evalTelemetry.length} eval telemetry metrics scored against release thresholds.`,
    `${agentWorkOrders.length} agent work orders generated with evidence and release gates.`,
    `Workspace control room scored ${workspaceControlRoom.readinessScore}/100 with ${workspaceControlRoom.accessRoles.length} access roles.`
  ];

  return {
    title: input.workflowName || "Untitled AX workflow",
    summary:
      input.businessGoal ||
      "A governed agentic workflow that converts source inputs into implementation-ready delivery artifacts.",
    scores,
    maturityScores,
    decisionMode,
    nextBestAction,
    riskPosture,
    executiveBrief,
    businessCase,
    implementationSpec,
    autonomyBoundaries,
    ragMap,
    toolPlan,
    backlogTasks,
    architectureBlueprint,
    pilotPlan,
    roleFitMatrix,
    riskRegister,
    impactModel,
    commercialPackages,
    productRoadmap,
    boardroomObjections,
    clientDecisionMemo,
    stakeholderCommitments,
    clientLaunchPlan,
    successDashboard,
    buyerQuestions,
    nextActionQueue,
    readinessBoard,
    connectorContracts,
    evalTelemetry,
    releaseGates,
    agentWorkOrders,
    evidenceLedger,
    deliveryFactoryBundle,
    workspaceControlRoom,
    architectureNotes: architectureNotesFor(input),
    evaluationPlan: evaluationPlanFor(input, scores),
    qaChecks,
    handoffNotes,
    interviewNarrative: interviewNarrativeFor(input, decisionMode),
    auditEvents
  };
}
