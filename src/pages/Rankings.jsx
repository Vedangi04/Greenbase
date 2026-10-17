import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, AlertTriangle, MapPin } from "lucide-react";
import { WORST_OFFENDERS, TOP_PERFORMERS, BOROUGHS, getBuildingsByBorough } from "@/lib/staticData";
import { useBuilding } from "@/lib/BuildingContext";

const TYPE_ICONS = { office:"🏢", hotel:"🏨", multifamily:"🏘", retail:"🏪", warehouse:"🏭", education:"🎓", hospital:"🏥" };

function fmt(n) {
  if (!n) return "—";
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${n}`;
}

function ScoreCircle({ score }) {
  const color = score >= 80
    ? "bg-green-100 text-green-700 ring-green-200"
    : score >= 50
    ? "bg-amber-100 text-amber-700 ring-amber-200"
    : "bg-red-100 text-red-700 ring-red-200";
  return (
    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ring-2 ${color}`}>
      {score}
    </span>
  );
}

function StatusPill({ compliant }) {
  return compliant
    ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Compliant</span>
    : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">Over Limit</span>;
}

function BuildingTable({ rows, startRank = 1 }) {
  const navigate = useNavigate();
  const { selectBuilding } = useBuilding();

  const handleClick = (b) => {
    selectBuilding(b);
    navigate(`/dashboard?building=${b.id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Building</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Borough</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Type</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Score</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">2030 Fine</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr
                key={b.id}
                onClick={() => handleClick(b)}
                className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm font-bold text-muted-foreground">{startRank + i}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base flex-shrink-0">{TYPE_ICONS[b.type] || "🏢"}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-foreground leading-tight truncate max-w-[160px] sm:max-w-[220px]">{b.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[160px] sm:max-w-[220px]">{b.address}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{b.borough}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize hidden md:table-cell">{b.type}</td>
                <td className="px-4 py-3 text-center"><ScoreCircle score={b.score} /></td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-destructive hidden sm:table-cell">{fmt(b.fine2030)}</td>
                <td className="px-4 py-3 text-center hidden lg:table-cell"><StatusPill compliant={b.isCompliant2024} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = [
  { id: "worst", label: "🔴 Worst Offenders", icon: AlertTriangle, activeClass: "bg-red-500 text-white" },
  { id: "best",  label: "🟢 Top Performers",  icon: Trophy,        activeClass: "bg-green-500 text-white" },
  { id: "borough", label: "🏙️ By Borough",    icon: MapPin,        activeClass: "bg-primary text-white" },
];

export default function Rankings() {
  const [tab, setTab] = useState("worst");
  const [borough, setBorough] = useState("Manhattan");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-background pt-20 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-heading text-foreground mb-1">NYC LL97 Rankings</h1>
          <p className="text-muted-foreground text-sm">50 real NYC buildings ranked by compliance. Click any row to open its dashboard.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id ? t.activeClass + " shadow-sm" : "bg-white border border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Borough sub-filter */}
        {tab === "borough" && (
          <div className="flex flex-wrap gap-2 mb-4">
            {BOROUGHS.map((b) => (
              <button
                key={b}
                onClick={() => setBorough(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  borough === b ? "bg-primary text-white border-primary" : "bg-white border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}

        {/* Tables */}
        {tab === "worst"   && <BuildingTable rows={WORST_OFFENDERS} />}
        {tab === "best"    && <BuildingTable rows={TOP_PERFORMERS} />}
        {tab === "borough" && <BuildingTable rows={getBuildingsByBorough(borough)} />}
      </div>
    </motion.div>
  );
}
