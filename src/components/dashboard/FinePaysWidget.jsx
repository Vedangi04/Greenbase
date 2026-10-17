import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const INCENTIVE_OFFSET = 150000; // avg incentive pool assumption
const RETROFIT_COST    = 450000; // avg recommended combo cost

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function FinePaysWidget({ compliance, building }) {
  const { fine2024, fine2030 } = compliance;

  const data = useMemo(() => {
    const years = [];
    let cumFine = 0;
    let cumRetrofit = null;
    const netCost = Math.max(0, RETROFIT_COST - INCENTIVE_OFFSET);

    for (let yr = 2024; yr <= 2040; yr++) {
      const annualFine = yr < 2030 ? fine2024 : fine2030;
      cumFine += annualFine;

      if (cumRetrofit === null) {
        cumRetrofit = netCost;
      } else {
        const annualSaving = annualFine; // fines avoided
        cumRetrofit = Math.max(0, cumRetrofit - annualSaving);
      }
      years.push({ year: yr, fine: Math.round(cumFine), retrofit: Math.round(cumRetrofit) });
    }
    return years;
  }, [fine2024, fine2030]);

  // Find break-even: first year where retrofit cumulative cost <= cumulative fine paid
  const breakEven = data.find((d, i) => i > 0 && d.retrofit <= d.fine);
  const totalFine = data[data.length - 1].fine;
  const netRetrofitCost = Math.max(0, RETROFIT_COST - INCENTIVE_OFFSET);
  const totalSaved = totalFine - netRetrofitCost;

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <h3 className="font-bold text-foreground font-heading mb-1">Pay the fine or fix it?</h3>
      <p className="text-sm text-muted-foreground mb-5">16-year cumulative cost comparison (2024–2040)</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Pay fine */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2">💸 Pay the fine</div>
          <div className="text-2xl font-bold text-red-600 font-heading">{fmt(totalFine)}</div>
          <div className="text-xs text-red-400 mt-1">paid over 16 years</div>
          <div className="text-xs text-red-500 mt-2 font-medium">Still non-compliant — fines keep rising after 2030</div>
        </div>
        {/* Fix it */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">✅ Fix it (recommended)</div>
          <div className="text-2xl font-bold text-green-700 font-heading">{fmt(netRetrofitCost)}</div>
          <div className="text-xs text-green-500 mt-1">net cost after incentives</div>
          {breakEven && (
            <div className="text-xs text-green-600 mt-2 font-medium">Break-even: {breakEven.year}</div>
          )}
          {totalSaved > 0 && (
            <div className="text-xs text-green-600 font-medium">{fmt(totalSaved)} saved by 2040</div>
          )}
        </div>
      </div>

      {/* Mini incentive breakdown */}
      <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mb-5 flex flex-wrap gap-3">
        <span>Retrofit cost: <strong>{fmt(RETROFIT_COST)}</strong></span>
        <span>– Available incentives: <strong className="text-green-600">−{fmt(INCENTIVE_OFFSET)}</strong></span>
        <span>= Net cost: <strong>{fmt(netRetrofitCost)}</strong></span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94A3B8" }}
            tickFormatter={v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`} />
          <Tooltip
            formatter={(v, name) => [fmt(v), name === "fine" ? "Cumulative fines" : "Net retrofit cost"]}
            contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12 }}
          />
          {breakEven && (
            <ReferenceLine x={breakEven.year} stroke="#10B981" strokeDasharray="4 4"
              label={{ value: "Break-even", position: "top", fontSize: 10, fill: "#10B981" }} />
          )}
          <Line type="monotone" dataKey="fine" stroke="#EF4444" strokeWidth={2} dot={false} name="fine" />
          <Line type="monotone" dataKey="retrofit" stroke="#10B981" strokeWidth={2} dot={false} name="retrofit" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
