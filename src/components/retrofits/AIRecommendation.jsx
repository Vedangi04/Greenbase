import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Loader2 } from "lucide-react";

function fmt(n) {
  if (!n) return "$0";
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

export default function AIRecommendation({ building, compliance }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    setAdvice("");
    setDone(false);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Building: ${building.name}, Type: ${building.type}, Size: ${building.sqft?.toLocaleString()} sqft, Built: ${building.yearBuilt || "unknown"}, Current emissions: ${compliance.emissions || compliance.currentEmissions} tCO2e/yr, 2024 annual fine: ${fmt(compliance.fine2024)}, 2030 annual fine: ${fmt(compliance.fine2030)}`,
        system_prompt: `You are a NYC building energy compliance expert. Given a building's profile, write a concise 3-paragraph recommendation: (1) urgency of their situation, (2) the single best retrofit combination for their specific building type and size, (3) top 2 incentives they should apply for first. Be specific with dollar amounts. Keep it under 150 words.`,
        response_json_schema: { type: "object", properties: { recommendation: { type: "string" } }, required: ["recommendation"] },
      });
      setAdvice(res.recommendation || "");
    } catch (e) {
      setAdvice("Could not generate recommendation. Please try again.");
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/20 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <span className="font-bold text-foreground font-heading">AI Recommendation</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium ml-auto">
          Powered by GreenBase AI
        </span>
      </div>

      {!done && !loading && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Get a personalized compliance recommendation based on your building's exact profile.
          </p>
          <button
            onClick={handleGetAdvice}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Get AI Advice
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 py-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Analyzing your building profile…</span>
        </div>
      )}

      {done && advice && (
        <div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{advice}</p>
          <button
            onClick={handleGetAdvice}
            className="mt-3 text-xs text-primary hover:underline font-medium"
          >
            Regenerate →
          </button>
        </div>
      )}
    </div>
  );
}
