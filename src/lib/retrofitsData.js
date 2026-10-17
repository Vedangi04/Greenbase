export const RETROFITS = [
  {
    id: "heat-pump",
    name: "Heat Pump Conversion",
    description: "Replace gas heating/cooling with high-efficiency electric heat pumps. The single biggest emissions reducer for most NYC buildings.",
    costMin: 150000,
    costMax: 400000,
    emissionsReduction: 0.65,
    incentiveEligible: true,
    tags: ["HVAC", "Electrification"],
  },
  {
    id: "solar",
    name: "Rooftop Solar",
    description: "Install photovoltaic panels to generate on-site clean electricity, directly reducing your grid carbon footprint.",
    costMin: 80000,
    costMax: 300000,
    emissionsReduction: 0.20,
    incentiveEligible: true,
    tags: ["Renewable Energy"],
  },
  {
    id: "led",
    name: "LED Lighting Upgrade",
    description: "Replace all fluorescent and incandescent lighting with LED fixtures. Fast payback and easy installation with minimal disruption.",
    costMin: 30000,
    costMax: 150000,
    emissionsReduction: 0.08,
    incentiveEligible: true,
    tags: ["Lighting"],
  },
  {
    id: "windows",
    name: "Window & Insulation Upgrade",
    description: "Improve building envelope with triple-pane windows and enhanced wall/roof insulation to reduce heating and cooling loads.",
    costMin: 200000,
    costMax: 800000,
    emissionsReduction: 0.18,
    incentiveEligible: false,
    tags: ["Envelope"],
  },
  {
    id: "bms",
    name: "Smart Building Management System",
    description: "Deploy AI-driven controls to optimize HVAC, lighting, and plug loads in real time. Often the fastest ROI of any retrofit.",
    costMin: 50000,
    costMax: 200000,
    emissionsReduction: 0.12,
    incentiveEligible: true,
    tags: ["Controls", "AI"],
  },
  {
    id: "recs",
    name: "Carbon Offset Credits (RECs)",
    description: "Purchase Renewable Energy Certificates to offset a portion of emissions. Capped by LL97 at 10% of your limit — use as a bridge strategy.",
    costMin: 10000,
    costMax: 80000,
    emissionsReduction: 0.10,
    incentiveEligible: false,
    tags: ["Offsets"],
    isAnnual: true,
  },
];

export function calcRetrofitEmissions(baseEmissions, selectedIds) {
  if (selectedIds.length === 0) return baseEmissions;
  // Multiplicative stacking
  let remaining = baseEmissions;
  selectedIds.forEach((id) => {
    const r = RETROFITS.find((x) => x.id === id);
    if (r) remaining = remaining * (1 - r.emissionsReduction);
  });
  return remaining;
}

export function calcUpfrontCost(selectedIds) {
  return selectedIds.reduce((sum, id) => {
    const r = RETROFITS.find((x) => x.id === id);
    if (!r) return sum;
    return sum + (r.costMin + r.costMax) / 2;
  }, 0);
}
