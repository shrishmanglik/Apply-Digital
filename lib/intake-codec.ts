import {
  createDefaultIntake,
  type ApprovalMode,
  type DataSensitivity,
  type DeliveryStage,
  type WorkflowIntake
} from "@/lib/compiler";

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

export function sanitizeWorkflowIntake(value: unknown): WorkflowIntake | null {
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
