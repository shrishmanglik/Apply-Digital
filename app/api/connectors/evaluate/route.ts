import { buildConnectorWorkerResponse } from "@/lib/connector-worker-api";

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        error: "Request body must be valid JSON.",
        expected: "POST JSON shaped as { intake: WorkflowIntake, system?: string }."
      },
      { status: 400 }
    );
  }

  const result = buildConnectorWorkerResponse(payload);

  return Response.json(result.body, { status: result.status });
}
