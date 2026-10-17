import { TrendingUp, Target, AlertCircle, DollarSign } from "lucide-react";

const VARIANTS = {
  default: { bg: "rgba(31,41,55,0.6)", border: "rgba(255,255,255,0.08)", valueColor: "#f9fafb" },
  danger:  { bg: "rgba(239,68,68,0.06)",  border: "rgba(239,68,68,0.2)",  valueColor: "#f87171" },
  good:    { bg: "rgba(74,222,128,0.06)", border: "rgba(74,222,128,0.2)", valueColor: "#4ade80" },
  warning: { bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.2)", valueColor: "#fbbf24" },
};

function MetricCard({ icon: Icon, label, value, sublabel, variant = "default", delay = 0 }) {
  const v = VARIANTS[variant];
  return (
    <div className="rounded-2xl p-5 transition-all duration-300"
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        animation: `pageIn 0.5s ease ${delay}s both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: "#6b7280" }} />
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#9ca3af" }}>{label}</span>
      </div>
      <div className="text-2xl sm:text-3xl font-bold font-heading" style={{ color: v.valueColor, lineHeight: 1 }}>
        {value}
      </div>
      {sublabel && <div className="text-xs mt-1.5" style={{ color: "#6b7280" }}>{sublabel}</div>}
    </div>
  );
}

export default function MetricCards({ compliance, building }) {
  const { emissions, overage2024, fine2024, compliant2024 } = {
    emissions: compliance.emissions,
    cap2024: building.cap2024,
    overage2024: compliance.overage2024,
    fine2024: compliance.fine2024,
    compliant2024: compliance.compliant2024,
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard icon={TrendingUp} label="Current Emissions" value={`${emissions.toLocaleString()} tCO₂e`} sublabel="per year" variant="default" delay={0.1} />
      <MetricCard icon={Target} label="Your 2024 Limit" value={`${building.cap2024.toLocaleString()} tCO₂e`} sublabel="per year" variant={compliant2024 ? "good" : "default"} delay={0.2} />
      <MetricCard
        icon={AlertCircle}
        label="Tons Over Limit"
        value={compliant2024 ? `−${compliance.underBy2024.toLocaleString()}` : `+${overage2024.toLocaleString()}`}
        sublabel={compliant2024 ? "under — you're safe" : "excess emissions"}
        variant={compliant2024 ? "good" : "danger"}
        delay={0.3}
      />
      <MetricCard
        icon={DollarSign}
        label="2024 Annual Fine"
        value={fine2024 === 0 ? "$0" : `$${fine2024.toLocaleString()}`}
        sublabel={fine2024 === 0 ? "no fines this period" : "owed annually by May 1st"}
        variant={fine2024 === 0 ? "good" : "danger"}
        delay={0.4}
      />
    </div>
  );
}
