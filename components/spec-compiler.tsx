"use client";

import { useEffect, useMemo, useState } from "react";
import {
  channelOptions,
  compileSpec,
  createDefaultIntake,
  createPresetIntake,
  integrationOptions,
  knowledgeSourceOptions,
  scenarioPresets,
  sourceInputOptions,
  type ApprovalMode,
  type CompilerOutput,
  type DataSensitivity,
  type DeliveryStage,
  type MaturityScores,
  type Scores,
  type WorkflowIntake
} from "@/lib/compiler";
import { buildClientPacket, packetFileName } from "@/lib/export-packet";
import {
  compareScenarios,
  MAX_SNAPSHOTS,
  parseSnapshots,
  serializeSnapshots,
  SNAPSHOT_STORAGE_KEY,
  type ScenarioSnapshot
} from "@/lib/snapshots";

type TabKey =
  | "brief"
  | "value"
  | "client"
  | "spec"
  | "architecture"
  | "rag"
  | "pilot"
  | "scale"
  | "risk"
  | "proof"
  | "walkthrough";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "brief", label: "Command brief" },
  { key: "value", label: "Value case" },
  { key: "client", label: "Client plan" },
  { key: "spec", label: "Agent spec" },
  { key: "architecture", label: "Architecture" },
  { key: "rag", label: "RAG + tools" },
  { key: "pilot", label: "Pilot plan" },
  { key: "scale", label: "Scale plan" },
  { key: "risk", label: "Risk + QA" },
  { key: "proof", label: "Role proof" },
  { key: "walkthrough", label: "Walkthrough" }
];

const maturityLabels: Array<{ key: keyof MaturityScores; label: string }> = [
  { key: "strategicFit", label: "Strategic fit" },
  { key: "architectureReadiness", label: "Architecture" },
  { key: "governanceConfidence", label: "Governance" },
  { key: "deliveryVelocity", label: "Velocity" },
  { key: "hiringSignal", label: "Hiring signal" }
];

const scoreLabels: Array<{ key: keyof Scores; label: string; inverse?: boolean }> = [
  { key: "businessValue", label: "Value" },
  { key: "feasibility", label: "Feasibility" },
  { key: "risk", label: "Risk", inverse: true },
  { key: "dataSensitivity", label: "Sensitivity", inverse: true },
  { key: "readiness", label: "Readiness" }
];

function scoreClass(value: number, inverse = false): string {
  const normalized = inverse ? 100 - value : value;

  if (normalized >= 74) {
    return "success";
  }

  if (normalized >= 52) {
    return "warning";
  }

  return "danger";
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function formatMoney(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
}

function CheckGroup({
  label,
  options,
  values,
  onChange
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="field">
      <div className="control-label">{label}</div>
      <div className="choice-grid">
        {options.map((option) => (
          <label className="choice" key={option}>
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onChange(toggleValue(values, option))}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  note,
  inverse
}: {
  label: string;
  value: number;
  note: string;
  inverse?: boolean;
}) {
  return (
    <div className={`score-tile ${scoreClass(value, inverse)}`}>
      <div className="score-title">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <progress value={value} max={100} aria-label={`${label} score`} />
      <div className="score-note">{note}</div>
    </div>
  );
}

function ScenarioStrip({
  activePreset,
  onSelect
}: {
  activePreset: string;
  onSelect: (presetId: string) => void;
}) {
  return (
    <div className="scenario-strip" aria-label="Scenario presets">
      {scenarioPresets.map((preset) => (
        <button
          className="scenario-button"
          type="button"
          key={preset.id}
          aria-pressed={activePreset === preset.id}
          onClick={() => onSelect(preset.id)}
        >
          <strong>{preset.label}</strong>
          <span>{preset.summary}</span>
        </button>
      ))}
    </div>
  );
}

function MaturityBoard({ output }: { output: CompilerOutput }) {
  return (
    <div className="maturity-grid" aria-label="Maturity scores">
      {maturityLabels.map((item) => {
        const value = output.maturityScores[item.key];

        return (
          <div className={`maturity-cell ${scoreClass(value)}`} key={item.key}>
            <span>{item.label}</span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </div>
  );
}

function ScoreRail({ output }: { output: CompilerOutput }) {
  const notes: Record<keyof Scores, string> = {
    businessValue: "Customer value, conversion, speed, loyalty, and measurable ACx impact.",
    feasibility: "Source quality, owners, integrations, retrieval, and implementation boundaries.",
    risk: "Sensitivity, deadline pressure, external writes, and integration blast radius.",
    dataSensitivity: "Privacy, regulated data, customer data, and approval exposure.",
    readiness: "Composite pilot-readiness score for agentic delivery."
  };

  return (
    <aside className="panel score-panel" aria-label="Scoring and decision stance">
      <div className="panel-header compact">
        <div>
          <p className="eyebrow">Governance engine</p>
          <h2>{output.decisionMode}</h2>
          <p>{output.nextBestAction}</p>
        </div>
      </div>

      <div className="score-rail">
        {scoreLabels.map((item) => (
          <ScoreTile
            key={item.key}
            label={item.label}
            value={output.scores[item.key]}
            note={notes[item.key]}
            inverse={item.inverse}
          />
        ))}

        <div className="boundary-callout">
          <span>Risk posture</span>
          <strong>{output.riskPosture}</strong>
        </div>
      </div>
    </aside>
  );
}

function BriefSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="brief-hero">
        <div>
          <p className="eyebrow">Executive readout</p>
          <h3>{output.executiveBrief.headline}</h3>
          <p>{output.executiveBrief.boardroomPitch}</p>
        </div>
        <div className="signal-list" aria-label="Apply-aligned signals">
          {output.executiveBrief.applySignal.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
      </section>

      <MaturityBoard output={output} />

      <div className="value-grid" aria-label="Commercial value snapshot">
        <div className="value-card lead">
          <span>Estimated annual value</span>
          <strong>{formatMoney(output.businessCase.annualValue)}</strong>
          <p>{output.businessCase.thesis}</p>
        </div>
        <div className="value-card">
          <span>Pilot investment</span>
          <strong>{formatMoney(output.businessCase.pilotInvestment)}</strong>
          <p>{output.businessCase.paybackWeeks} week modeled payback</p>
        </div>
        <div className="value-card">
          <span>Value multiple</span>
          <strong>{output.businessCase.valueMultiple}x</strong>
          <p>{output.businessCase.confidence}/100 confidence</p>
        </div>
      </div>

      <section className="spec-section">
        <h3>Impact model</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Baseline</th>
              <th>Target</th>
              <th>Why it moves</th>
            </tr>
          </thead>
          <tbody>
            {output.impactModel.map((metric) => (
              <tr key={metric.metric}>
                <td>{metric.metric}</td>
                <td>{metric.baseline}</td>
                <td>{metric.target}</td>
                <td>{metric.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Demo close</h3>
        <p>{output.executiveBrief.demoClose}</p>
      </section>
    </div>
  );
}

function ValueSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="brief-hero value-hero">
        <div>
          <p className="eyebrow">Million-dollar thesis</p>
          <h3>{output.businessCase.headline}</h3>
          <p>{output.businessCase.thesis}</p>
        </div>
        <div className="value-stack">
          <span>
            <strong>{formatMoney(output.businessCase.cycleTimeValue)}</strong>
            cycle-time value
          </span>
          <span>
            <strong>{formatMoney(output.businessCase.reworkValue)}</strong>
            rework value
          </span>
          <span>
            <strong>{formatMoney(output.businessCase.speedToMarketValue)}</strong>
            speed-to-market value
          </span>
        </div>
      </section>

      <section className="spec-section">
        <h3>Commercial packages</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Package</th>
              <th>Buyer</th>
              <th>Price band</th>
              <th>Includes</th>
              <th>Expansion trigger</th>
            </tr>
          </thead>
          <tbody>
            {output.commercialPackages.map((item) => (
              <tr key={item.packageName}>
                <td>{item.packageName}</td>
                <td>{item.buyer}</td>
                <td>{item.priceBand}</td>
                <td>{item.includes}</td>
                <td>{item.expansionTrigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Boardroom objections</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Objection</th>
              <th>Answer</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {output.boardroomObjections.map((item) => (
              <tr key={item.objection}>
                <td>{item.objection}</td>
                <td>{item.answer}</td>
                <td>{item.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ClientPlanSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="brief-hero">
        <div>
          <p className="eyebrow">Client decision memo</p>
          <h3>{output.clientDecisionMemo.recommendedDecision}</h3>
          <p>{output.clientDecisionMemo.whyNow}</p>
        </div>
        <div className="signal-list">
          <span>{output.clientDecisionMemo.sponsorAsk}</span>
          <span>{output.clientDecisionMemo.dataPosition}</span>
          <span>{output.clientDecisionMemo.adoptionPosition}</span>
        </div>
      </section>

      <section className="spec-section">
        <h3>Next-action queue</h3>
        <p>
          Prioritized from the weakest readiness dimensions, governance posture,
          and value-model gaps in this intake. Every action is owned, evidenced,
          and dated.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Action</th>
              <th>Owner</th>
              <th>Evidence required</th>
              <th>Due</th>
              <th>Success signal</th>
            </tr>
          </thead>
          <tbody>
            {output.nextActionQueue.map((action, index) => (
              <tr key={action.id}>
                <td>
                  <span className={`urgency-chip ${action.urgency}`}>
                    {index + 1}. {action.urgency}
                  </span>
                </td>
                <td>
                  <strong className="queue-action">{action.action}</strong>
                  <span className="queue-rationale">{action.rationale}</span>
                </td>
                <td>{action.owner}</td>
                <td>{action.evidenceRequired}</td>
                <td>{action.dueWindow}</td>
                <td>{action.successSignal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>First workshop</h3>
        <p>{output.clientDecisionMemo.firstWorkshop}</p>
      </section>

      <section className="spec-section">
        <h3>30-day client launch plan</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Timeline</th>
              <th>Client action</th>
              <th>Apply action</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {output.clientLaunchPlan.map((step) => (
              <tr key={step.timeline}>
                <td>{step.timeline}</td>
                <td>{step.clientAction}</td>
                <td>{step.applyAction}</td>
                <td>{step.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Stakeholder commitments</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Stakeholder</th>
              <th>Decision needed</th>
              <th>Required input</th>
              <th>Cadence</th>
            </tr>
          </thead>
          <tbody>
            {output.stakeholderCommitments.map((item) => (
              <tr key={item.stakeholder}>
                <td>{item.stakeholder}</td>
                <td>{item.decisionNeeded}</td>
                <td>{item.requiredInput}</td>
                <td>{item.operatingCadence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Success dashboard</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Target</th>
              <th>Owner</th>
              <th>Evidence source</th>
            </tr>
          </thead>
          <tbody>
            {output.successDashboard.map((metric) => (
              <tr key={metric.metric}>
                <td>{metric.metric}</td>
                <td>{metric.target}</td>
                <td>{metric.owner}</td>
                <td>{metric.evidenceSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Buyer questions</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
              <th>Proof point</th>
            </tr>
          </thead>
          <tbody>
            {output.buyerQuestions.map((item) => (
              <tr key={item.question}>
                <td>{item.question}</td>
                <td>{item.answer}</td>
                <td>{item.proofPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function SpecSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Coding-agent-ready implementation contract</h3>
        <p>{output.summary}</p>
        <ol>
          {output.implementationSpec.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="spec-section">
        <h3>First bounded task batch</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Workstream</th>
              <th>Owner</th>
              <th>Task</th>
              <th>Acceptance criteria</th>
            </tr>
          </thead>
          <tbody>
            {output.backlogTasks.map((task) => (
              <tr key={task.workstream}>
                <td>{task.workstream}</td>
                <td>{task.owner}</td>
                <td>{task.task}</td>
                <td>{task.acceptanceCriteria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Autonomy boundaries</h3>
        <ul>
          {output.autonomyBoundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ArchitectureSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Production architecture blueprint</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Design choice</th>
              <th>Apply signal</th>
            </tr>
          </thead>
          <tbody>
            {output.architectureBlueprint.map((row) => (
              <tr key={row.layer}>
                <td>{row.layer}</td>
                <td>{row.designChoice}</td>
                <td>{row.applySignal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Architecture notes</h3>
        <ul>
          {output.architectureNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="spec-section">
        <h3>Evaluation plan</h3>
        <ul>
          {output.evaluationPlan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RagToolSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Knowledge-source map</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Owner</th>
              <th>Freshness</th>
              <th>Retrieval use</th>
              <th>Guardrail</th>
            </tr>
          </thead>
          <tbody>
            {output.ragMap.map((row) => (
              <tr key={row.source}>
                <td>{row.source}</td>
                <td>{row.owner}</td>
                <td>{row.freshness}</td>
                <td>{row.retrievalUse}</td>
                <td>{row.guardrail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Tool and API action plan</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>System</th>
              <th>Autonomy</th>
              <th>Approval gate</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {output.toolPlan.map((row) => (
              <tr key={row.action}>
                <td>{row.action}</td>
                <td>{row.system}</td>
                <td>{row.autonomy}</td>
                <td>{row.approvalGate}</td>
                <td>{row.evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function PilotSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>30-day pilot plan</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>Timeline</th>
              <th>Artifact</th>
              <th>Decision gate</th>
            </tr>
          </thead>
          <tbody>
            {output.pilotPlan.map((step) => (
              <tr key={step.phase}>
                <td>{step.phase}</td>
                <td>{step.timeline}</td>
                <td>{step.artifact}</td>
                <td>{step.decisionGate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Release and owner handoff</h3>
        <ul>
          {output.handoffNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ScaleSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Million-dollar product roadmap</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Horizon</th>
              <th>Module</th>
              <th>Why it matters</th>
              <th>Proof needed</th>
            </tr>
          </thead>
          <tbody>
            {output.productRoadmap.map((item) => (
              <tr key={`${item.horizon}-${item.module}`}>
                <td>{item.horizon}</td>
                <td>{item.module}</td>
                <td>{item.whyItMatters}</td>
                <td>{item.proofNeeded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>Repeatable offer path</h3>
        <ol>
          {output.commercialPackages.map((item) => (
            <li key={item.packageName}>
              <strong>{item.packageName}:</strong> {item.priceBand} for {item.buyer}.{" "}
              {item.expansionTrigger}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function RiskQaSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Risk register</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Risk</th>
              <th>Signal</th>
              <th>Mitigation</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {output.riskRegister.map((risk) => (
              <tr key={risk.risk}>
                <td>{risk.risk}</td>
                <td>{risk.signal}</td>
                <td>{risk.mitigation}</td>
                <td>{risk.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="spec-section">
        <h3>QA and evaluation checklist</h3>
        <ul>
          {output.qaChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ProofSections({ output }: { output: CompilerOutput }) {
  return (
    <section className="spec-section">
      <h3>Role-fit proof matrix</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Role requirement</th>
            <th>Prototype proof</th>
            <th>Shrish proof</th>
          </tr>
        </thead>
        <tbody>
          {output.roleFitMatrix.map((row) => (
            <tr key={row.requirement}>
              <td>{row.requirement}</td>
              <td>{row.prototypeProof}</td>
              <td>{row.candidateProof}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function WalkthroughSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Interview walkthrough</h3>
        <ol>
          {output.interviewNarrative.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="spec-section">
        <h3>Compiler audit events</h3>
        <ol>
          {output.auditEvents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ActiveTab({ activeTab, output }: { activeTab: TabKey; output: CompilerOutput }) {
  if (activeTab === "value") {
    return <ValueSections output={output} />;
  }

  if (activeTab === "client") {
    return <ClientPlanSections output={output} />;
  }

  if (activeTab === "spec") {
    return <SpecSections output={output} />;
  }

  if (activeTab === "architecture") {
    return <ArchitectureSections output={output} />;
  }

  if (activeTab === "rag") {
    return <RagToolSections output={output} />;
  }

  if (activeTab === "pilot") {
    return <PilotSections output={output} />;
  }

  if (activeTab === "scale") {
    return <ScaleSections output={output} />;
  }

  if (activeTab === "risk") {
    return <RiskQaSections output={output} />;
  }

  if (activeTab === "proof") {
    return <ProofSections output={output} />;
  }

  if (activeTab === "walkthrough") {
    return <WalkthroughSections output={output} />;
  }

  return <BriefSections output={output} />;
}

export function SpecCompiler() {
  const [intake, setIntake] = useState<WorkflowIntake>(() => createDefaultIntake());
  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const [activePreset, setActivePreset] = useState<string>("retail-campaign");
  const [manualEvents, setManualEvents] = useState<string[]>([
    "Prototype loaded with the ACx retail command center sample."
  ]);
  const [snapshots, setSnapshots] = useState<ScenarioSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState<string>("");
  const [compareTargetId, setCompareTargetId] = useState<string | null>(null);
  const [packetNotice, setPacketNotice] = useState<string>("");

  const output = useMemo(() => compileSpec(intake), [intake]);

  useEffect(() => {
    try {
      setSnapshots(parseSnapshots(window.localStorage.getItem(SNAPSHOT_STORAGE_KEY)));
    } catch {
      setSnapshots([]);
    }
  }, []);

  const compareTarget = snapshots.find((item) => item.id === compareTargetId) ?? null;
  const compareRows = useMemo(
    () => (compareTarget ? compareScenarios(compareTarget.intake, intake) : null),
    [compareTarget, intake]
  );

  function logEvent(message: string) {
    setManualEvents((current) => [message, ...current.slice(0, 5)]);
  }

  function persistSnapshots(next: ScenarioSnapshot[]) {
    setSnapshots(next);

    try {
      window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, serializeSnapshots(next));
    } catch {
      // Storage unavailable (private mode or quota); session-only snapshots still work.
    }
  }

  function updateField<Key extends keyof WorkflowIntake>(
    key: Key,
    value: WorkflowIntake[Key]
  ) {
    setActivePreset("custom");
    setIntake((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(presetId: string) {
    const preset = scenarioPresets.find((item) => item.id === presetId);
    setIntake(createPresetIntake(presetId));
    setActivePreset(presetId);
    setActiveTab("brief");
    logEvent(`Scenario loaded: ${preset?.label ?? "custom scenario"}.`);
  }

  function compileCurrentSpec() {
    const stamp = new Intl.DateTimeFormat("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
    setActiveTab("brief");
    logEvent(
      `${stamp} - compiled "${output.title}" with ${formatMoney(output.businessCase.annualValue)} modeled annual value, readiness ${output.scores.readiness}, and hiring signal ${output.maturityScores.hiringSignal}.`
    );
  }

  function resetSample() {
    const presetId = scenarioPresets.some((item) => item.id === activePreset)
      ? activePreset
      : "retail-campaign";
    const preset = scenarioPresets.find((item) => item.id === presetId);
    setIntake(createPresetIntake(presetId));
    setActivePreset(presetId);
    setActiveTab("brief");
    setManualEvents([`Intake reset to the ${preset?.label ?? "ACx retail"} preset.`]);
  }

  function saveSnapshot() {
    const name = snapshotName.trim() || output.title;
    const snapshot: ScenarioSnapshot = {
      id: `snapshot-${Date.now()}-${snapshots.length}`,
      name,
      savedAt: new Date().toISOString(),
      intake: structuredClone(intake)
    };

    persistSnapshots([snapshot, ...snapshots].slice(0, MAX_SNAPSHOTS));
    setSnapshotName("");
    logEvent(`Scenario saved: "${name}".`);
  }

  function restoreSnapshot(snapshot: ScenarioSnapshot) {
    setIntake(structuredClone(snapshot.intake));
    setActivePreset("custom");
    setActiveTab("brief");
    logEvent(`Scenario restored: "${snapshot.name}".`);
  }

  function deleteSnapshot(snapshot: ScenarioSnapshot) {
    persistSnapshots(snapshots.filter((item) => item.id !== snapshot.id));

    if (compareTargetId === snapshot.id) {
      setCompareTargetId(null);
    }

    logEvent(`Scenario deleted: "${snapshot.name}".`);
  }

  async function copyPacket() {
    const packet = buildClientPacket(intake, output);

    try {
      await navigator.clipboard.writeText(packet);
      setPacketNotice(`Client packet copied (${packet.length.toLocaleString("en-CA")} characters of Markdown).`);
      logEvent(`Client packet copied for "${output.title}".`);
    } catch {
      setPacketNotice("Clipboard is unavailable in this browser - use Download .md instead.");
    }
  }

  function downloadPacket() {
    const packet = buildClientPacket(intake, output);
    const fileName = packetFileName(output.title);
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setPacketNotice(`Client packet downloaded as ${fileName}.`);
    logEvent(`Client packet downloaded for "${output.title}".`);
  }

  function savedAtLabel(savedAt: string): string {
    const date = new Date(savedAt);

    if (Number.isNaN(date.getTime())) {
      return "earlier session";
    }

    return new Intl.DateTimeFormat("en-CA", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  return (
    <main className="app-shell">
      <a href="#compiler" className="skip-link">
        Skip to compiler
      </a>

      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">Apply Digital role prototype</p>
          <h1>AX Spec Compiler</h1>
          <p className="lede">
            A boardroom-ready agentic delivery studio for turning ACx, commerce,
            content, and platform workflows into governed coding-agent task
            packets.
          </p>
        </div>
        <div className="identity-stack" aria-label="Candidate proof points">
          <div className="identity-pill">
            <strong>Shrish Manglik</strong>
            Solution Architect - Agentic Engineering
          </div>
          <div className="identity-pill">
            <strong>Proof base</strong>
            VCOS/MIDAS, JobFlow, TELUS enterprise operations
          </div>
          <div className="identity-pill accent">
            <strong>{output.maturityScores.hiringSignal}/100</strong>
            hiring signal from this scenario
          </div>
          <div className="identity-pill accent">
            <strong>{formatMoney(output.businessCase.annualValue)}</strong>
            modeled annual client value
          </div>
        </div>
      </header>

      <section className="signal-bar" aria-label="Prototype guarantees">
        <span>ACx workflow focus</span>
        <span>{output.businessCase.paybackWeeks} week payback model</span>
        <span>RAG-ready source contracts</span>
        <span>GCP and Vertex AI architecture</span>
        <span>Human approval gates</span>
        <span>{output.businessCase.valueMultiple}x pilot multiple</span>
      </section>

      <div className="workspace" id="compiler">
        <section className="panel intake-panel" aria-label="Workflow intake">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Pilot designer</p>
              <h2>Workflow intake</h2>
              <p>Business context, source contract, platform boundaries, and risk profile.</p>
            </div>
          </div>

          <div className="form-grid">
            <details className="form-section" open>
              <summary>Workflow brief</summary>
              <div className="form-section-body">
                <ScenarioStrip activePreset={activePreset} onSelect={applyPreset} />

                <div className="field">
                  <label htmlFor="workflowName">Workflow name</label>
                  <input
                    id="workflowName"
                    value={intake.workflowName}
                    onChange={(event) => updateField("workflowName", event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="businessGoal">Business goal</label>
                  <textarea
                    id="businessGoal"
                    value={intake.businessGoal}
                    onChange={(event) => updateField("businessGoal", event.target.value)}
                  />
                </div>

                <div className="split-fields">
                  <div className="field">
                    <label htmlFor="audience">Owners</label>
                    <input
                      id="audience"
                      value={intake.audience}
                      onChange={(event) => updateField("audience", event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="industry">Industry context</label>
                    <input
                      id="industry"
                      value={intake.industry}
                      onChange={(event) => updateField("industry", event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </details>

            <details className="form-section">
              <summary>Source package</summary>
              <div className="form-section-body">
                <CheckGroup
                  label="Channels"
                  options={channelOptions}
                  values={intake.channels}
                  onChange={(next) => updateField("channels", next)}
                />

            <CheckGroup
              label="Source inputs"
              options={sourceInputOptions}
              values={intake.sourceInputs}
              onChange={(next) => updateField("sourceInputs", next)}
            />

            <div className="field">
              <label htmlFor="componentNotes">Component notes</label>
              <textarea
                id="componentNotes"
                value={intake.componentNotes}
                onChange={(event) => updateField("componentNotes", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="brandConstraints">Brand and governance constraints</label>
              <textarea
                id="brandConstraints"
                value={intake.brandConstraints}
                onChange={(event) => updateField("brandConstraints", event.target.value)}
              />
            </div>

            <CheckGroup
              label="Knowledge sources"
              options={knowledgeSourceOptions}
              values={intake.knowledgeSources}
              onChange={(next) => updateField("knowledgeSources", next)}
            />

            <CheckGroup
              label="Integrations"
              options={integrationOptions}
              values={intake.integrations}
              onChange={(next) => updateField("integrations", next)}
            />
              </div>
            </details>

            <details className="form-section">
              <summary>Governance</summary>
              <div className="form-section-body">
                <div className="split-fields">
              <div className="field">
                <label htmlFor="dataSensitivity">Data sensitivity</label>
                <select
                  id="dataSensitivity"
                  value={intake.dataSensitivity}
                  onChange={(event) =>
                    updateField("dataSensitivity", event.target.value as DataSensitivity)
                  }
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="approvalMode">Approval model</label>
                <select
                  id="approvalMode"
                  value={intake.approvalMode}
                  onChange={(event) =>
                    updateField("approvalMode", event.target.value as ApprovalMode)
                  }
                >
                  <option value="read-only">Read-only agent</option>
                  <option value="human-before-write">Human before write</option>
                  <option value="human-before-external">Human before external action</option>
                </select>
              </div>
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="deliveryStage">Delivery stage</label>
                <select
                  id="deliveryStage"
                  value={intake.deliveryStage}
                  onChange={(event) =>
                    updateField("deliveryStage", event.target.value as DeliveryStage)
                  }
                >
                  <option value="discovery">Discovery</option>
                  <option value="pilot">Pilot</option>
                  <option value="scale">Scale</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="deadlinePressure">Deadline pressure</label>
                <div className="range-row">
                  <input
                    id="deadlinePressure"
                    type="range"
                    min={0}
                    max={100}
                    value={intake.deadlinePressure}
                    onChange={(event) =>
                      updateField("deadlinePressure", Number(event.target.value))
                    }
                  />
                  <span className="range-value">{intake.deadlinePressure}</span>
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="successMetric">Success metric</label>
              <textarea
                id="successMetric"
                value={intake.successMetric}
                onChange={(event) => updateField("successMetric", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="budgetGuardrail">Cost and model-use guardrail</label>
              <textarea
                id="budgetGuardrail"
                value={intake.budgetGuardrail}
                onChange={(event) => updateField("budgetGuardrail", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="riskNotes">Risk notes</label>
              <textarea
                id="riskNotes"
                value={intake.riskNotes}
                onChange={(event) => updateField("riskNotes", event.target.value)}
              />
            </div>
              </div>
            </details>

            <details className="form-section">
              <summary>Value model</summary>
              <div className="form-section-body">
                <div className="split-fields">
              <div className="field">
                <label htmlFor="annualWorkflowVolume">Annual workflow volume</label>
                <input
                  id="annualWorkflowVolume"
                  type="number"
                  min={0}
                  value={intake.annualWorkflowVolume}
                  onChange={(event) =>
                    updateField("annualWorkflowVolume", Number(event.target.value))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="pilotBudget">Pilot budget</label>
                <input
                  id="pilotBudget"
                  type="number"
                  min={1}
                  step={5000}
                  value={intake.pilotBudget}
                  onChange={(event) => updateField("pilotBudget", Number(event.target.value))}
                />
              </div>
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="currentCycleDays">Current cycle days</label>
                <input
                  id="currentCycleDays"
                  type="number"
                  min={0}
                  step={0.25}
                  value={intake.currentCycleDays}
                  onChange={(event) =>
                    updateField("currentCycleDays", Number(event.target.value))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="targetCycleDays">Target cycle days</label>
                <input
                  id="targetCycleDays"
                  type="number"
                  min={0}
                  step={0.25}
                  value={intake.targetCycleDays}
                  onChange={(event) =>
                    updateField("targetCycleDays", Number(event.target.value))
                  }
                />
              </div>
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="teamCostPerDay">Team cost per day</label>
                <input
                  id="teamCostPerDay"
                  type="number"
                  min={0}
                  step={100}
                  value={intake.teamCostPerDay}
                  onChange={(event) =>
                    updateField("teamCostPerDay", Number(event.target.value))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="launchValuePerDay">Launch value per day</label>
                <input
                  id="launchValuePerDay"
                  type="number"
                  min={0}
                  step={100}
                  value={intake.launchValuePerDay}
                  onChange={(event) =>
                    updateField("launchValuePerDay", Number(event.target.value))
                  }
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="reworkRate">Rework rate</label>
              <div className="range-row">
                <input
                  id="reworkRate"
                  type="range"
                  min={0}
                  max={100}
                  value={intake.reworkRate}
                  onChange={(event) => updateField("reworkRate", Number(event.target.value))}
                />
                <span className="range-value">{intake.reworkRate}%</span>
              </div>
            </div>
              </div>
            </details>

            <details className="form-section">
              <summary>Saved scenarios</summary>
              <div className="form-section-body">
                <div className="snapshot-save-row">
                  <div className="field">
                    <label htmlFor="snapshotName">Scenario name</label>
                    <input
                      id="snapshotName"
                      value={snapshotName}
                      placeholder={output.title}
                      onChange={(event) => setSnapshotName(event.target.value)}
                    />
                  </div>
                  <button className="secondary-button" type="button" onClick={saveSnapshot}>
                    Save scenario
                  </button>
                </div>

                {snapshots.length === 0 ? (
                  <p className="snapshot-empty">
                    No saved scenarios yet. Save the current intake to revisit or
                    compare governance and value positions during a working
                    session. Snapshots stay in this browser only.
                  </p>
                ) : (
                  <ul className="snapshot-list">
                    {snapshots.map((snapshot) => (
                      <li className="snapshot-row" key={snapshot.id}>
                        <div className="snapshot-meta">
                          <strong>{snapshot.name}</strong>
                          <span>Saved {savedAtLabel(snapshot.savedAt)}</span>
                        </div>
                        <div className="snapshot-actions">
                          <button
                            className="snapshot-button"
                            type="button"
                            onClick={() => restoreSnapshot(snapshot)}
                          >
                            Restore
                          </button>
                          <button
                            className="snapshot-button"
                            type="button"
                            aria-pressed={compareTargetId === snapshot.id}
                            onClick={() =>
                              setCompareTargetId(
                                compareTargetId === snapshot.id ? null : snapshot.id
                              )
                            }
                          >
                            {compareTargetId === snapshot.id ? "Hide compare" : "Compare"}
                          </button>
                          <button
                            className="snapshot-button danger"
                            type="button"
                            onClick={() => deleteSnapshot(snapshot)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {compareTarget && compareRows ? (
                  <div
                    className="compare-card"
                    aria-label={`Current intake compared against ${compareTarget.name}`}
                  >
                    <h3>Current vs &quot;{compareTarget.name}&quot;</h3>
                    <table className="data-table compare-table">
                      <thead>
                        <tr>
                          <th>Dimension</th>
                          <th>Saved</th>
                          <th>Current</th>
                          <th>Shift</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compareRows.map((row) => (
                          <tr key={row.dimension}>
                            <td>{row.dimension}</td>
                            <td>{row.saved}</td>
                            <td>{row.current}</td>
                            <td>{row.shift}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            </details>

            <div className="button-row">
              <button className="primary-button" type="button" onClick={compileCurrentSpec}>
                Compile spec
              </button>
              <button className="secondary-button" type="button" onClick={resetSample}>
                Reset preset
              </button>
            </div>
          </div>
        </section>

        <section aria-label="Compiled output">
          <div className="output-grid">
            <ScoreRail output={output} />

            <div className="panel spec-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Compiled package</p>
                  <h2>{output.title}</h2>
                  <p>{output.executiveBrief.headline}</p>
                </div>
                <div className="packet-actions">
                  <button className="secondary-button" type="button" onClick={copyPacket}>
                    Copy packet
                  </button>
                  <button className="secondary-button" type="button" onClick={downloadPacket}>
                    Download .md
                  </button>
                  {packetNotice ? (
                    <p className="packet-notice" role="status">
                      {packetNotice}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="tab-list" role="tablist" aria-label="Compiled package views">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className="tab-button"
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="tab-body" role="tabpanel" aria-live="polite">
                <ActiveTab activeTab={activeTab} output={output} />
              </div>
            </div>
          </div>

          <section className="audit-log" aria-label="Runtime audit log">
            <h2>Audit trail</h2>
            <ol>
              {manualEvents.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ol>
            <div className="status-row" aria-label="Prototype guarantees">
              <span className="status-chip good">Deterministic control plane</span>
              <span className="status-chip good">RAG-ready source map</span>
              <span className="status-chip caution">Human approval gates</span>
              <span className="status-chip stop">No autonomous external writes</span>
            </div>
          </section>
        </section>
      </div>

      <p className="footer-note">
        Built as a role-specific demo for Apply Digital Solution Architect,
        Agentic Engineering. Pure CSS visuals, deterministic compiler logic, and
        no generated image assets.
      </p>
    </main>
  );
}
