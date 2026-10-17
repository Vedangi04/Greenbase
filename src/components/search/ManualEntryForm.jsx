import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calcLimits, estimateEmissionsFromCosts, FINE_PER_TON, calcFines } from "@/lib/nycOpenData";
import { useBuilding } from "@/lib/BuildingContext";

const BUILDING_TYPES = [
  { label: "Office", value: "office" },
  { label: "Multifamily Housing", value: "multifamily" },
  { label: "Hotel", value: "hotel" },
  { label: "Retail Store", value: "retail" },
  { label: "Warehouse", value: "warehouse" },
  { label: "School / University", value: "education" },
  { label: "Hospital", value: "hospital" },
];

export default function ManualEntryForm({ address, onClose }) {
  const [form, setForm] = useState({
    buildingType: "office",
    sqft: "",
    monthlyElec: "",
    monthlyGas: "",
  });
  const navigate = useNavigate();
  const { selectBuilding } = useBuilding();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const sqft = parseFloat(form.sqft) || 0;
    const emissions = estimateEmissionsFromCosts(
      parseFloat(form.monthlyElec) || 0,
      parseFloat(form.monthlyGas) || 0
    );
    const limits = calcLimits(sqft, form.buildingType);
    const fines = calcFines(Math.round(emissions), sqft, form.buildingType);

    const building = {
      id: "manual",
      name: address || "Your Building",
      address: address || "Manual Entry",
      type: BUILDING_TYPES.find((t) => t.value === form.buildingType)?.label || "Office",
      sqft,
      yearBuilt: null,
      currentEmissions: Math.round(emissions),
      emissionsIntensity: sqft > 0 ? emissions / sqft : 0,
      ...limits,
      ...fines,
      isManual: true,
    };

    selectBuilding(building);
    navigate(`/dashboard?building=manual`);
  };

  return (
    <div className="mt-4 bg-white rounded-2xl border border-border p-6 shadow-lg text-left">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground font-heading">Enter your building details</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your building may be under 25,000 sq ft and exempt from LL97, or not yet in the database.
          </p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Building type
            </label>
            <select
              value={form.buildingType}
              onChange={(e) => set("buildingType", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {BUILDING_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Square footage
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={form.sqft}
              onChange={(e) => set("sqft", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Monthly electricity cost ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 8000"
              value={form.monthlyElec}
              onChange={(e) => set("monthlyElec", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Monthly gas cost ($)
            </label>
            <input
              type="number"
              placeholder="e.g. 3000"
              value={form.monthlyGas}
              onChange={(e) => set("monthlyGas", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
        >
          Estimate My Compliance →
        </button>
      </form>
    </div>
  );
}
