import { useState } from "react";
import { Bot, Play, Loader2, Wrench, RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { runComplianceAgent } from "@/lib/complianceAgent";

const TOOL_LABELS = {
  get_compliance: "Checked compliance status",
  list_retrofits: "Reviewed retrofit options",
  simulate_retrofits: "Simulated retrofits",
  find_incentives: "Searched incentives",
  peer_benchmark: "Benchmarked against peers",
};

// Short human-readable summary of what a tool returned.
function summarize(step) {
  const o = step.observation;
  if (o?.error) return `Error: ${o.error}`;
  switch (step.action) {
    case "get_compliance":
      return `${o.emissions_tCO2e.toLocaleString()} tCO₂e/yr · 2024 fine $${o.annual_fine_2024_usd.toLocaleString()} · 2030 fine $${o.annual_fine_2030_usd.toLocaleString()}`;
    case "list_retrofits":
      return `${o.length} options available`;
    case "simulate_retrofits":
      return `${(step.args?.retrofit_ids || []).join(" + ")} → 2030 fine $${o.annual_fine_2030_usd.toLocaleString()}/yr, upfront $${o.upfront_cost_usd.toLocaleString()}${
        o.payback_years_vs_2030_fines ? `, payback ${o.payback_years_vs_2030_fines} yrs` : ""
      }`;
    case "find_incentives":
      return `${o.length} matching programs`;
    case "peer_benchmark":
      return o.peers ? `${o.peers} peers · ${o.peers_non_compliant_2024} non-compliant in 2024` : o.note;
    default:
      return "";
  }
}

// Adapter: the agent only needs "prompt + schema in, parsed object out".
const llm = ({ prompt, response_json_schema }) =>
  base44.integrations.Core.InvokeLLM({ prompt, response_json_schema });

export default function ComplianceAgent({ building }) {
  const [status, setStatus] = useState("idle"); // idle | running | done | error
  const [steps, setSteps] = useState([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setStatus("running");
    setSteps([]);
    setAnswer("");
    setError("");
    try {
      const result = await runComplianceAgent({
        building,
        llm,
        onStep: (s) => setSteps((prev) => [...prev, s]),
      });
      setAnswer(result.answer);
      setStatus("done");
    } catch (e) {
      setError(e?.message || "The agent could not finish.");
      setStatus("error");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-emerald-200 overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-700" />
          <span className="text-base font-medium text-emerald-900">Compliance Agent</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">Plans with tools, not guesses</span>
      </div>

      <div className="px-5 pb-5">
        {status === "idle" && (
          <>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              An agent that investigates this building step by step: it checks your compliance status, simulates
              retrofit combinations, looks up incentives and benchmarks you against peers, then recommends a plan.
              Every number comes from the app's calculations, not from the model.
            </p>
            <button
              onClick={run}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
            >
              <Play className="w-4 h-4" />
              Run compliance agent
            </button>
          </>
        )}

        {status !== "idle" && (
          <ol className="space-y-2 mb-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-3 h-3 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-800">{TOOL_LABELS[s.action] || s.action}</div>
                  {s.thought && <div className="text-xs text-gray-500 italic">{s.thought}</div>}
                  <div className={`text-xs mt-0.5 break-words ${s.observation?.error ? "text-red-600" : "text-gray-600"}`}>
                    {summarize(s)}
                  </div>
                </div>
              </li>
            ))}
            {status === "running" && (
              <li className="flex items-center gap-3 text-sm text-emerald-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                {steps.length === 0 ? "Starting…" : "Thinking about the next step…"}
              </li>
            )}
          </ol>
        )}

        {status === "done" && (
          <>
            <div className="border-t border-emerald-100 pt-4 space-y-3 mb-4">
              {answer.split(/\n\n+/).filter(Boolean).map((para, i) => (
                <p key={i} className="text-sm leading-7" style={{ color: "#1a1a1a" }}>{para}</p>
              ))}
            </div>
            <div className="border-t border-emerald-100 pt-3 flex gap-3">
              <button onClick={run} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Run again
              </button>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy plan"}
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="text-sm text-red-600">
            <p className="mb-2 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Couldn't complete the analysis. {error}</span>
            </p>
            <button
              onClick={run}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
