import { createHash } from "node:crypto";
import { compileSpec, type WorkflowIntake } from "@/lib/compiler";
import { sanitizeWorkflowIntake } from "@/lib/intake-codec";

export type CompileApiSuccess = {
  ok: true;
  contractVersion: string;
  compiledHash: string;
  title: string;
  readiness: number;
  decisionMode: string;
  annualValue: number;
  valueMultiple: number;
  counts: {
    workOrders: number;
    releaseGates: number;
    connectorContracts: number;
    backendEntities: number;
    apiRoutes: number;
    webhooks: number;
    authGroups: number;
  };
  releaseGateStatuses: Array<{
    gate: string;
    status: string;
    owner: string;
  }>;
  nextActions: Array<{
    urgency: string;
    owner: string;
    action: string;
  }>;
};

export type CompileApiError = {
  ok: false;
  error: string;
  expected: string;
};

export type CompileApiResult = {
  status: number;
  body: CompileApiSuccess | CompileApiError;
};

const CONTRACT_VERSION = "ax-compile-api.v1";

function stableHash(intake: WorkflowIntake): string {
  return createHash("sha256")
    .update(`${CONTRACT_VERSION}:${JSON.stringify(intake)}`)
    .digest("hex")
    .slice(0, 16);
}

export function buildCompileApiResponse(payload: unknown): CompileApiResult {
  if (typeof payload !== "object" || payload === null || !("intake" in payload)) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "Missing workflow intake payload.",
        expected: "POST JSON shaped as { intake: WorkflowIntake }."
      }
    };
  }

  const intake = sanitizeWorkflowIntake((payload as { intake?: unknown }).intake);

  if (!intake) {
    return {
      status: 422,
      body: {
        ok: false,
        error: "Workflow intake failed schema validation.",
        expected:
          "A complete WorkflowIntake with strings, string arrays, finite numbers, and known enum values."
      }
    };
  }

  const output = compileSpec(intake);

  return {
    status: 200,
    body: {
      ok: true,
      contractVersion: CONTRACT_VERSION,
      compiledHash: stableHash(intake),
      title: output.title,
      readiness: output.scores.readiness,
      decisionMode: output.decisionMode,
      annualValue: output.businessCase.annualValue,
      valueMultiple: output.businessCase.valueMultiple,
      counts: {
        workOrders: output.agentWorkOrders.length,
        releaseGates: output.releaseGates.length,
        connectorContracts: output.connectorContracts.length,
        backendEntities: output.backendMigrationBlueprint.entities.length,
        apiRoutes: output.backendMigrationBlueprint.apiRoutes.length,
        webhooks: output.backendMigrationBlueprint.webhooks.length,
        authGroups: output.backendMigrationBlueprint.authGroups.length
      },
      releaseGateStatuses: output.releaseGates.map((gate) => ({
        gate: gate.gate,
        status: gate.status,
        owner: gate.owner
      })),
      nextActions: output.nextActionQueue.slice(0, 3).map((action) => ({
        urgency: action.urgency,
        owner: action.owner,
        action: action.action
      }))
    }
  };
}
