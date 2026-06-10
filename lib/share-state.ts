import { sanitizeWorkflowIntake } from "@/lib/intake-codec";
import type { WorkflowIntake } from "@/lib/compiler";

export const SHARE_HASH_KEY = "ax";

export function buildShareHash(intake: WorkflowIntake): string {
  return `#${SHARE_HASH_KEY}=${encodeURIComponent(JSON.stringify(intake))}`;
}

export function buildShareUrl(href: string, intake: WorkflowIntake): string {
  const url = new URL(href);
  url.hash = buildShareHash(intake).slice(1);

  return url.toString();
}

export function parseSharedIntake(hash: string): WorkflowIntake | null {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;

  if (!normalized) {
    return null;
  }

  const params = new URLSearchParams(normalized);
  const raw = params.get(SHARE_HASH_KEY);

  if (!raw) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  return sanitizeWorkflowIntake(parsed);
}
