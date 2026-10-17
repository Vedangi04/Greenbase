import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";

function calcPayVsFix(building) {
  const fine2024 = building.fine2024 || 0;
  const fine2030 = building.fine2030 || 0;

  // Pay path — cumulative fines
  let cumulativePay = 0;
  const payByYear = {};
  for (let yr = 2024; yr <= 2040; yr++) {
    cumulativePay += yr < 2030 ? fine2024 : fine2030;
    payByYear[yr] = cumulativePay;
  }

  // Fix path — upfront cost then avoid fines
  const upgradeCost = Math.round((building.sqft || 0) * 9.2);
  const incentiveCoverage = Math.round(upgradeCost * 0.35);
  const netCost = upgradeCost - incentiveCoverage;
  const annualSaving = fine2030;

  const fixByYear = {};
  let cumulativeFix = -netCost;
  for (let yr = 2024; yr <= 2040; yr++) {
    if (yr > 2024) cumulativeFix += annualSaving;
    fixByYear[yr] = cumulativeFix;
  }

  const breakEvenYear = Object.keys(fixByYear).find((yr) => fixByYear[yr] >= 0) || null;
  const totalSavedBy2040 = payByYear[2040] - netCost;

  return { payByYear, fixByYear, upgradeCost, incentiveCoverage, netCost, annualSaving, breakEvenYear, totalPayCost: cumulativePay, totalSavedBy2040 };
}

function fmt(n) {
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${n}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value < 0 ? `-$${Math.abs(Math.round(p.value)).toLocaleString()} invested` : `$${Math.round(p.value).toLocaleString()} position`}
        </p>
      ))}
    </div>
  );
};

export default function PayVsFixChart({ building }) {
  const calc = calcPayVsFix(building);
  const years = Array.from({ length: 17 }, (_, i) => 2024 + i);
  const data = years.map((yr) => ({
    year: yr,
    "Pay the fine": calc.payByYear[yr],
    "Fix it": calc.fixByYear[yr],
  }));

  const summaryCards = [
    {
      label: "Total fines by 2040 (if nothing changes)",
      value: fmt(calc.totalPayCost),
      sub: null,
      color: "bg-red-50 border-red-200 text-red-700",
      valueColor: "text-red-600",
    },
    {
      label: "Upfront upgrade cost",
      value: fmt(calc.upgradeCost),
      sub: `-${fmt(calc.incentiveCoverage)} from incentives = ${fmt(calc.netCost)} net`,
      color: "bg-blue-50 border-blue-200 text-blue-700",
      valueColor: "text-blue-600",
    },
    {
      label: "You break even in",
      value: calc.breakEvenYear ? `${calc.breakEvenYear}` : "2040+",
      sub: "Then you're saving every year after",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      valueColor: "text-emerald-600",
    },
    {
      label: "Total saved by 2040",
      value: fmt(Math.max(0, calc.totalSavedBy2040)),
      sub: "Compared to paying fines forever",
      color: "bg-emerald-50 border-emerald-200 text-emerald-700",
      valueColor: "text-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-foreground">Pay the fine or fix it?</h3>
        <p className="text-xs text-muted-foreground mt-0.5">16-year financial comparison (2024–2040)</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={2} />
          <YAxis
            tickFormatter={(v) => fmt(v)}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {calc.breakEvenYear && (
            <ReferenceLine
              x={parseInt(calc.breakEvenYear)}
              stroke="#9CA3AF"
              strokeDasharray="4 4"
              label={{ value: "Break-even", position: "insideTopLeft", fontSize: 10, fill: "#6B7280" }}
            />
          )}
          <ReferenceLine y={0} stroke="#E5E7EB" />
          <Line
            type="monotone"
            dataKey="Pay the fine"
            stroke="#EF4444"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Fix it"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {summaryCards.map((c) => (
          <div key={c.label} className={`rounded-xl border p-4 ${c.color}`}>
            <p className="text-xs font-medium opacity-80 leading-tight mb-1.5">{c.label}</p>
            <p className={`text-xl font-bold ${c.valueColor}`}>{c.value}</p>
            {c.sub && <p className="text-xs mt-1 opacity-70">{c.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
