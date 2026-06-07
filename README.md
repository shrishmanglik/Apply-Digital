# AX Spec Compiler

Role-specific prototype for Apply Digital's Solution Architect, Agentic Engineering opening.

The demo converts product, UX, content, component, brand, and integration inputs into:

- Apply Digital-relevant scenario presets
- coding-agent-ready implementation specs
- business value, feasibility, risk, and data-sensitivity scores
- RAG and knowledge-source maps
- tool/API action plans with human approval gates
- first-batch backlog tasks and architecture notes
- QA and evaluation checklists
- release, owner handoff, and interview walkthrough notes

## Why this prototype exists

Apply Digital's role asks for someone who can translate backlog, UX, content, component, and brand inputs into spec-driven requirements for coding agents while keeping enterprise controls intact. This prototype shows that operating model in a compact, deterministic interface.

## Implementation

- Next.js 16 and React 19
- TypeScript
- Deterministic rules and templates in `lib/compiler.ts`
- No runtime AI calls
- No data persistence
- Pure CSS visuals only; no generated image assets
- Vitest unit coverage and Playwright browser smoke coverage

## Local run

```bash
npm install
npm run dev
```

## Verification

```bash
npm run test
npm run build
npm run test:e2e
```

The E2E suite uses Playwright without screenshot generation.
