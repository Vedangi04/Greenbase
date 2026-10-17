export const LL97_LIMITS = {
  office:      { 2024: 0.00846, 2030: 0.00453, 2035: 0.00160 },
  multifamily: { 2024: 0.00675, 2030: 0.00336, 2035: 0.00100 },
  hotel:       { 2024: 0.00950, 2030: 0.00526, 2035: 0.00180 },
  retail:      { 2024: 0.01050, 2030: 0.00420, 2035: 0.00140 },
  warehouse:   { 2024: 0.00426, 2030: 0.00110, 2035: 0.00040 },
  education:   { 2024: 0.00758, 2030: 0.00344, 2035: 0.00100 },
  hospital:    { 2024: 0.02190, 2030: 0.01000, 2035: 0.00400 },
};

export const FINE_PER_TON = 268;

export const DEMO_BUILDINGS = [
  {
    id: "demo-empire-state",
    keywords: ["empire state", "350 5th"],
    name: "Empire State Building",
    address: "350 5th Ave, New York, NY 10118",
    type: "office", sqft: 2768591, yearBuilt: 1931,
    currentEmissions: 21800, emissionsIntensity: 0.00788,
  },
  {
    id: "demo-hilton-midtown",
    keywords: ["hilton midtown", "1335 6th", "hilton"],
    name: "New York Hilton Midtown",
    address: "1335 6th Ave, New York, NY 10019",
    type: "hotel", sqft: 2079000, yearBuilt: 1963,
    currentEmissions: 26200, emissionsIntensity: 0.01260,
  },
  {
    id: "demo-stuyvesant",
    keywords: ["stuyvesant", "stuy town", "345 e 14"],
    name: "Stuyvesant Town",
    address: "345 E 14th St, New York, NY 10003",
    type: "multifamily", sqft: 8500000, yearBuilt: 1947,
    currentEmissions: 43500, emissionsIntensity: 0.00512,
  },
  {
    id: "demo-hudson-yards",
    keywords: ["hudson yards", "30 hudson"],
    name: "30 Hudson Yards",
    address: "30 Hudson Yards, New York, NY 10001",
    type: "office", sqft: 2600000, yearBuilt: 2019,
    currentEmissions: 12400, emissionsIntensity: 0.00477,
  },
  {
    id: "demo-gateway",
    keywords: ["gateway center", "625 gateway"],
    name: "Gateway Center Brooklyn",
    address: "625 Gateway Dr, Brooklyn, NY 11239",
    type: "retail", sqft: 780000, yearBuilt: 2002,
    currentEmissions: 5000, emissionsIntensity: 0.00641,
  },
];

export function mapBuildingType(raw) {
  if (!raw) return "office";
  const t = raw.toLowerCase();
  if (t.includes("office"))                                                          return "office";
  if (t.includes("multifamily") || t.includes("residential") || t.includes("apartment")) return "multifamily";
  if (t.includes("hotel") || t.includes("lodging"))                                 return "hotel";
  if (t.includes("retail") || t.includes("mall"))                                   return "retail";
  if (t.includes("warehouse") || t.includes("storage"))                             return "warehouse";
  if (t.includes("school") || t.includes("university") || t.includes("education"))  return "education";
  if (t.includes("hospital") || t.includes("medical"))                              return "hospital";
  return "office";
}

export function calcLimits(sqft, type) {
  const limits = LL97_LIMITS[type] || LL97_LIMITS.office;
  return {
    cap2024: limits[2024] * sqft,
    cap2030: limits[2030] * sqft,
    cap2035: limits[2035] * sqft,
    limit2024: limits[2024],
    limit2030: limits[2030],
    limit2035: limits[2035],
  };
}

export function calcFines(emissions, sqft, type) {
  const limits = LL97_LIMITS[type] || LL97_LIMITS.office;
  const fine = (year) => Math.max(0, emissions - limits[year] * sqft) * FINE_PER_TON;
  const cap2024 = limits[2024] * sqft;
  const overage2024 = Math.max(0, emissions - cap2024);
  const fine2024 = fine(2024);
  const fine2030 = fine(2030);
  return {
    fine2024,
    fine2030,
    fine2035: fine(2035),
    overage2024,
    overage2030: Math.max(0, emissions - limits[2030] * sqft),
    compliant2024: overage2024 === 0,
    underBy2024: overage2024 === 0 ? cap2024 - emissions : 0,
  };
}

export function calcGreenBaseScore(emissions, sqft, type) {
  const limits = LL97_LIMITS[type] || LL97_LIMITS.office;
  const cap2030 = limits[2030] * sqft;
  if (emissions <= 0) return 100;
  if (cap2030 <= 0) return 0;
  // 0 = 2x over 2030 cap, 100 = zero emissions
  const ratio = emissions / cap2030; // 0 = perfect, 2+ = terrible
  const score = Math.round(Math.max(0, Math.min(100, (1 - (ratio - 1)) * 50)));
  return score;
}

export function estimateEmissionsFromCosts(monthlyElec, monthlyGas) {
  const elecEmissions = (monthlyElec / 0.12) * 12 * 0.000289;
  const gasEmissions  = (monthlyGas  / 11.5) * 12 * 0.05311;
  return elecEmissions + gasEmissions;
}
