import { useState } from "react";
import { Link } from "react-router-dom";
import { Lightbulb, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { calcCompliance } from "@/lib/buildingData";
import AIRecommendation from "@/components/retrofits/AIRecommendation";
import { RETROFITS, calcRetrofitEmissions, calcUpfrontCost } from "@/lib/retrofitData";
import RetrofitCard from "@/components/retrofits/RetrofitCard";
import RetrofitSummaryBar from "@/components/retrofits/RetrofitSummaryBar";
import { useBuilding, enrichBuilding } from "@/lib/BuildingContext";

function getRecommendation(selectedIds, compliance, building) {
  const hasHeatPump = selectedIds.includes("heat-pump");
  const hasLED = selectedIds.includes("led");
  const hasSolar = selectedIds.includes("solar");

  if (selectedIds.length === 0) {
    return "Select retrofit options above to model your compliance path. We recommend starting with Heat Pump Conversion for the biggest single impact.";
  }
  if (hasHeatPump && hasLED) {
    return "💡 Great combination! Heat pump + LED upgrade delivers excellent emissions reductions. With both selected, you're on track for full compliance at a competitive cost-per-ton-reduced.";
  }
  if (hasHeatPump) {
    return "💡 Strong start. Adding an LED Lighting Upgrade to your heat pump conversion could bring you to full compliance for ~$430k upfront, with a typical 5–6 year payback.";
  }
  if (hasSolar && hasLED) {
    return "💡 Solar + LED is a solid combination but may not be enough alone for high-emission buildings. Consider adding a Heat Pump Conversion for full compliance.";
  }
  return `💡 You've selected ${selectedIds.length} upgrade(s). Review the fine savings above to optimize your investment. Heat Pump Conversion typically offers the best compliance impact per dollar.`;
}

export default function Retrofits() {
  const { building: ctxBuilding } = useBuilding();
  const [selected, setSelected] = useState([]);

  const buildingId = new URLSearchParams(window.location.search).get("building");

  const building = (() => {
    if (ctxBuilding) return ctxBuilding;
    try {
      if (buildingId === "manual") {
        const raw = sessionStorage.getItem("greenbase_manual_building");
        if (raw) return enrichBuilding(JSON.parse(raw));
      }
      if (buildingId?.startsWith("nyc-")) {
        const raw = sessionStorage.getItem("greenbase_live_building");
        if (raw) return enrichBuilding(JSON.parse(raw));
      }
      const ls = localStorage.getItem("greenbase_selected");
      if (ls) return enrichBuilding(JSON.parse(ls));
    } catch { /* ignore */ }
    return null;
  })();

  // Build a compliance object compatible with existing child components
  const compliance = building ? {
    emissions: building.currentEmissions,
    overage2024: building.overage2024 ?? 0,
    fine2024: building.fine2024 ?? 0,
    overage2030: building.overage2030 ?? 0,
    fine2030: building.fine2030 ?? 0,
    fine2035: building.fine2035 ?? 0,
    compliant2024: building.compliant2024 ?? true,
    underBy2024: building.underBy2024 ?? 0,
  } : null;

  const toggleRetrofit = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (!building || !compliance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-2">No building selected</h2>
          <p className="text-muted-foreground mb-6">Search for a building first to model retrofits.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
            Search Buildings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const projectedEmissions = calcRetrofitEmissions(compliance.emissions, selected);
  const projectedCompliance = calcCompliance(building, projectedEmissions);
  const upfrontCost = calcUpfrontCost(selected);
  const annualSavings = compliance.fine2024 - projectedCompliance.fine2024;
  const payback =
    annualSavings > 0
      ? `${(upfrontCost / annualSavings).toFixed(1)} years`
      : selected.length > 0
      ? "No savings yet"
      : "—";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="min-h-screen bg-background pt-20 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/dashboard?building=${buildingId}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold font-heading text-foreground mt-3 mb-1">
            Model your path to compliance
          </h1>
          <p className="text-muted-foreground">
            Toggle upgrades to see how they reduce your fines and what they cost
          </p>
        </div>

        {/* Summary bar */}
        <div className="mb-6">
          <RetrofitSummaryBar
            currentFine={compliance.fine2024}
            projectedFine={projectedCompliance.fine2024}
            upfrontCost={upfrontCost}
            payback={payback}
          />
        </div>

        {/* Retrofit cards */}
        <div className="space-y-4 mb-8">
          {RETROFITS.map((retrofit) => {
            const isSelected = selected.includes(retrofit.id);
            // Calculate marginal savings from this specific retrofit
            const withoutThis = calcRetrofitEmissions(
              compliance.emissions,
              selected.filter((x) => x !== retrofit.id)
            );
            const withThis = calcRetrofitEmissions(compliance.emissions, [
              ...selected.filter((x) => x !== retrofit.id),
              retrofit.id,
            ]);
            const fineWithout = calcCompliance(building, withoutThis).fine2024;
            const fineWith = calcCompliance(building, withThis).fine2024;
            const marginalSavings = fineWithout - fineWith;

            return (
              <RetrofitCard
                key={retrofit.id}
                retrofit={retrofit}
                enabled={isSelected}
                onToggle={toggleRetrofit}
                fineSavings={marginalSavings}
                baseFine={compliance.fine2024}
              />
            );
          })}
        </div>

        {/* Static recommendation box */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-4">
          <p className="text-sm text-foreground leading-relaxed">
            {getRecommendation(selected, compliance, building)}
          </p>
        </div>

        {/* AI Recommendation */}
        <AIRecommendation building={building} compliance={compliance} />

        {/* CTA */}
        <Link
          to={`/incentives?building=${buildingId}`}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border text-foreground rounded-xl font-bold text-base hover:border-primary hover:text-primary transition-all shadow-sm"
        >
          <Lightbulb className="w-5 h-5" />
          Find incentives for these upgrades →
        </Link>
      </div>
    </motion.div>
  );
}
