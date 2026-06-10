import type {
  BusinessCase,
  MaturityScores,
  NextAction,
  Scores,
  WorkflowIntake
} from "@/lib/compiler";

export type ReadinessStatus = "ready" | "watch" | "blocked";

export type ReadinessDimension = {
  dimension: string;
  status: ReadinessStatus;
  score: number;
  owner: string;
  concern: string;
  evidence: string;
  nextMove: string;
};

function statusFor(score: number, blocked = false): ReadinessStatus {
  if (blocked || score < 54) {
    return "blocked";
  }

  if (score < 74) {
    return "watch";
  }

  return "ready";
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasBlockingAction(nextActions: NextAction[], id: string): boolean {
  return nextActions.some((action) => action.id === id && action.urgency === "now");
}

export function readinessBoardFor(
  input: WorkflowIntake,
  scores: Scores,
  maturity: MaturityScores,
  businessCase: BusinessCase,
  nextActions: NextAction[]
): ReadinessDimension[] {
  const sourceCoverage = clampScore(
    28 +
      input.sourceInputs.length * 7 +
      input.knowledgeSources.length * 5 +
      (input.componentNotes.trim() ? 10 : 0) +
      (input.brandConstraints.trim() ? 8 : 0)
  );
  const integrationCoverage = clampScore(
    36 +
      input.integrations.length * 7 +
      (input.sourceInputs.includes("API contract") ? 18 : 0) +
      (input.integrations.includes("Vector store") || input.integrations.includes("Vertex AI")
        ? 12
        : 0)
  );
  const adoptionScore = clampScore(
    38 +
      (input.audience.trim() ? 13 : 0) +
      (input.successMetric.trim() ? 20 : 0) +
      (input.deliveryStage !== "discovery" ? 8 : 0) +
      Math.min(input.channels.length * 3, 15)
  );
  const deliveryScore = clampScore(
    maturity.deliveryVelocity * 0.58 +
      scores.readiness * 0.24 +
      (100 - input.deadlinePressure) * 0.18
  );
  const valueIsFundable =
    businessCase.valueMultiple >= 2 &&
    businessCase.paybackWeeks <= 26 &&
    businessCase.annualValue >= businessCase.pilotInvestment;
  const openNowActions = nextActions.filter((action) => action.urgency === "now");

  return [
    {
      dimension: "Business case",
      status: statusFor(scores.businessValue, !valueIsFundable),
      score: scores.businessValue,
      owner: "Executive sponsor",
      concern: valueIsFundable
        ? `${businessCase.valueMultiple}x pilot multiple with ${businessCase.paybackWeeks} week payback.`
        : "Value model is not yet fundable enough for a confident pilot ask.",
      evidence: "Accepted volume, cycle-time, rework, launch-value, and pilot-budget assumptions.",
      nextMove: valueIsFundable
        ? "Use the value case in the sponsor memo."
        : "Pressure-test the value model with finance before pilot approval."
    },
    {
      dimension: "Source grounding",
      status: statusFor(sourceCoverage, hasBlockingAction(nextActions, "close-source-gaps")),
      score: sourceCoverage,
      owner: "Product owner and Apply solution architect",
      concern: `${input.sourceInputs.length} source inputs and ${input.knowledgeSources.length} knowledge sources declared.`,
      evidence: "Source contract with named owners, freshness rules, and retrieval use per source.",
      nextMove:
        sourceCoverage >= 74
          ? "Release the first bounded task batch from the source contract."
          : "Close source-packet gaps before coding-agent handoff."
    },
    {
      dimension: "Governance",
      status: statusFor(
        maturity.governanceConfidence,
        hasBlockingAction(nextActions, "mask-sensitive-data") ||
          hasBlockingAction(nextActions, "risk-review")
      ),
      score: maturity.governanceConfidence,
      owner: "Security, legal, and delivery owners",
      concern: `${input.dataSensitivity} sensitivity with ${input.approvalMode} approval posture and ${scores.risk}/100 risk.`,
      evidence: "Approval SLA, masking policy, risk register, and no autonomous external-write boundary.",
      nextMove:
        maturity.governanceConfidence >= 74 && scores.risk < 72
          ? "Confirm approval gates in the kickoff charter."
          : "Run governance review before configuring write or external-action tools."
    },
    {
      dimension: "Integration path",
      status: statusFor(
        integrationCoverage,
        hasBlockingAction(nextActions, "collect-api-contracts") ||
          hasBlockingAction(nextActions, "stand-up-retrieval")
      ),
      score: integrationCoverage,
      owner: "Platform architect",
      concern: `${input.integrations.length || "No"} integrations declared; API contract ${
        input.sourceInputs.includes("API contract") ? "present" : "missing"
      }.`,
      evidence: "Versioned API contracts, failure modes, tool scopes, and retrieval architecture.",
      nextMove:
        integrationCoverage >= 74
          ? "Map the tool plan to integration contracts and sandbox permissions."
          : "Collect contracts and retrieval architecture before implementation tasks are accepted."
    },
    {
      dimension: "Adoption",
      status: statusFor(adoptionScore, hasBlockingAction(nextActions, "accept-success-metric")),
      score: adoptionScore,
      owner: "Sponsor, product/CX, QA, and analytics owners",
      concern: input.successMetric
        ? `Pilot metric recorded: ${input.successMetric}`
        : "No accepted pilot metric is recorded.",
      evidence: "Sponsor metric, operating cadence, KPI dashboard, and owner commitment map.",
      nextMove:
        adoptionScore >= 74
          ? "Confirm dashboard ownership before kickoff."
          : "Accept the pilot metric and stakeholder cadence before budget approval."
    },
    {
      dimension: "Delivery runway",
      status: statusFor(deliveryScore, input.deadlinePressure >= 90),
      score: deliveryScore,
      owner: "Apply engagement lead",
      concern: `${input.deadlinePressure}/100 deadline pressure with ${openNowActions.length} blocking now action${openNowActions.length === 1 ? "" : "s"}.`,
      evidence: "30-day plan, scoped pilot slice, task batch, QA gate, rollback path, and decision calendar.",
      nextMove:
        deliveryScore >= 74 && openNowActions.length === 0
          ? "Book the pilot workshop and lock the first task batch."
          : "Reduce scope or clear now-actions before promising a launch date."
    }
  ];
}
