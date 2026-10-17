import { Building2, MapPin, Ruler, Calendar } from "lucide-react";

const TYPE_COLORS = {
  Office:      { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)",  text: "#60a5fa" },
  Hotel:       { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#a78bfa" },
  Multifamily: { bg: "rgba(45,212,191,0.1)",  border: "rgba(45,212,191,0.3)",  text: "#2dd4bf" },
  Retail:      { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  text: "#fbbf24" },
  Warehouse:   { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.3)",  text: "#fbbf24" },
  Education:   { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.3)",  text: "#60a5fa" },
  Hospital:    { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", text: "#f87171" },
};

export default function BuildingSummaryCard({ building }) {
  const tc = TYPE_COLORS[building.type] || { bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", text: "#4ade80" };

  return (
    <div className="rounded-2xl p-6"
      style={{ background: "rgba(31,41,55,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
            <Building2 className="w-6 h-6" style={{ color: "#4ade80" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading" style={{ color: "#f9fafb" }}>{building.name}</h1>
            <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: "#9ca3af" }}>
              <MapPin className="w-3.5 h-3.5" />
              {building.address}
            </div>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text }}>
          {building.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-6 mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
          <Ruler className="w-4 h-4" />
          <span>
            <span className="font-semibold" style={{ color: "#f9fafb" }}>{building.sqft.toLocaleString()}</span> sq ft
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
          <Calendar className="w-4 h-4" />
          <span>
            Built <span className="font-semibold" style={{ color: "#f9fafb" }}>{building.yearBuilt}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
