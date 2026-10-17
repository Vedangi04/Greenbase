import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 shadow-xl text-sm"
        style={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="font-semibold mb-1" style={{ color: "#f9fafb" }}>{label}</div>
        <div className="text-lg font-bold" style={{ color: "#f9fafb" }}>${payload[0].value.toLocaleString()}</div>
        <div style={{ color: "#9ca3af", fontSize: 11 }}>annual fine</div>
      </div>
    );
  }
  return null;
};

export default function FineProjectionChart({ compliance }) {
  const [animatedFines, setAnimatedFines] = useState([0, 0, 0]);
  const rawFines = [compliance.fine2024, compliance.fine2030, compliance.fine2035];
  const colors = ["#fbbf24", "#f87171", "#ef4444"];
  const delays = [0, 300, 600];

  useEffect(() => {
    const timers = rawFines.map((fine, i) =>
      setTimeout(() => {
        setAnimatedFines((prev) => { const next = [...prev]; next[i] = fine; return next; });
      }, delays[i])
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const data = [
    { year: "2024", fine: animatedFines[0] },
    { year: "2030", fine: animatedFines[1] },
    { year: "2035", fine: animatedFines[2] },
  ];

  const formatYAxis = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="rounded-2xl p-6"
      style={{ background: "rgba(31,41,55,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <h3 className="font-bold mb-1" style={{ color: "#f9fafb" }}>Your fine trajectory if nothing changes</h3>
      <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>
        2030 limits tighten ~50%, making fines significantly larger without action
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 600, fill: "#9ca3af" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="fine" radius={[8, 8, 0, 0]} maxBarSize={80} isAnimationActive animationDuration={700} animationEasing="ease-out">
            {data.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {compliance.fine2024 === 0 && (
        <div className="mt-4 p-3 rounded-xl text-sm"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
          ⚠️ Your building is compliant today, but the 2030 limits will likely require action. Plan your retrofit strategy now.
        </div>
      )}
    </div>
  );
}
