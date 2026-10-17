import { ExternalLink } from "lucide-react";

const SOURCE_STYLES = {
  Federal: { bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)",  color: "#60a5fa" },
  State:   { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.3)", color: "#a78bfa" },
  City:    { bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.3)",  color: "#4ade80" },
  Utility: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  color: "#fbbf24" },
};

const TYPE_STYLES = {
  "Tax Credit":  { bg: "rgba(96,165,250,0.1)",  color: "#60a5fa" },
  "Grant":       { bg: "rgba(74,222,128,0.1)",  color: "#4ade80" },
  "Rebate":      { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24" },
  "Loan":        { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  "Deduction":   { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
};

const DIFF_STYLES = {
  Easy:   { bg: "rgba(74,222,128,0.1)",  color: "#4ade80" },
  Medium: { bg: "rgba(251,191,36,0.1)",  color: "#fbbf24" },
  Hard:   { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
};

export default function IncentiveCard({ incentive }) {
  const src = SOURCE_STYLES[incentive.source] || SOURCE_STYLES.City;
  const typ = TYPE_STYLES[incentive.type] || { bg: "rgba(74,222,128,0.1)", color: "#4ade80" };
  const diff = DIFF_STYLES[incentive.difficulty] || DIFF_STYLES.Medium;

  return (
    <div className="rounded-2xl p-5 transition-all duration-300"
      style={{ background: "rgba(31,41,55,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(74,222,128,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "rgba(31,41,55,0.8)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = ""; e.currentTarget.style.background = "rgba(31,41,55,0.6)"; }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-bold font-heading leading-tight" style={{ color: "#f9fafb" }}>
          {incentive.name}
        </h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 uppercase tracking-wide"
          style={{ background: src.bg, border: `1px solid ${src.border}`, color: src.color }}>
          {incentive.source}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: typ.bg, color: typ.color }}>{incentive.type}</span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: diff.bg, color: diff.color }}>{incentive.difficulty} to apply</span>
      </div>

      <div className="text-xl font-bold font-heading mb-2" style={{ color: "#4ade80" }}>
        {incentive.amount}
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: "#9ca3af" }}>
        {incentive.description}
      </p>

      <a
        href={incentive.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all px-4 py-2 rounded-lg"
        style={{ background: "transparent", border: "1px solid rgba(74,222,128,0.35)", color: "#4ade80" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(74,222,128,0.15)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = ""; }}
      >
        Apply Now
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
