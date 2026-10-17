import { useState } from "react";
import { Sparkles, Copy, Check, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIAdvisor({ building }) {
  const [state, setstate] = useState("idle"); // idle | loading | done | error
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setstate("loading");
    setText("");
    const prompt = `Analyze this NYC building and give compliance advice:

Building: ${building.name}
Address: ${building.address}
Type: ${building.type}
Size: ${building.sqft?.toLocaleString()} sq ft
Year built: ${building.yearBuilt}
Current emissions: ${(building.currentEmissions || building.emissions)?.toLocaleString()} tCO2e/year
GreenBase Score: ${building.score}/100
2024 annual fine: $${building.fine2024?.toLocaleString()}
2030 annual fine: $${building.fine2030?.toLocaleString()}

Write exactly 3 short paragraphs with no headers or bullet points:
1. How urgent is their situation and what's at stake financially
2. The single best retrofit strategy for this specific building type and age
3. The top 2 incentive programs they should apply for first and why

Be direct, dollar-focused, and specific. No generic advice.`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude_sonnet_4_6",
      });
      setText(result);
      setstate("done");
    } catch {
      setstate("error");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-emerald-200 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="text-base font-medium text-emerald-900">AI Advisor</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">Powered by Claude</span>
      </div>

      <div className="px-5 pb-5">
        {state === "idle" && (
          <>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Get a personalized compliance strategy for this building from Claude AI.
            </p>
            <button
              onClick={run}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Get AI Recommendation →
            </button>
          </>
        )}

        {state === "loading" && (
          <div className="flex items-center gap-3 py-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-emerald-700 font-medium">Claude is analyzing your building…</span>
          </div>
        )}

        {state === "done" && (
          <>
            <div className="space-y-3 mb-4">
              {text.split(/\n\n+/).filter(Boolean).map((para, i) => (
                <p key={i} className="text-sm leading-7" style={{ color: "#1a1a1a" }}>{para}</p>
              ))}
            </div>
            <div className="border-t border-emerald-200 pt-3 flex gap-3">
              <button
                onClick={run}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
          </>
        )}

        {state === "error" && (
          <div className="text-sm text-red-600">
            <p className="mb-2">Couldn't reach AI advisor. Check your API key in settings.</p>
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
