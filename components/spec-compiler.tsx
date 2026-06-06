"use client";

import { useMemo, useState } from "react";
import {
  channelOptions,
  compileSpec,
  createDefaultIntake,
  integrationOptions,
  knowledgeSourceOptions,
  sourceInputOptions,
  type ApprovalMode,
  type CompilerOutput,
  type DataSensitivity,
  type WorkflowIntake
} from "@/lib/compiler";

type TabKey = "spec" | "rag" | "tools" | "qa" | "handoff";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "spec", label: "Agent spec" },
  { key: "rag", label: "RAG map" },
  { key: "tools", label: "Tool plan" },
  { key: "qa", label: "QA checks" },
  { key: "handoff", label: "Handoff" }
];

function scoreClass(value: number, inverse = false): string {
  const normalized = inverse ? 100 - value : value;

  if (normalized >= 72) {
    return "success";
  }

  if (normalized >= 48) {
    return "warning";
  }

  return "danger";
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
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

function SpecSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Coding-agent-ready implementation spec</h3>
        <p>{output.summary}</p>
        <ol>
          {output.implementationSpec.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
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

function RagSections({ output }: { output: CompilerOutput }) {
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
            </tr>
          </thead>
          <tbody>
            {output.ragMap.map((row) => (
              <tr key={row.source}>
                <td>{row.source}</td>
                <td>{row.owner}</td>
                <td>{row.freshness}</td>
                <td>{row.retrievalUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="spec-section">
        <h3>Source conflict behavior</h3>
        <p>
          Conflicts emit an assumption register and owner review item before the
          task set is released to coding agents.
        </p>
      </section>
    </div>
  );
}

function ToolSections({ output }: { output: CompilerOutput }) {
  return (
    <section className="spec-section">
      <h3>Tool and API action plan</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>System</th>
            <th>Autonomy</th>
            <th>Approval gate</th>
          </tr>
        </thead>
        <tbody>
          {output.toolPlan.map((row) => (
            <tr key={row.action}>
              <td>{row.action}</td>
              <td>{row.system}</td>
              <td>{row.autonomy}</td>
              <td>{row.approvalGate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function QaSections({ output }: { output: CompilerOutput }) {
  return (
    <section className="spec-section">
      <h3>QA and evaluation checklist</h3>
      <ul>
        {output.qaChecks.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function HandoffSections({ output }: { output: CompilerOutput }) {
  return (
    <div className="section-stack">
      <section className="spec-section">
        <h3>Release and owner handoff</h3>
        <ul>
          {output.handoffNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
  if (activeTab === "rag") {
    return <RagSections output={output} />;
  }

  if (activeTab === "tools") {
    return <ToolSections output={output} />;
  }

  if (activeTab === "qa") {
    return <QaSections output={output} />;
  }

  if (activeTab === "handoff") {
    return <HandoffSections output={output} />;
  }

  return <SpecSections output={output} />;
}

export function SpecCompiler() {
  const [intake, setIntake] = useState<WorkflowIntake>(() => createDefaultIntake());
  const [activeTab, setActiveTab] = useState<TabKey>("spec");
  const [manualEvents, setManualEvents] = useState<string[]>([
    "Prototype loaded with a retail ACx sample."
  ]);

  const output = useMemo(() => compileSpec(intake), [intake]);

  function updateField<Key extends keyof WorkflowIntake>(
    key: Key,
    value: WorkflowIntake[Key]
  ) {
    setIntake((current) => ({ ...current, [key]: value }));
  }

  function compileCurrentSpec() {
    const stamp = new Intl.DateTimeFormat("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
    setManualEvents((current) => [
      `${stamp} - compiled "${output.title}" with readiness ${output.scores.readiness}.`,
      ...current.slice(0, 5)
    ]);
  }

  function resetSample() {
    setIntake(createDefaultIntake());
    setActiveTab("spec");
    setManualEvents(["Sample reset to Apply Digital retail ACx workflow."]);
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
            Converts product, UX, content, component, and brand inputs into a
            governed agentic-delivery package.
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
        </div>
      </header>

      <div className="workspace" id="compiler">
        <section className="panel" aria-label="Workflow intake">
          <div className="panel-header">
            <div>
              <h2>Workflow intake</h2>
              <p>Business context, source package, systems, and risk profile.</p>
            </div>
          </div>

          <div className="form-grid">
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

            <div className="field">
              <label htmlFor="riskNotes">Risk notes</label>
              <textarea
                id="riskNotes"
                value={intake.riskNotes}
                onChange={(event) => updateField("riskNotes", event.target.value)}
              />
            </div>

            <div className="button-row">
              <button className="primary-button" type="button" onClick={compileCurrentSpec}>
                Compile spec
              </button>
              <button className="secondary-button" type="button" onClick={resetSample}>
                Reset sample
              </button>
            </div>
          </div>
        </section>

        <section aria-label="Compiled output">
          <div className="output-grid">
            <aside className="panel" aria-label="Scoring and autonomy">
              <div className="panel-header">
                <div>
                  <h2>Governance score</h2>
                  <p>Weighted for value, feasibility, risk, and data sensitivity.</p>
                </div>
              </div>
              <div className="score-rail">
                <ScoreTile
                  label="Business value"
                  value={output.scores.businessValue}
                  note="Higher when the workflow touches customer value, conversion, CX velocity, or compliance."
                />
                <ScoreTile
                  label="Feasibility"
                  value={output.scores.feasibility}
                  note="Higher when source inputs, owners, integrations, and constraints are explicit."
                />
                <ScoreTile
                  label="Risk"
                  value={output.scores.risk}
                  note="Higher risk means tighter autonomy boundaries and stronger owner review."
                  inverse
                />
                <ScoreTile
                  label="Data sensitivity"
                  value={output.scores.dataSensitivity}
                  note="Maps privacy and regulated-data exposure into review gates."
                  inverse
                />
                <ScoreTile
                  label="Readiness"
                  value={output.scores.readiness}
                  note="Composite score for whether the slice is ready for agentic delivery."
                />

                <ul className="boundary-list">
                  {output.autonomyBoundaries.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="panel spec-panel">
              <div className="panel-header">
                <div>
                  <h2>{output.title}</h2>
                  <p>Compiled package for business, technical, and QA owners.</p>
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
              <span className="status-chip good">No runtime AI call</span>
              <span className="status-chip good">No data persistence</span>
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
