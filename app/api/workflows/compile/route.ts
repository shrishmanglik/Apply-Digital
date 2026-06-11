import { buildCompileApiResponse } from "@/lib/backend-api";

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        error: "Request body must be valid JSON.",
        expected: "POST JSON shaped as { intake: WorkflowIntake }."
      },
      { status: 400 }
    );
  }

  const result = buildCompileApiResponse(payload);

  return Response.json(result.body, { status: result.status });
}
