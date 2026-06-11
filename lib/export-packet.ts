import type { CompilerOutput, WorkflowIntake } from "@/lib/compiler";

function money(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
}

function cell(value: string | number): string {
  return String(value).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function table(headers: string[], rows: Array<Array<string | number>>): string {
  const head = `| ${headers.map(cell).join(" | ")} |`;
  const divider = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(cell).join(" | ")} |`);

  return [head, divider, ...body].join("\n");
}

function bullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function numbered(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function packetFileName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return `ax-client-packet-${slug || "workflow"}.md`;
}

export function buildClientPacket(
  intake: WorkflowIntake,
  output: CompilerOutput
): string {
  const sections: string[] = [];

  sections.push(
    [
      `# ${output.title} - Client Packet`,
      "",
      `> ${output.summary}`,
      "",
      "Prepared with the Apply Digital AX Spec Compiler. Every score, plan, and action below is generated deterministically from the recorded intake - no runtime AI, no fabricated client data."
    ].join("\n")
  );

  sections.push(
    [
      "## Executive brief",
      "",
      `**${output.executiveBrief.headline}**`,
      "",
      output.executiveBrief.boardroomPitch,
      "",
      bullets(output.executiveBrief.applySignal),
      "",
      `Demo close: ${output.executiveBrief.demoClose}`
    ].join("\n")
  );

  sections.push(
    [
      "## Readiness scorecard",
      "",
      table(
        ["Dimension", "Score / 100", "Reading"],
        [
          ["Business value", output.scores.businessValue, "Customer value, conversion, speed, and measurable ACx impact"],
          ["Feasibility", output.scores.feasibility, "Source quality, owners, integrations, and retrieval boundaries"],
          ["Risk", output.scores.risk, "Sensitivity, deadline pressure, and integration blast radius (lower is better)"],
          ["Data sensitivity", output.scores.dataSensitivity, "Privacy and approval exposure (lower is better)"],
          ["Readiness", output.scores.readiness, "Composite pilot-readiness for agentic delivery"]
        ]
      ),
      "",
      table(
        ["Maturity dimension", "Score / 100"],
        [
          ["Strategic fit", output.maturityScores.strategicFit],
          ["Architecture readiness", output.maturityScores.architectureReadiness],
          ["Governance confidence", output.maturityScores.governanceConfidence],
          ["Delivery velocity", output.maturityScores.deliveryVelocity],
          ["Hiring signal", output.maturityScores.hiringSignal]
        ]
      ),
      "",
      `- Decision stance: ${output.decisionMode}`,
      `- Next best action: ${output.nextBestAction}`,
      `- Risk posture: ${output.riskPosture}`
    ].join("\n")
  );

  sections.push(
    [
      "## Client readiness board",
      "",
      table(
        ["Dimension", "Status", "Score", "Owner", "Concern", "Evidence", "Next move"],
        output.readinessBoard.map((item) => [
          item.dimension,
          item.status,
          item.score,
          item.owner,
          item.concern,
          item.evidence,
          item.nextMove
        ])
      )
    ].join("\n")
  );

  sections.push(
    [
      "## Value case",
      "",
      `**${output.businessCase.headline}**`,
      "",
      table(
        ["Component", "Amount"],
        [
          ["Cycle-time value", money(output.businessCase.cycleTimeValue)],
          ["Rework value", money(output.businessCase.reworkValue)],
          ["Speed-to-market value", money(output.businessCase.speedToMarketValue)],
          ["Modeled annual value", money(output.businessCase.annualValue)],
          ["Pilot investment", money(output.businessCase.pilotInvestment)],
          ["Modeled payback", `${output.businessCase.paybackWeeks} weeks`],
          ["Value-to-pilot multiple", `${output.businessCase.valueMultiple}x`],
          ["Model confidence", `${output.businessCase.confidence}/100`]
        ]
      ),
      "",
      output.businessCase.thesis
    ].join("\n")
  );

  sections.push(
    [
      "## Client decision memo",
      "",
      `**Recommended decision:** ${output.clientDecisionMemo.recommendedDecision}`,
      "",
      `- Why now: ${output.clientDecisionMemo.whyNow}`,
      `- Sponsor ask: ${output.clientDecisionMemo.sponsorAsk}`,
      `- First workshop: ${output.clientDecisionMemo.firstWorkshop}`,
      `- Data position: ${output.clientDecisionMemo.dataPosition}`,
      `- Adoption position: ${output.clientDecisionMemo.adoptionPosition}`
    ].join("\n")
  );

  sections.push(
    [
      "## Next-action queue",
      "",
      table(
        ["Priority", "Owner", "Action", "Rationale", "Evidence required", "Due", "Success signal"],
        output.nextActionQueue.map((action, index) => [
          `${index + 1}. ${action.urgency.toUpperCase()}`,
          action.owner,
          action.action,
          action.rationale,
          action.evidenceRequired,
          action.dueWindow,
          action.successSignal
        ])
      )
    ].join("\n")
  );

  sections.push(
    [
      "## 30-day client launch plan",
      "",
      table(
        ["Timeline", "Client action", "Apply action", "Evidence"],
        output.clientLaunchPlan.map((step) => [
          step.timeline,
          step.clientAction,
          step.applyAction,
          step.evidence
        ])
      )
    ].join("\n")
  );

  sections.push(
    [
      "## Architecture summary",
      "",
      table(
        ["Layer", "Design choice"],
        output.architectureBlueprint.map((layer) => [layer.layer, layer.designChoice])
      ),
      "",
      bullets(output.architectureNotes)
    ].join("\n")
  );

  sections.push(
    [
      "## Connector contracts",
      "",
      table(
        [
          "System",
          "Mode",
          "Owner",
          "Data boundary",
          "Auth scope",
          "Blocked actions",
          "Promotion gate"
        ],
        output.connectorContracts.map((connector) => [
          connector.system,
          connector.mode,
          connector.owner,
          connector.dataBoundary,
          connector.authScope,
          connector.blockedActions,
          connector.promotionGate
        ])
      )
    ].join("\n")
  );

  sections.push(
    [
      "## Eval telemetry and release gates",
      "",
      table(
        ["Metric", "Score", "Threshold", "Status", "Signal", "Evidence", "Owner"],
        output.evalTelemetry.map((metric) => [
          metric.metric,
          metric.score,
          metric.threshold,
          metric.status,
          metric.signal,
          metric.evidence,
          metric.owner
        ])
      ),
      "",
      table(
        ["Gate", "Status", "Owner", "Evidence", "Decision"],
        output.releaseGates.map((gate) => [
          gate.gate,
          gate.status,
          gate.owner,
          gate.evidence,
          gate.decision
        ])
      )
    ].join("\n")
  );

  sections.push(
    [
      "## Risk register",
      "",
      table(
        ["Risk", "Signal", "Mitigation", "Owner"],
        output.riskRegister.map((risk) => [risk.risk, risk.signal, risk.mitigation, risk.owner])
      )
    ].join("\n")
  );

  sections.push(["## QA and evaluation gates", "", numbered(output.qaChecks)].join("\n"));

  sections.push(
    ["## Autonomy boundaries", "", bullets(output.autonomyBoundaries)].join("\n")
  );

  sections.push(
    [
      "## Recorded intake assumptions",
      "",
      table(
        ["Assumption", "Recorded value"],
        [
          ["Workflow", intake.workflowName || "Untitled AX workflow"],
          ["Industry", intake.industry || "Not recorded"],
          ["Channels", intake.channels.join(", ") || "None declared"],
          ["Source inputs", intake.sourceInputs.join(", ") || "None declared"],
          ["Knowledge sources", intake.knowledgeSources.join(", ") || "None declared"],
          ["Integrations", intake.integrations.join(", ") || "None declared"],
          ["Data sensitivity", intake.dataSensitivity],
          ["Approval model", intake.approvalMode],
          ["Delivery stage", intake.deliveryStage],
          ["Annual workflow volume", intake.annualWorkflowVolume],
          ["Current cycle days", intake.currentCycleDays],
          ["Target cycle days", intake.targetCycleDays],
          ["Team cost per day", money(intake.teamCostPerDay)],
          ["Launch value per day", money(intake.launchValuePerDay)],
          ["Rework rate", `${intake.reworkRate}%`],
          ["Pilot budget", money(intake.pilotBudget)],
          ["Success metric", intake.successMetric || "Not yet accepted"]
        ]
      ),
      "",
      "Change any assumption in the compiler and re-export; the packet regenerates deterministically."
    ].join("\n")
  );

  return sections.join("\n\n") + "\n";
}
