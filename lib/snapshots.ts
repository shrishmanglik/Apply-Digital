import {
  compileSpec,
  createDefaultIntake,
  type ApprovalMode,
  type DataSensitivity,
  type DeliveryStage,
  type WorkflowIntake
} from "@/lib/compiler";

export type ScenarioSnapshot = {
  id: string;
  name: string;
  savedAt: string;
  intake: WorkflowIntake;
};

export type ComparisonRow = {
  dimension: string;
  saved: string;
  current: string;
  shift: string;
};

export const SNAPSHOT_STORAGE_KEY = "ax-spec-compiler.snapshots.v1";
export const MAX_SNAPSHOTS = 8;

const dataSensitivityValues: DataSensitivity[] = ["low", "moderate", "high"];
const approvalModeValues: ApprovalMode[] = [
  "read-only",
  "human-before-write",
  "human-before-external"
];
const deliveryStageValues: DeliveryStage[] = ["discovery", "pilot", "scale"];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function sanitizeIntake(value: unknown): WorkflowIntake | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const intake = createDefaultIntake();

  const stringKeys = [
    "workflowName",
    "businessGoal",
    "audience",
    "industry",
    "componentNotes",
    "brandConstraints",
    "successMetric",
    "budgetGuardrail",
    "riskNotes"
  ] as const;

  for (const key of stringKeys) {
    if (typeof candidate[key] !== "string") {
      return null;
    }

    intake[key] = candidate[key] as string;
  }

  const listKeys = ["channels", "sourceInputs", "knowledgeSources", "integrations"] as const;

  for (const key of listKeys) {
    if (!isStringArray(candidate[key])) {
      return null;
    }

    intake[key] = [...(candidate[key] as string[])];
  }

  const numberKeys = [
    "deadlinePressure",
    "annualWorkflowVolume",
    "currentCycleDays",
    "targetCycleDays",
    "teamCostPerDay",
    "reworkRate",
    "launchValuePerDay",
    "pilotBudget"
  ] as const;

  for (const key of numberKeys) {
    if (typeof candidate[key] !== "number" || !Number.isFinite(candidate[key])) {
      return null;
    }

    intake[key] = candidate[key] as number;
  }

  if (!dataSensitivityValues.includes(candidate.dataSensitivity as DataSensitivity)) {
    return null;
  }

  if (!approvalModeValues.includes(candidate.approvalMode as ApprovalMode)) {
    return null;
  }

  if (!deliveryStageValues.includes(candidate.deliveryStage as DeliveryStage)) {
    return null;
  }

  intake.dataSensitivity = candidate.dataSensitivity as DataSensitivity;
  intake.approvalMode = candidate.approvalMode as ApprovalMode;
  intake.deliveryStage = candidate.deliveryStage as DeliveryStage;

  return intake;
}

export function parseSnapshots(raw: string | null): ScenarioSnapshot[] {
  if (!raw) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const snapshots: ScenarioSnapshot[] = [];

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const candidate = entry as Record<string, unknown>;

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.savedAt !== "string"
    ) {
      continue;
    }

    const intake = sanitizeIntake(candidate.intake);

    if (!intake) {
      continue;
    }

    snapshots.push({
      id: candidate.id,
      name: candidate.name,
      savedAt: candidate.savedAt,
      intake
    });
  }

  return snapshots.slice(0, MAX_SNAPSHOTS);
}

export function serializeSnapshots(snapshots: ScenarioSnapshot[]): string {
  return JSON.stringify(snapshots.slice(0, MAX_SNAPSHOTS));
}

function money(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
}

function scoreShift(saved: number, current: number, lowerIsBetter = false): string {
  const delta = current - saved;

  if (delta === 0) {
    return "unchanged";
  }

  const direction = delta > 0 ? `+${delta}` : `${delta}`;
  const improved = lowerIsBetter ? delta < 0 : delta > 0;

  return `${direction} (${improved ? "better" : "worse"})`;
}

function moneyShift(saved: number, current: number): string {
  const delta = current - saved;

  if (delta === 0) {
    return "unchanged";
  }

  return `${delta > 0 ? "+" : "-"}${money(Math.abs(delta))}`;
}

export function compareScenarios(
  saved: WorkflowIntake,
  current: WorkflowIntake
): ComparisonRow[] {
  const savedOutput = compileSpec(saved);
  const currentOutput = compileSpec(current);

  return [
    {
      dimension: "Readiness",
      saved: `${savedOutput.scores.readiness}/100`,
      current: `${currentOutput.scores.readiness}/100`,
      shift: scoreShift(savedOutput.scores.readiness, currentOutput.scores.readiness)
    },
    {
      dimension: "Business value",
      saved: `${savedOutput.scores.businessValue}/100`,
      current: `${currentOutput.scores.businessValue}/100`,
      shift: scoreShift(savedOutput.scores.businessValue, currentOutput.scores.businessValue)
    },
    {
      dimension: "Risk",
      saved: `${savedOutput.scores.risk}/100`,
      current: `${currentOutput.scores.risk}/100`,
      shift: scoreShift(savedOutput.scores.risk, currentOutput.scores.risk, true)
    },
    {
      dimension: "Governance confidence",
      saved: `${savedOutput.maturityScores.governanceConfidence}/100`,
      current: `${currentOutput.maturityScores.governanceConfidence}/100`,
      shift: scoreShift(
        savedOutput.maturityScores.governanceConfidence,
        currentOutput.maturityScores.governanceConfidence
      )
    },
    {
      dimension: "Modeled annual value",
      saved: money(savedOutput.businessCase.annualValue),
      current: money(currentOutput.businessCase.annualValue),
      shift: moneyShift(savedOutput.businessCase.annualValue, currentOutput.businessCase.annualValue)
    },
    {
      dimension: "Modeled payback",
      saved: `${savedOutput.businessCase.paybackWeeks} weeks`,
      current: `${currentOutput.businessCase.paybackWeeks} weeks`,
      shift:
        savedOutput.businessCase.paybackWeeks === currentOutput.businessCase.paybackWeeks
          ? "unchanged"
          : `${currentOutput.businessCase.paybackWeeks > savedOutput.businessCase.paybackWeeks ? "+" : ""}${
              Math.round(
                (currentOutput.businessCase.paybackWeeks - savedOutput.businessCase.paybackWeeks) * 10
              ) / 10
            } weeks`
    },
    {
      dimension: "Autonomy recommendation",
      saved: savedOutput.decisionMode,
      current: currentOutput.decisionMode,
      shift: savedOutput.decisionMode === currentOutput.decisionMode ? "unchanged" : "changed"
    },
    {
      dimension: "Approval model",
      saved: saved.approvalMode,
      current: current.approvalMode,
      shift: saved.approvalMode === current.approvalMode ? "unchanged" : "changed"
    }
  ];
}
