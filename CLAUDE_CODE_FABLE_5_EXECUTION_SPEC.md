# Claude Code Fable 5 Execution Spec

Date: 2026-06-10

Sprint window: 2026-06-10 through 2026-06-22

Primary objective: use Claude Code with Claude Fable 5 to turn this Apply Digital prototype into a client-ready agentic CX accelerator that feels fundable, demoable, and production-minded.

## Sprint Progress

- Sprint 1 shipped exportable client packets, local scenario save/restore/compare, and deterministic next-action queues.
- Sprint 2 shipped the client readiness board, shareable URL intake state, and five-minute demo mode.
- Sprint 3 shipped deterministic connector contracts, eval telemetry, and release gates inside the production control plane.
- Sprint 4 shipped the agentic delivery factory: issue-ready work orders, evidence ledger, and JSON work-order export.
- Sprint 5 shipped the enterprise workspace control room: tenant model, role access, environment promotion, collaboration cadence, audit streams, escalation path, and workspace readiness.
- Sprint 6 shipped the backend migration kit: persistent entities, API routes, events, webhooks, auth groups, deployment gates, and backend blueprint JSON export.
- Remaining major productization frontier: implementing the real backend service, authenticated workspace execution, real connector workers, persistent eval telemetry, and controlled runtime AI synthesis if explicitly approved.

## Access Note

Anthropic's public materials describe Claude Fable 5 as a broadly available model for ambitious long-running projects. Public coverage says subscription access is available through June 22, 2026 for eligible plans before paid usage credits begin. Anthropic also describes Claude Mythos 5 as limited availability for vetted partners, so this sprint should assume Fable 5 in Claude Code unless the user has explicit Mythos access in the product picker.

Reference links:

- Anthropic Fable page: `https://www.anthropic.com/claude/fable`
- Anthropic Fable/Mythos launch note: `https://www.anthropic.com/news/claude-fable-5-mythos-5`
- Subscription access coverage: `https://techcrunch.com/2026/06/09/anthropics-claude-fable-5-is-a-version-of-mythos-the-public-can-access-today/`

## Product Mission

Make the Apply Digital AX Spec Compiler feel like software a VP of Client Services, enterprise client sponsor, solution architect, and engineering lead would all want in the room.

The product should not behave like an open-ended chatbot. It should behave like a governed engagement workspace:

- convert client workflow inputs into a decision memo, value case, implementation contract, and launch plan
- expose the assumptions and evidence required before coding agents receive work
- show measurable commercial upside and delivery readiness
- keep approvals, sensitive data, brand/legal checks, and external writes human-gated
- produce artifacts that are useful in an Apply Digital sales, discovery, or delivery conversation

## Current Context

- Local repo: `E:\Million Dollar AI Studio\Job Applications\applications\apply-digital_solution-architect-agentic-engineering_2026-06-05`
- GitHub repo: `https://github.com/shrishmanglik/Apply-Digital`
- Live site: `https://apply-digitalsolution-architect-age.vercel.app`
- Vercel scope: `shrish-mangliks-projects`
- Stack: Next.js 16, React 19, TypeScript, Vitest, Playwright, Vercel
- Core compiler: `lib/compiler.ts`
- Main UI: `components/spec-compiler.tsx`
- Current branch pattern: `codex/*`

## Non-Negotiable Constraints

Read `AGENTS.md` before editing.

- Do not use image-generation tools or image APIs.
- Do not create generated bitmap, WebP, PNG, or SVG-raster assets.
- Use pure CSS or existing committed assets for any visual treatment.
- Keep the app deterministic unless explicitly asked to add runtime AI.
- Do not add secrets, private keys, or vendor credentials.
- For product or code changes, run `npm.cmd run verify` before pushing.
- For documentation-only changes, review `git status` and `git diff` before committing.
- Every update must be committed and pushed to `shrishmanglik/Apply-Digital`.
- Redeploy to Vercel when a change affects the live product experience.

Use `npm.cmd` in PowerShell because `npm.ps1` can be blocked by local execution policy.

Production deploy command:

```powershell
npx.cmd --yes vercel@latest deploy --prod --yes --scope shrish-mangliks-projects
```

## Claude Code Operating Protocol

Start every session with:

```powershell
git status --short --branch
Get-Content AGENTS.md
Get-Content README.md
Get-Content package.json
Get-Content lib/compiler.ts
Get-Content components/spec-compiler.tsx
```

Then inspect tests:

```powershell
Get-ChildItem tests -Recurse
```

Work in this order:

1. Audit from the client buyer's point of view.
2. Pick the highest-value improvements that can ship cleanly in one session.
3. Implement narrowly and in the existing style.
4. Add or update focused tests for new behavior.
5. Update README and this spec if the operating model changes.
6. Run `npm.cmd run verify`.
7. Review `git status --short` and `git diff --stat`.
8. Commit intended files only.
9. Push the active branch to GitHub.
10. If product code changed, deploy to Vercel and smoke test the live URL.

## First Claude Code Prompt

Paste this into Claude Code with Claude Fable 5 selected:

```text
You are working in E:\Million Dollar AI Studio\Job Applications\applications\apply-digital_solution-architect-agentic-engineering_2026-06-05.

Read AGENTS.md, README.md, package.json, lib/compiler.ts, components/spec-compiler.tsx, and the tests before editing.

Mission: elevate this Apply Digital AX Spec Compiler from a strong prototype into a client-ready agentic CX engagement workspace. Review it as:
- Apply Digital VP Client Services
- enterprise CPG/retail client sponsor
- solution architect
- security/governance lead
- delivery manager responsible for a 30-day pilot

Identify the top blockers that would prevent a client or Apply Digital leader from funding, using, or trusting this system. Then implement the top three improvements that create the most client value without adding runtime AI, secrets, backend persistence, generated images, screenshots, videos, or new unsafe capabilities.

Prioritize these outcomes:
1. The product creates exportable client artifacts, not just on-screen views.
2. The user can save, restore, and compare scenario configurations locally.
3. The system produces a prioritized next-action queue tied to readiness gaps, risk, owners, and evidence.
4. The UI feels calm, executive-ready, and easier to demo in five minutes.
5. The README clearly explains how to use, verify, deploy, and position the product.

Constraints:
- No image generation or generated bitmap/WebP/PNG/SVG-raster assets.
- Use pure CSS only for visual treatments.
- Keep logic deterministic.
- Preserve existing app tone and Apply Digital positioning.
- Use npm.cmd on Windows.
- Run npm.cmd run verify before pushing.
- Commit intended files and push to shrishmanglik/Apply-Digital.
- If product behavior changed, deploy with:
  npx.cmd --yes vercel@latest deploy --prod --yes --scope shrish-mangliks-projects

Definition of done:
- A client can select a scenario, tune the intake, view the value case/client plan, export or copy a client packet, save/restore the scenario, and see a practical next-action queue.
- Focused unit/browser tests cover the new behavior.
- README and product docs are updated.
- npm.cmd run verify passes or a blocker is documented.
- Changes are committed, pushed, and deployed if product code changed.
```

## Highest-Value Backlog

### Epic 1: Exportable Client Packet

Build a deterministic artifact generator that turns the current compiled output into a clean Markdown packet.

Acceptance criteria:

- Add `Copy packet` and `Download .md` actions.
- Packet includes executive brief, value case, client decision memo, architecture summary, readiness scores, risks, QA gates, and next actions.
- Browser-only implementation; no backend, no runtime AI, no generated files except the user's downloaded Markdown.
- Add tests for packet content and download/copy affordances.

Why it matters: Apply Digital does not need another dashboard. It needs client artifacts that can move through sponsor, legal, engineering, and delivery conversations.

### Epic 2: Scenario Save, Restore, and Compare

Let users save multiple local scenario snapshots and compare the current intake against a saved snapshot.

Acceptance criteria:

- Save snapshots to `localStorage`.
- Restore and delete snapshots.
- Compare current vs saved scenario for readiness, value, risk, governance, and autonomy recommendation.
- Include a reset path back to the selected preset.
- Add Playwright coverage for save and restore.

Why it matters: real client discovery is iterative. The product becomes a working session tool, not a static demo.

### Epic 3: Next-Action Queue

Generate a prioritized queue of client and Apply Digital actions from the weakest readiness dimensions, highest risks, missing source inputs, and governance posture.

Acceptance criteria:

- Each action has owner, action, rationale, evidence required, due window, and success signal.
- Actions should be deterministic and directly traceable to intake values.
- Surface the queue in the Client Plan or Command Brief area.
- Add unit tests for at least three scenario/risk combinations.

Why it matters: buyers fund the next step when the next step is obvious, accountable, and measurable.

### Epic 4: Readiness Board

Add a concise readiness board that separates business, data, governance, integration, adoption, and delivery readiness.

Acceptance criteria:

- Use existing scores where possible.
- Show status, concern, evidence, and owner.
- Avoid adding a cluttered new page; integrate into the current flow.

Why it matters: a sponsor wants to know whether this is ready to pilot, not only whether the idea sounds impressive.

### Epic 5: Shareable State

Add share-link support using URL hash or query encoding for the intake state.

Acceptance criteria:

- `Copy share link` encodes the current intake.
- Loading the URL restores that intake.
- Invalid or stale state fails gracefully back to a preset.
- No server persistence.

Why it matters: client teams collaborate asynchronously.

### Epic 6: Five-Minute Demo Mode

Make the product easy to present live.

Acceptance criteria:

- Add a guided path or tighter walkthrough that covers problem, value, governance, architecture, action plan, and role proof in five minutes.
- Keep visible text useful rather than instructional filler.
- Make mobile and desktop layouts comfortable.

Why it matters: this is a job-application prototype and a product pitch. The first five minutes must land.

### Epic 7: Compiler Refactor

If the compiler has become hard to extend, split it into focused deterministic modules.

Potential modules:

- `lib/scenarios.ts`
- `lib/scoring.ts`
- `lib/value-case.ts`
- `lib/client-plan.ts`
- `lib/action-queue.ts`
- `lib/export-packet.ts`
- `lib/types.ts`

Acceptance criteria:

- No behavioral regression.
- Existing public types remain easy to import.
- Unit tests cover moved logic.
- Refactor only where it reduces real complexity.

Why it matters: the prototype should look like it can become a maintainable accelerator, not a clever single-file demo.

### Epic 8: Deployment Polish

Keep GitHub and Vercel aligned.

Acceptance criteria:

- README reflects current behavior.
- `npm.cmd run verify` passes.
- Active branch pushed.
- Main branch updated when appropriate.
- Vercel production deploy completed for product changes.
- Live smoke test confirms the latest UI is available.

## Fable 5 Usage Pattern

Use Fable 5 for the work that benefits from long-context reasoning and careful critique:

- client POV product teardown
- architecture and domain-model review
- multi-file refactors
- test strategy
- README and positioning polish
- QA pass before deploy

Recommended critique prompt:

```text
Act as Apply Digital VP Client Services, Head of Engineering, Security Lead, and a retail/CPG client sponsor. Find the reasons this prototype would not be funded or trusted in a real client engagement. Convert each blocker into a concrete product improvement with acceptance criteria.
```

Recommended implementation prompt:

```text
Implement the top three fundability improvements. Keep the system deterministic, client-safe, and easy to demo. Add tests, update README, run verification, commit, push, and deploy if product behavior changed.
```

Recommended QA prompt:

```text
Review the implemented changes as if the live demo is being shown to Apply Digital tomorrow. Check UX clarity, broken states, mobile layout, deterministic logic, test gaps, README accuracy, and deployment readiness. Fix the issues you find before finalizing.
```

## Definition Of Done For This Sprint

The sprint is successful when:

- the live site helps a client team choose a workflow, understand value, identify risks, and commit to the next step
- the app produces a usable client packet that can be copied or downloaded
- scenario work can be saved, restored, compared, and shared
- next actions are specific, owned, evidence-based, and tied to readiness gaps
- README explains the product, features, usage, verification, deployment, and update process
- `npm.cmd run verify` passes
- changes are committed and pushed to GitHub
- Vercel is redeployed after product changes

## Anti-Goals

- Do not add real client data.
- Do not add runtime LLM calls unless explicitly requested later.
- Do not add authentication, billing, or database persistence in this sprint.
- Do not create generated images or screenshot/video artifacts.
- Do not create broad rewrites without tests.
- Do not weaken approval gates or suggest autonomous external writes.
