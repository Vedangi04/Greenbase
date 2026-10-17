export default function GreenBaseScore({ score }) {
  const color = score >= 80 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
  const label = score >= 80 ? "Good" : score >= 50 ? "At Risk" : "Critical";

  const R = 40;
  const CIRC = 2 * Math.PI * R;
  const dash = (score / 100) * CIRC;

  return (
    <div className="flex flex-col items-center group relative">
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="54" cy="54" r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          transform="rotate(-90 54 54)"
          style={{ transition: "stroke-dasharray 0.8s ease", filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
        <text x="54" y="50" textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="22" fontWeight="700" fontFamily="DM Sans, sans-serif">
          {score}
        </text>
        <text x="54" y="68" textAnchor="middle" dominantBaseline="middle"
          fill="#9ca3af" fontSize="9" fontFamily="Inter, sans-serif">
          {label}
        </text>
      </svg>
      <span className="text-xs font-semibold -mt-1" style={{ color: "#9ca3af" }}>GreenBase Score</span>

      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 w-56">
        <div className="text-xs rounded-xl px-3 py-2 shadow-xl leading-relaxed"
          style={{ background: "#1f2937", color: "#d1d5db", border: "1px solid rgba(255,255,255,0.1)" }}>
          Your score is based on how far your building is from meeting the stricter 2030 LL97 limits. 100 = zero emissions, 0 = 2× over the 2030 cap.
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "#1f2937" }} />
        </div>
      </div>
    </div>
  );
}
