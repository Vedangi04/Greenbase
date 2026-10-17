import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

function formatCurrency(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function RetrofitCard({ retrofit, enabled, onToggle, fineSavings }) {
  const midCost = (retrofit.costMin + retrofit.costMax) / 2;
  const payback = fineSavings > 0 ? (midCost / fineSavings).toFixed(1) : "—";

  const prevEnabled = useRef(enabled);
  const [glowClass, setGlowClass] = useState("");

  useEffect(() => {
    if (prevEnabled.current !== enabled) {
      prevEnabled.current = enabled;
      setGlowClass(enabled ? "glow-green" : "glow-red");
      const t = setTimeout(() => setGlowClass(""), 420);
      return () => clearTimeout(t);
    }
  }, [enabled]);

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 cursor-pointer ${glowClass}`}
      style={{
        background: enabled ? "rgba(74,222,128,0.05)" : "rgba(31,41,55,0.6)",
        border: enabled ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: enabled ? "0 0 20px rgba(74,222,128,0.05)" : "none",
      }}
      onClick={() => onToggle(retrofit.id)}
      onMouseEnter={e => { if (!enabled) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(31,41,55,0.8)"; } }}
      onMouseLeave={e => { if (!enabled) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(31,41,55,0.6)"; } }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold font-heading" style={{ color: enabled ? "#4ade80" : "#f9fafb" }}>{retrofit.name}</h3>
            {retrofit.incentiveEligible && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                <Zap className="w-2.5 h-2.5" />
                Incentive eligible
              </span>
            )}
            {retrofit.isAnnual && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
                Annual cost
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{retrofit.description}</p>
        </div>

        {/* Custom toggle */}
        <div
          className="flex-shrink-0 mt-0.5 rounded-full relative transition-all duration-300"
          style={{
            width: 44, height: 24,
            background: enabled ? "linear-gradient(90deg,#16a34a,#0d9488)" : "#374151",
            boxShadow: enabled ? "0 0 12px rgba(22,163,74,0.4)" : "none",
            cursor: "pointer",
          }}
          onClick={(e) => { e.stopPropagation(); onToggle(retrofit.id); }}
        >
          <div style={{
            width: 18, height: 18,
            background: "white",
            borderRadius: "50%",
            position: "absolute",
            top: 3,
            left: 3,
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            transform: enabled ? "translateX(20px)" : "translateX(0)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <div className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Est. cost</div>
          <div className="font-semibold text-sm" style={{ color: "#f9fafb" }}>
            {formatCurrency(retrofit.costMin)}–{formatCurrency(retrofit.costMax)}
          </div>
        </div>
        <div>
          <div className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Emissions cut</div>
          <div className="font-semibold text-sm" style={{ color: "#4ade80" }}>
            ↓ {(retrofit.emissionsReduction * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Fine savings</div>
          <div className="font-semibold text-sm" style={{ color: fineSavings > 0 ? "#4ade80" : "#6b7280" }}>
            {fineSavings > 0 ? `$${Math.round(fineSavings).toLocaleString()}/yr` : "—"}
          </div>
        </div>
        <div>
          <div className="text-xs mb-0.5" style={{ color: "#6b7280" }}>Payback</div>
          <div className="font-semibold text-sm" style={{ color: "#f9fafb" }}>
            {payback !== "—" ? `${payback} yrs` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
