import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { INCENTIVES } from "@/lib/incentiveData";
import IncentiveCard from "@/components/incentives/IncentiveCard";
import { useBuilding, enrichBuilding } from "@/lib/BuildingContext";

function calcTotalPotential(building) {
  if (!building) return 0;
  let total = 0;
  INCENTIVES.forEach((inc) => {
    if (inc.maxValue) {
      total += inc.maxValue;
    } else if (inc.perSqft && inc.id === "ira-179d") {
      total += 5 * building.sqft;
    } else if (inc.perSqft && inc.id === "green-roof") {
      total += 15 * Math.min(building.sqft * 0.1, 50000); // assume 10% of sqft
    }
  });
  return total;
}

export default function Incentives() {
  const { building: ctxBuilding } = useBuilding();
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

  const totalPotential = calcTotalPotential(building);

  if (!building) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-2">No building selected</h2>
          <p className="text-muted-foreground mb-6">Search for a building first to see available incentives.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
            Search Buildings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="min-h-screen bg-background pt-20 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to={`/dashboard?building=${buildingId}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-heading text-foreground mb-1">
            Money available for your building
          </h1>
          <p className="text-muted-foreground">
            Based on your building type and selected upgrades, you qualify for:
          </p>
        </div>

        {/* Total potential banner */}
        <div className="bg-secondary rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-white/70">Total available incentives</span>
          </div>
          <div className="text-4xl font-bold font-heading text-primary mb-1">
            up to ${totalPotential.toLocaleString()}
          </div>
          <div className="text-sm text-white/60">
            Across all eligible programs for {building.name}
          </div>
        </div>

        {/* Building context */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{building.name}</span> is a {building.type.toLowerCase()} building with{" "}
            {building.sqft.toLocaleString()} sq ft built in {building.yearBuilt}. All programs below apply to your building type.
          </p>
        </div>

        {/* Incentive cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {INCENTIVES.map((incentive) => (
            <IncentiveCard key={incentive.id} incentive={incentive} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-white border border-border rounded-2xl p-6 text-center shadow-sm">
          <h3 className="font-bold text-foreground font-heading mb-2">
            Ready to move forward?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            NYC Accelerator provides free advisory services to help you apply for all eligible programs and find qualified contractors.
          </p>
          <a
            href="https://www.nyc.gov/site/sustainability/buildings/nyc-accelerator.page"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all"
          >
            Get Free Advisory →
          </a>
        </div>
      </div>
    </motion.div>
  );
}
