import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, X, ArrowRight, Building2 } from "lucide-react";
import { searchBuildings, calcCompliance } from "@/lib/buildingData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COL_COLORS = ["#10B981", "#0d9488", "#3B82F6"];
const COL_BG = ["bg-emerald-50 border-emerald-200", "bg-teal-50 border-teal-200", "bg-blue-50 border-blue-200"];
const COL_HEADER = ["bg-emerald-500", "bg-teal-500", "bg-blue-500"];

function formatMoney(n) {
  if (!n && n !== 0) return "—";
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function getRetroRec(compliance, building) {
  if (compliance.compliant2024 && compliance.fine2030 === 0) return "Compliant through 2030";
  if (compliance.overage2024 > 5000) return "Heat pump + LED upgrade";
  if (compliance.overage2024 > 1000) return "Heat pump conversion";
  if (compliance.fine2030 > 500000) return "Heat pump + solar";
  return "LED + smart BMS";
}

export default function Compare() {
  const [buildings, setBuildings] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const v = e.target.value;
    setQuery(v);
    setResults(v.length >= 2 ? searchBuildings(v) : []);
  };

  const addBuilding = (b) => {
    if (buildings.length >= 3) return;
    if (buildings.find((x) => x.id === b.id)) return;
    setBuildings((prev) => [...prev, b]);
    setQuery("");
    setResults([]);
  };

  const removeBuilding = (id) => setBuildings((p) => p.filter((b) => b.id !== id));

  const complianceData = buildings.map((b) => calcCompliance(b));

  // Row definitions
  const rows = [
    { label: "Building type", getValue: (b) => b.type, compare: false },
    { label: "Square footage", getValue: (b) => b.sqft.toLocaleString() + " sq ft", compareNum: (b) => b.sqft, higherIsBetter: true },
    { label: "Current emissions", getValue: (b, c) => `${c.emissions.toLocaleString()} tCO₂e/yr`, compareNum: (b, c) => c.emissions, higherIsBetter: false },
    { label: "2024 annual fine", getValue: (b, c) => formatMoney(c.fine2024), compareNum: (b, c) => c.fine2024, higherIsBetter: false },
    { label: "2030 annual fine", getValue: (b, c) => formatMoney(c.fine2030), compareNum: (b, c) => c.fine2030, higherIsBetter: false },
    { label: "Emissions intensity", getValue: (b) => `${b.emissionsIntensity.toFixed(5)} tCO₂e/sqft`, compareNum: (b) => b.emissionsIntensity, higherIsBetter: false },
    { label: "2024 status", getValue: (b, c) => c.compliant2024 ? "✅ Compliant" : "⚠️ Over Limit", compare: false },
    { label: "Best retrofit rec.", getValue: (b, c) => getRetroRec(c, b), compare: false },
  ];

  const chartData = buildings.length > 0
    ? [
        { year: "2024", ...Object.fromEntries(buildings.map((b, i) => [b.name.slice(0, 18), complianceData[i].fine2024])) },
        { year: "2030", ...Object.fromEntries(buildings.map((b, i) => [b.name.slice(0, 18), complianceData[i].fine2030])) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to search</Link>
          <h1 className="text-3xl font-bold font-heading text-foreground mt-3 mb-1">Compare Buildings</h1>
          <p className="text-muted-foreground">Add up to 3 buildings to compare their compliance side by side</p>
        </div>

        {/* Search to add */}
        {buildings.length < 3 && (
          <div className="relative mb-8 max-w-lg">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search a building to add..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
            />
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-xl z-20 overflow-hidden">
                {results.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => addBuilding(b)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left border-b border-border last:border-0 text-sm"
                  >
                    <Plus className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.address}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {buildings.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Search for buildings above to start comparing</p>
            <p className="text-sm mt-1">Try "Empire State Building" or "Hilton"</p>
          </div>
        )}

        {buildings.length > 0 && (
          <>
            {/* Comparison table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground w-44">Metric</th>
                    {buildings.map((b, i) => (
                      <th key={b.id} className="px-4 py-3 min-w-[200px]">
                        <div className={`rounded-xl p-3 text-white ${COL_HEADER[i]} relative`}>
                          <button
                            onClick={() => removeBuilding(b.id)}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="font-bold text-sm leading-tight pr-4">{b.name}</div>
                          <div className="text-xs opacity-75 mt-0.5">{b.address.split(",")[0]}</div>
                          <Link
                            to={`/dashboard?building=${b.id}`}
                            className="inline-flex items-center gap-1 mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-all"
                          >
                            View report <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const nums = row.compareNum
                      ? buildings.map((b, i) => row.compareNum(b, complianceData[i]))
                      : null;
                    const minVal = nums ? Math.min(...nums) : null;
                    const maxVal = nums ? Math.max(...nums) : null;

                    return (
                      <tr key={row.label} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-muted-foreground">{row.label}</td>
                        {buildings.map((b, i) => {
                          const val = row.getValue(b, complianceData[i]);
                          const num = nums ? nums[i] : null;
                          let cellBg = "";
                          if (nums && buildings.length > 1) {
                            const isBest = row.higherIsBetter ? num === maxVal : num === minVal;
                            const isWorst = row.higherIsBetter ? num === minVal : num === maxVal;
                            if (isBest) cellBg = "bg-green-50";
                            else if (isWorst) cellBg = "bg-red-50";
                          }
                          return (
                            <td key={b.id} className={`px-4 py-3 text-sm font-semibold text-foreground text-center ${cellBg} transition-colors`}>
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-1 font-heading">Fine comparison: 2024 vs 2030</h3>
              <p className="text-sm text-muted-foreground mb-5">Side-by-side annual fine projection if no action is taken</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 600, fill: "#64748B" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickFormatter={(v) => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`}
                  />
                  <Tooltip
                    formatter={(v) => [`$${v.toLocaleString()}`, ""]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  />
                  <Legend />
                  {buildings.map((b, i) => (
                    <Bar key={b.id} dataKey={b.name.slice(0, 18)} fill={COL_COLORS[i]} radius={[6, 6, 0, 0]} maxBarSize={60} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
