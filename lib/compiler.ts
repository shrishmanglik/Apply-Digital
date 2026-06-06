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

export type CompilerOutput = {
  title: string;
  summary: string;
  scores: Scores;
  implementationSpec: string[];
  autonomyBoundaries: string[];
  ragMap: RagSource[];
  toolPlan: ToolAction[];
  qaChecks: string[];
  handoffNotes: string[];
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

export function createDefaultIntake(): WorkflowIntake {
  return {
    ...defaultIntake,
    channels: [...defaultIntake.channels],
    sourceInputs: [...defaultIntake.sourceInputs],
    knowledgeSources: [...defaultIntake.knowledgeSources],
    integrations: [...defaultIntake.integrations]
  };
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

export function compileSpec(input: WorkflowIntake): CompilerOutput {
  const scores = scoreIntake(input);
  const sourceList = input.sourceInputs.join(", ") || "source package";
  const integrationList = input.integrations.join(", ") || "no external integrations";
  const channelList = input.channels.join(", ") || "single internal channel";
  const approval = approvalLabel(input.approvalMode);
  const sensitivity = sensitivityLabel(input.dataSensitivity);

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
    implementationSpec,
    autonomyBoundaries,
    ragMap,
    toolPlan,
    qaChecks,
    handoffNotes,
    auditEvents
  };
}
