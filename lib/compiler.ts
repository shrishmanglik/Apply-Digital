export type DataSensitivity = "low" | "moderate" | "high";
export type ApprovalMode =
  | "read-only"
  | "human-before-write"
  | "human-before-external";

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
  deadlinePressure: number;
  riskNotes: string;
};

export type Scores = {
  businessValue: number;
  feasibility: number;
  risk: number;
  dataSensitivity: number;
  readiness: number;
};

export type RagSource = {
  source: string;
  owner: string;
  freshness: string;
  retrievalUse: string;
};

export type ToolAction = {
  action: string;
  system: string;
  autonomy: string;
  approvalGate: string;
};

export type BacklogTask = {
  workstream: string;
  owner: string;
  task: string;
  acceptanceCriteria: string;
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
  decisionMode: string;
  nextBestAction: string;
  riskPosture: string;
  implementationSpec: string[];
  autonomyBoundaries: string[];
  ragMap: RagSource[];
  toolPlan: ToolAction[];
  backlogTasks: BacklogTask[];
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
  "Search",
  "Email",
  "Support",
  "Analytics",
  "Internal ops"
];

export const sourceInputOptions = [
  "User stories",
  "Sitemap",
  "Content model",
  "Design system",
  "Brand strategy",
  "API contract",
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
  "Release history"
];

export const integrationOptions = [
  "Contentful",
  "Contentstack",
  "Algolia",
  "Cloudinary",
  "Vertex AI",
  "CRM",
  "Data warehouse",
  "GCP Pub/Sub"
];

export const defaultIntake: WorkflowIntake = {
  workflowName: "Retail campaign-to-code spec workflow",
  businessGoal:
    "Turn a seasonal retail campaign brief into a governed implementation spec for coding agents, with SEO/GEO, accessibility, and content approval gates.",
  audience: "Product, UX, content, engineering, and delivery leads",
  industry: "Retail and consumer brands",
  channels: ["Web", "CMS", "Search", "Analytics"],
  sourceInputs: [
    "User stories",
    "Sitemap",
    "Content model",
    "Design system",
    "Brand strategy",
    "Analytics goals"
  ],
  componentNotes:
    "Campaign landing page, product teaser rail, content blocks, search-index metadata, and analytics events.",
  brandConstraints:
    "Respect brand voice, design token usage, performance budget, WCAG AA, and no unapproved customer-facing copy.",
  knowledgeSources: [
    "Product requirements",
    "Content guidelines",
    "Design tokens",
    "SEO/GEO rules",
    "Accessibility standards",
    "Release history"
  ],
  integrations: ["Contentful", "Algolia", "Cloudinary", "Data warehouse"],
  dataSensitivity: "moderate",
  approvalMode: "human-before-external",
  deadlinePressure: 62,
  riskNotes:
    "Customer-facing copy, search metadata, and analytics events require named owner approval before release."
};

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "retail-campaign",
    label: "Retail campaign",
    summary: "Campaign brief to coding-agent task packet for a commerce CX launch.",
    intake: defaultIntake
  },
  {
    id: "sports-media",
    label: "Sports media",
    summary: "Matchday content operations workflow with CMS, search, and analytics gates.",
    intake: {
      workflowName: "Sports media matchday content ops",
      businessGoal:
        "Convert a matchday content operations brief into approved coding-agent tasks for web, CMS, search, and analytics delivery without autonomous publishing.",
      audience: "Content strategy, product, engineering, search, and delivery leads",
      industry: "Sports and media brands",
      channels: ["Web", "CMS", "Search", "Analytics", "Support"],
      sourceInputs: [
        "User stories",
        "Sitemap",
        "Content model",
        "Design system",
        "Brand strategy",
        "API contract",
        "Analytics goals"
      ],
      componentNotes:
        "Live event hub, editorial content modules, schedule rail, search metadata, and analytics event taxonomy.",
      brandConstraints:
        "Protect editorial voice, rights-sensitive content, accessibility, performance budget, and approval before publish.",
      knowledgeSources: [
        "Product requirements",
        "Content guidelines",
        "Design tokens",
        "API documentation",
        "SEO/GEO rules",
        "Release history"
      ],
      integrations: ["Contentful", "Algolia", "Cloudinary", "Data warehouse", "GCP Pub/Sub"],
      dataSensitivity: "moderate",
      approvalMode: "human-before-external",
      deadlinePressure: 78,
      riskNotes:
        "Schedule changes, rights-sensitive content, and live-event metadata need owner review before release."
    }
  },
  {
    id: "cpg-content",
    label: "CPG content",
    summary: "Product content governance workflow for regulated claims and reusable CMS models.",
    intake: {
      workflowName: "CPG product content governance",
      businessGoal:
        "Translate product, legal, content, and brand inputs into governed specs for coding agents while preserving claim review and search quality.",
      audience: "Brand, legal, content, product, engineering, and analytics owners",
      industry: "CPG and food brands",
      channels: ["Web", "CMS", "Search", "Email", "Analytics"],
      sourceInputs: [
        "User stories",
        "Content model",
        "Brand strategy",
        "Security rules",
        "Analytics goals"
      ],
      componentNotes:
        "Product detail content blocks, claim callouts, comparison modules, structured metadata, and reusable CMS fields.",
      brandConstraints:
        "No unapproved claims, no off-brand substitutions, WCAG AA, reusable content model, and human approval before customer-facing copy.",
      knowledgeSources: [
        "Product requirements",
        "Content guidelines",
        "SEO/GEO rules",
        "Accessibility standards",
        "Release history"
      ],
      integrations: ["Contentstack", "Algolia", "CRM", "Data warehouse"],
      dataSensitivity: "high",
      approvalMode: "human-before-external",
      deadlinePressure: 58,
      riskNotes:
        "Claims, regional content variants, and lifecycle status must be reviewed before customer-facing release."
    }
  },
  {
    id: "internal-platform",
    label: "Internal platform",
    summary: "Internal agentic delivery desk for backlog translation and multi-team handoff.",
    intake: {
      workflowName: "Internal agentic delivery desk",
      businessGoal:
        "Turn product, UX, content, and architecture backlog inputs into governed coding-agent task sets across concurrent delivery teams.",
      audience: "Product, delivery, architecture, engineering managers, and technical leads",
      industry: "Internal platform and shared services",
      channels: ["Internal ops", "Analytics", "Support"],
      sourceInputs: [
        "User stories",
        "Design system",
        "API contract",
        "Security rules",
        "Analytics goals"
      ],
      componentNotes:
        "Backlog intake, task boundary editor, owner assignment, risk register, and release handoff packet.",
      brandConstraints:
        "Deterministic first, audit every handoff, enforce owner assignment, and block ambiguous autonomous actions.",
      knowledgeSources: [
        "Product requirements",
        "Design tokens",
        "API documentation",
        "Accessibility standards",
        "Release history"
      ],
      integrations: ["GCP Pub/Sub", "Data warehouse", "CRM"],
      dataSensitivity: "moderate",
      approvalMode: "human-before-write",
      deadlinePressure: 46,
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

export function scoreIntake(input: WorkflowIntake): Scores {
  const valueTerms = termCount(input.businessGoal, [
    "revenue",
    "conversion",
    "customer",
    "campaign",
    "velocity",
    "seo",
    "geo",
    "accessibility",
    "approval",
    "support"
  ]);
  const completeness =
    (hasValue(input.workflowName) ? 8 : 0) +
    (hasValue(input.businessGoal) ? 10 : 0) +
    (hasValue(input.componentNotes) ? 7 : 0) +
    (hasValue(input.brandConstraints) ? 7 : 0) +
    Math.min(input.sourceInputs.length * 3, 18) +
    Math.min(input.knowledgeSources.length * 3, 18);
  const integrationLoad = Math.max(0, input.integrations.length - 3) * 4;
  const sensitivityPenalty =
    input.dataSensitivity === "high" ? 20 : input.dataSensitivity === "moderate" ? 9 : 0;
  const approvalPenalty =
    input.approvalMode === "read-only"
      ? 0
      : input.approvalMode === "human-before-write"
        ? 4
        : 8;

  const businessValue = clampScore(
    42 +
      valueTerms * 6 +
      Math.min(input.channels.length * 3, 18) +
      Math.round(input.deadlinePressure / 8)
  );
  const feasibility = clampScore(
    38 +
      completeness -
      integrationLoad -
      sensitivityPenalty -
      Math.round(input.deadlinePressure / 12)
  );
  const risk = clampScore(
    20 +
      sensitivityPenalty +
      approvalPenalty +
      integrationLoad +
      Math.round(input.deadlinePressure / 9) +
      (hasValue(input.riskNotes) ? 8 : 0)
  );
  const dataSensitivity = clampScore(
    input.dataSensitivity === "high" ? 88 : input.dataSensitivity === "moderate" ? 58 : 24
  );
  const readiness = clampScore(
    businessValue * 0.32 + feasibility * 0.38 + (100 - risk) * 0.3
  );

  return {
    businessValue,
    feasibility,
    risk,
    dataSensitivity,
    readiness
  };
}

function ownerForSource(source: string): string {
  if (source.includes("Design") || source.includes("Accessibility")) {
    return "UX or design-system owner";
  }

  if (source.includes("Content") || source.includes("SEO")) {
    return "Content strategy owner";
  }

  if (source.includes("API") || source.includes("Release")) {
    return "Engineering owner";
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
    return "Human-led, agent-drafted";
  }

  if (scores.readiness >= 72 && scores.feasibility >= 70) {
    return "Agent-assisted build ready";
  }

  return "Discovery sprint before agent handoff";
}

function nextBestActionFor(input: WorkflowIntake, scores: Scores): string {
  if (scores.feasibility < 60) {
    return "Clarify source packet, owners, and acceptance criteria before task release.";
  }

  if (scores.risk >= 72) {
    return "Run privacy, security, and approval review before any external action.";
  }

  if (input.knowledgeSources.length < 4) {
    return "Add knowledge sources before treating generated specs as implementation-ready.";
  }

  return "Package the first bounded coding-agent task set and assign owner review.";
}

function riskPostureFor(input: WorkflowIntake, scores: Scores): string {
  if (input.dataSensitivity === "high") {
    return "Tight governance: mask data, require named approvals, and keep agents draft-only.";
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
      workstream: "Spec foundation",
      owner: "Product architect",
      task: "Create normalized implementation brief from intake sources.",
      acceptanceCriteria:
        "Brief includes goal, owners, non-goals, assumptions, source links, and task boundaries."
    },
    {
      workstream: "Experience contract",
      owner: "UX and content owners",
      task: `Map ${channels} requirements into components, content slots, metadata, and approval states.`,
      acceptanceCriteria:
        "Every component and content slot has owner, state, accessibility requirement, and release condition."
    },
    {
      workstream: "Integration plan",
      owner: "Technical lead",
      task: `Define read, write, cache, queue, and failure handling for ${integrations}.`,
      acceptanceCriteria:
        "External writes are gated; read paths, retries, rollback notes, and audit events are explicit."
    },
    {
      workstream: "Evaluation harness",
      owner: "QA lead",
      task: "Build deterministic checks for accessibility, SEO/GEO, performance, security, and agent boundaries.",
      acceptanceCriteria:
        "Critical checks run before release and produce owner-readable pass/fail evidence."
    },
    {
      workstream: "Release packet",
      owner: "Delivery owner",
      task: "Prepare handoff notes, open risks, and first production-safe task batch.",
      acceptanceCriteria:
        "Business, technical, and QA owners can accept or reject the release packet without a clarification meeting."
    }
  ];
}

function architectureNotesFor(input: WorkflowIntake): string[] {
  const externalSystems = input.integrations.length > 0 ? input.integrations.join(", ") : "none";

  return [
    "Keep the compiler deterministic: rules and templates produce the packet; LLMs may draft language only after source grounding.",
    `Treat integrations as explicit boundaries: ${externalSystems}. Reads may be autonomous; writes need approval gates.`,
    "Use a queue for long-running content, search, media, or analytics jobs so coding agents do not block user-facing flows.",
    "Cache source packets and retrieval results per campaign/sprint to reduce repeated lookups and make audit replay possible.",
    "Store audit events for source normalization, score changes, owner approvals, task release, and release handoff."
  ];
}

function evaluationPlanFor(input: WorkflowIntake, scores: Scores): string[] {
  const sensitivityCheck =
    input.dataSensitivity === "high"
      ? "Verify masking/redaction before any model-assisted draft or external tool call."
      : "Verify source traceability and approval gates before release.";

  return [
    `Readiness threshold: ship only when readiness is at least 70 or the delivery owner explicitly accepts a ${scores.readiness} score.`,
    sensitivityCheck,
    "Compare generated tasks against source inputs; fail if any task lacks owner, file/surface, acceptance criteria, or non-goal.",
    "Run accessibility, SEO/GEO, and performance checks on the generated implementation plan before coding-agent execution.",
    "Review agent failure modes: source conflict, missing owner, integration outage, ambiguous brand rule, and risky external action."
  ];
}

function interviewNarrativeFor(input: WorkflowIntake, outputMode: string): string[] {
  return [
    `Opening: frame "${input.workflowName}" as an ACx workflow where speed only matters if governance survives handoff.`,
    "Whiteboard: draw the path from source inputs to score, source map, task packet, QA gate, and owner handoff.",
    `Architecture point: ${outputMode} is the safe autonomy level for this slice.`,
    "Risk-control point: deterministic rules handle scoring, boundaries, and QA; LLMs are optional drafting helpers, not the control plane.",
    "Close: ask which Apply Digital client workflow has the highest value and lowest governance ambiguity for a first pilot."
  ];
}

export function compileSpec(input: WorkflowIntake): CompilerOutput {
  const scores = scoreIntake(input);
  const sourceList = input.sourceInputs.join(", ") || "source package";
  const integrationList = input.integrations.join(", ") || "no external integrations";
  const channelList = input.channels.join(", ") || "single internal channel";
  const approval = approvalLabel(input.approvalMode);
  const sensitivity = sensitivityLabel(input.dataSensitivity);
  const decisionMode = decisionModeFor(input, scores);
  const nextBestAction = nextBestActionFor(input, scores);
  const riskPosture = riskPostureFor(input, scores);

  const implementationSpec = [
    `Normalize intake from ${sourceList} into a single implementation brief with owner, acceptance criteria, and unresolved assumptions.`,
    `Map ${channelList} requirements into page, component, API, content, analytics, accessibility, and release workstreams.`,
    `Generate coding-agent tasks with explicit inputs, expected files, non-goals, edge cases, and rollback notes.`,
    `Apply brand constraints: ${input.brandConstraints || "brand, accessibility, and performance rules must be declared before generation."}`,
    `Route integrations through ${integrationList}; every external write receives an approval gate and audit entry.`
  ];

  const autonomyBoundaries = [
    `${approval}; no autonomous publishing, customer messaging, pricing changes, or production writes.`,
    `${sensitivity} workflow; customer, employee, financial, or regulated data is masked before any drafting step.`,
    "Coding agents receive bounded specs, not open-ended business goals.",
    "Search metadata, content, accessibility, and analytics changes require named owner sign-off before release.",
    "If source inputs conflict, the compiler emits an assumption register instead of resolving by preference."
  ];

  const ragMap =
    input.knowledgeSources.length > 0
      ? input.knowledgeSources.map((source) => ({
          source,
          owner: ownerForSource(source),
          freshness: source.includes("Release") ? "Per deployment" : "Per campaign or sprint",
          retrievalUse: `Ground ${source.toLowerCase()} references for task drafting and QA checks.`
        }))
      : [
          {
            source: "Manual source packet",
            owner: "Product owner",
            freshness: "Per request",
            retrievalUse: "Ground agent tasks before any draft output is accepted."
          }
        ];

  const toolPlan = [
    {
      action: "Read source package",
      system: "CMS, product tracker, design handoff, and repository docs",
      autonomy: "Autonomous read",
      approvalGate: "Source owner confirms scope"
    },
    {
      action: "Draft implementation spec",
      system: "Deterministic template compiler",
      autonomy: "Autonomous draft",
      approvalGate: "Product and engineering review"
    },
    {
      action: "Prepare coding-agent task set",
      system: "GitHub issues or backlog export",
      autonomy: "Draft only",
      approvalGate: "Tech lead accepts task boundaries"
    },
    {
      action: "Plan integration work",
      system: integrationList,
      autonomy: "Read or sandbox only",
      approvalGate: "Human before write, publish, delete, or notify"
    },
    {
      action: "Emit release packet",
      system: "QA checklist, handoff notes, audit log",
      autonomy: "Draft only",
      approvalGate: "Delivery owner signs release"
    }
  ];

  const qaChecks = [
    "Spec completeness: every story has owner, input, output, acceptance criteria, and non-goal.",
    "Accessibility: WCAG AA contrast, semantic structure, keyboard flow, alt text policy, and reduced-motion behavior.",
    "SEO/GEO: canonical metadata, structured content fields, indexability, content source traceability, and human copy approval.",
    "Performance: media budget, Core Web Vitals risk, cache plan, and search indexing latency.",
    "Security and privacy: sensitive data masking, least-privilege tool access, audit log coverage, and no secrets in specs.",
    "Agent reliability: bounded tasks, retry rules, failure states, assumption register, and handoff notes for unresolved conflicts."
  ];

  const handoffNotes = [
    `Business owner: validate that "${input.businessGoal || input.workflowName}" is the highest-value workflow slice.`,
    "Delivery owner: confirm sprint fit, dependencies, and which tasks are safe for coding-agent execution.",
    "Technical owner: review integration writes, API contracts, queue/cache assumptions, and rollback path.",
    "QA owner: run accessibility, performance, security, and release-readiness checks before production handoff.",
    "Interview walkthrough: use the compiler output as a whiteboard artifact for autonomy, governance, and business-value tradeoffs."
  ];

  const auditEvents = [
    "Input normalized through deterministic rules.",
    `Scores computed: value ${scores.businessValue}, feasibility ${scores.feasibility}, risk ${scores.risk}, readiness ${scores.readiness}.`,
    `${autonomyBoundaries.length} autonomy boundaries emitted.`,
    `${ragMap.length} knowledge sources mapped.`,
    `${qaChecks.length} QA checks prepared.`
  ];

  return {
    title: input.workflowName || "Untitled AX workflow",
    summary:
      input.businessGoal ||
      "A governed agentic workflow that converts source inputs into implementation-ready delivery artifacts.",
    scores,
    decisionMode,
    nextBestAction,
    riskPosture,
    implementationSpec,
    autonomyBoundaries,
    ragMap,
    toolPlan,
    backlogTasks: backlogTasksFor(input),
    architectureNotes: architectureNotesFor(input),
    evaluationPlan: evaluationPlanFor(input, scores),
    qaChecks,
    handoffNotes,
    interviewNarrative: interviewNarrativeFor(input, decisionMode),
    auditEvents
  };
}
