import type { BusinessCase, Scores, WorkflowIntake } from "@/lib/compiler";

export type ActionUrgency = "now" | "next" | "scheduled";

export type NextAction = {
  id: string;
  urgency: ActionUrgency;
  owner: string;
  action: string;
  rationale: string;
  evidenceRequired: string;
  dueWindow: string;
  successSignal: string;
};

const urgencyRank: Record<ActionUrgency, number> = {
  now: 0,
  next: 1,
  scheduled: 2
};

const MAX_QUEUE_LENGTH = 8;

function money(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
}

export function nextActionQueueFor(
  input: WorkflowIntake,
  scores: Scores,
  businessCase: BusinessCase
): NextAction[] {
  const queue: NextAction[] = [];
  const valueIsFundable =
    businessCase.valueMultiple >= 2 &&
    businessCase.paybackWeeks <= 26 &&
    businessCase.annualValue >= businessCase.pilotInvestment;

  if (!input.successMetric.trim()) {
    queue.push({
      id: "accept-success-metric",
      urgency: "now",
      owner: "Executive sponsor",
      action: "Accept one measurable pilot success metric before any agent work starts.",
      rationale: "No success metric is recorded, so the pilot cannot be stopped, scaled, or funded on evidence.",
      evidenceRequired: "Signed pilot charter naming the metric, baseline, target, and stop/scale rule.",
      dueWindow: "Before pilot approval",
      successSignal: "Sponsor restates the metric in the kickoff readout without prompting."
    });
  }

  if (input.dataSensitivity === "high") {
    queue.push({
      id: "mask-sensitive-data",
      urgency: "now",
      owner: "Security or privacy owner",
      action: "Approve masking, redaction, and tool-scope rules before any model-assisted drafting.",
      rationale: `Data sensitivity is rated high (${scores.dataSensitivity}/100 exposure), so unmasked drafting is a release blocker.`,
      evidenceRequired: "Masking policy, restricted field list, and least-privilege tool-scope sign-off.",
      dueWindow: "Before pilot approval",
      successSignal: "Security owner signs the data-handling boundary in the source contract."
    });
  }

  if (scores.risk >= 72) {
    queue.push({
      id: "risk-review",
      urgency: "now",
      owner: "Security, legal, and delivery owners",
      action: "Run a privacy, security, and approval-path review before any external action is configured.",
      rationale: `Composite risk is ${scores.risk}/100, above the 72 review threshold for this workflow.`,
      evidenceRequired: "Risk register with every open item owned, plus approval SLAs for gated actions.",
      dueWindow: "Before pilot approval",
      successSignal: "Risk register shows zero unowned blockers at the kickoff gate."
    });
  }

  if (scores.feasibility < 62 || input.sourceInputs.length < 4) {
    queue.push({
      id: "close-source-gaps",
      urgency: "now",
      owner: "Product owner and Apply solution architect",
      action: "Close source-packet gaps: owners, acceptance criteria, and missing inputs.",
      rationale: `Feasibility is ${scores.feasibility}/100 with ${input.sourceInputs.length} source inputs and ${input.knowledgeSources.length} knowledge sources declared.`,
      evidenceRequired: "Completed source contract with named owner and freshness rule per source.",
      dueWindow: "Before pilot approval",
      successSignal: "Recompiled feasibility clears 62 without changing governance settings."
    });
  }

  if (!valueIsFundable) {
    queue.push({
      id: "pressure-test-value-model",
      urgency: "now",
      owner: "Executive sponsor and Apply engagement lead",
      action: "Pressure-test the value model with finance before asking for pilot budget.",
      rationale: `Modeled value is ${money(businessCase.annualValue)} against a ${money(businessCase.pilotInvestment)} pilot (${businessCase.valueMultiple}x, ${businessCase.paybackWeeks} week payback), which is below a fundable threshold.`,
      evidenceRequired: "Validated volume, cycle-time, team-cost, and rework assumptions from client data.",
      dueWindow: "Before pilot approval",
      successSignal: "Sponsor accepts a value case with at least a 2x value-to-pilot multiple."
    });
  }

  queue.push({
    id: "confirm-source-owners",
    urgency: "next",
    owner: "Product owner and Apply solution architect",
    action: "Confirm a named owner, freshness rule, and approval gate for every declared source.",
    rationale: `${input.sourceInputs.length} source inputs and ${input.knowledgeSources.length} knowledge sources are declared; unowned sources stall agent task release.`,
    evidenceRequired: "Source contract with the owner and freshness columns complete for every input.",
    dueWindow: "Pilot week 1",
    successSignal: "No task packet ships without a source citation and a named owner."
  });

  if (!input.sourceInputs.includes("API contract")) {
    queue.push({
      id: "collect-api-contracts",
      urgency: "next",
      owner: "Engineering or architecture owner",
      action: "Provide API contracts for every integration the agents will read or draft against.",
      rationale: "API contract is missing from the source inputs, so integration boundaries cannot be verified.",
      evidenceRequired: "Versioned API contracts and an integration boundary map for declared systems.",
      dueWindow: "Pilot week 1",
      successSignal: "Every tool-plan action maps to a documented contract and failure mode."
    });
  }

  if (
    !input.integrations.includes("Vector store") &&
    !input.integrations.includes("Vertex AI")
  ) {
    queue.push({
      id: "stand-up-retrieval",
      urgency: "next",
      owner: "Platform architect",
      action: "Stand up retrieval architecture before treating generated specs as implementation-ready.",
      rationale: "No vector store or Vertex AI integration is declared, so task grounding relies on manual source packets.",
      evidenceRequired: "Retrieval pack with source coverage report and owner-approved freshness rules.",
      dueWindow: "Pilot week 2",
      successSignal: "Source-coverage eval passes on the first bounded task batch."
    });
  }

  if (input.approvalMode === "read-only") {
    queue.push({
      id: "define-write-path",
      urgency: "next",
      owner: "Delivery owner",
      action: "Define the human approval path for writes before the pilot needs one.",
      rationale: "The agent is read-only today; without a write-approval path the pilot stalls at its first real release.",
      evidenceRequired: "Approval routing with named approvers, SLA, and an exception escalation rule.",
      dueWindow: "Pilot week 1",
      successSignal: "First gated write completes inside the agreed approval SLA."
    });
  }

  if (input.knowledgeSources.length < 5) {
    queue.push({
      id: "map-knowledge-sources",
      urgency: "next",
      owner: "Product and content owners",
      action: "Map additional knowledge sources to owners, freshness rules, and guardrails.",
      rationale: `Only ${input.knowledgeSources.length} knowledge sources are declared; thin grounding raises hallucination and rework risk.`,
      evidenceRequired: "Knowledge-source map covering product, content, design, API, and governance inputs.",
      dueWindow: "Pilot week 1",
      successSignal: "Each first-batch task cites at least one owned knowledge source."
    });
  }

  if (input.deadlinePressure >= 80) {
    queue.push({
      id: "descope-pilot-slice",
      urgency: "next",
      owner: "Delivery owner",
      action: "Descope to one bounded workflow slice that survives the deadline.",
      rationale: `Deadline pressure is ${input.deadlinePressure}/100; broad scope under this pressure produces unreviewable agent output.`,
      evidenceRequired: "A one-slice scope note with explicit non-goals accepted by the sponsor.",
      dueWindow: "Pilot week 1",
      successSignal: "First task batch ships from the reduced slice with no scope rewrites."
    });
  }

  if (input.reworkRate >= 30) {
    queue.push({
      id: "baseline-rework",
      urgency: "next",
      owner: "QA and analytics owners",
      action: "Baseline current rework causes so the pilot can prove the reduction it claims.",
      rationale: `Reported rework rate is ${input.reworkRate}%; the value case leans on cutting it, so the baseline must be defensible.`,
      evidenceRequired: "Rework log by cause for the last delivery cycle, with owner attribution.",
      dueWindow: "Pilot week 1",
      successSignal: "Midpoint readout compares pilot rework against the recorded baseline."
    });
  }

  const openBlockers = queue.filter((action) => action.urgency === "now").length;

  if (scores.readiness >= 76 && valueIsFundable && openBlockers === 0) {
    queue.push({
      id: "sign-pilot-charter",
      urgency: "now",
      owner: "Executive sponsor",
      action: `Approve the ${money(businessCase.pilotInvestment)} pilot budget and sign the charter.`,
      rationale: `Readiness is ${scores.readiness}/100, the value multiple is ${businessCase.valueMultiple}x, and no blocking action is open, so the workflow is fundable as scoped.`,
      evidenceRequired: "Signed charter naming the sponsor, budget, workflow slice, and stop/scale metric.",
      dueWindow: "Within 5 business days",
      successSignal: "Pilot kickoff is booked with budget and metric accepted."
    });
    queue.push({
      id: "book-kickoff-workshop",
      urgency: "scheduled",
      owner: "Apply engagement lead",
      action: "Book the 90-minute workflow-mapping workshop and lock the pilot start date.",
      rationale: `Readiness is ${scores.readiness}/100, above the 76 pilot threshold, so the next constraint is calendar, not evidence.`,
      evidenceRequired: "Workshop invite with sponsor, product, brand/legal, engineering, QA, and analytics owners confirmed.",
      dueWindow: "Within 5 business days",
      successSignal: "Workshop ends with source owners, boundaries, and approval gates on one page."
    });
  } else {
    queue.push({
      id: "run-discovery-sprint",
      urgency: "scheduled",
      owner: "Apply engagement lead",
      action: "Run a 5-day source and governance discovery sprint before asking for pilot budget.",
      rationale:
        scores.readiness < 76
          ? `Readiness is ${scores.readiness}/100, below the 76 pilot threshold, so discovery is cheaper than a stalled pilot.`
          : `${openBlockers || "Value-model"} blocking item${openBlockers === 1 ? "" : "s"} must close before a credible budget ask; a discovery sprint closes them fastest.`,
      evidenceRequired: "Discovery readout with the re-scored workflow and the gap list that moved it.",
      dueWindow: "Within 10 business days",
      successSignal: "Re-scored readiness clears 76 with no open blocking actions."
    });
  }

  return queue
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, MAX_QUEUE_LENGTH);
}
