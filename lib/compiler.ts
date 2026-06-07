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
    "Customer-facing copy, search metadata, offer rules, and analytics events require named owner approval before release."
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
        "Schedule changes, rights-sensitive content, and live-event metadata need owner review before release."
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
        "Claims, regional content variants, and lifecycle status must be reviewed before customer-facing release."
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
        "Checkout, loyalty, promotions, and customer data flows require extra controls before any production change."
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
        "Concurrent team dependencies and unclear ownership should block task release until resolved."
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

function executiveBriefFor(input: WorkflowIntake, scores: Scores, maturity: MaturityScores): ExecutiveBrief {
  return {
    headline: `${input.workflowName || "AX workflow"} is ${scores.readiness >= 76 ? "pilot-ready" : "ready for a bounded discovery sprint"}.`,
    boardroomPitch:
      "This turns Apply's agentic customer experience promise into an operating system: source-grounded, composable, measurable, and safe enough for enterprise teams to adopt.",
    applySignal: [
      "ACx workflow focus",
      "TORQ-style accelerator pattern",
      "Composable platform alignment",
      "GCP and Vertex AI ready",
      `${maturity.hiringSignal}/100 hiring-signal proof`
    ],
    demoClose:
      "I would use this in the interview to ask for one real client workflow, score it live, and leave behind a pilot plan the team could actually start."
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
  const executiveBrief = executiveBriefFor(input, scores, maturityScores);

  const implementationSpec = [
    `Normalize intake from ${sourceList} into a signed implementation contract with owner, acceptance criteria, non-goals, assumptions, and escalation path.`,
    `Map ${channelList} requirements into page, component, API, content, search, analytics, accessibility, and release workstreams.`,
    "Generate coding-agent tasks with expected files, API contracts, edge cases, tests, rollback notes, and explicit no-write boundaries.",
    `Apply brand and governance constraints: ${input.brandConstraints || "brand, accessibility, performance, and approval rules must be declared before generation."}`,
    `Route integrations through ${integrationList}; every external write receives an approval gate and audit entry.`,
    `Measure success against: ${input.successMetric || "the accepted pilot success metric."}`,
    `Respect cost and model-use guardrail: ${input.budgetGuardrail || "deterministic rules first; AI only for grounded synthesis."}`
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
    `${pilotPlan.length} pilot phases generated.`
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
    implementationSpec,
    autonomyBoundaries,
    ragMap,
    toolPlan,
    backlogTasks: backlogTasksFor(input),
    architectureBlueprint,
    pilotPlan,
    roleFitMatrix,
    riskRegister,
    impactModel,
    architectureNotes: architectureNotesFor(input),
    evaluationPlan: evaluationPlanFor(input, scores),
    qaChecks,
    handoffNotes,
    interviewNarrative: interviewNarrativeFor(input, decisionMode),
    auditEvents
  };
}
