export const BUILDINGS = [
  {
    id: "empire-state",
    name: "Empire State Building",
    address: "350 5th Ave, New York, NY 10118",
    type: "Office",
    sqft: 2768591,
    yearBuilt: 1931,
    currentEmissions: 21800,
    emissionsIntensity: 0.00788,
    limit2024: 0.00846,
    cap2024: 23422,
    limit2030: 0.00453,
    cap2030: 12542,
    limit2035: 0.00300,
  },
  {
    id: "hilton-midtown",
    name: "New York Hilton Midtown",
    address: "1335 6th Ave, New York, NY 10019",
    type: "Hotel",
    sqft: 2079000,
    yearBuilt: 1963,
    currentEmissions: 26200,
    emissionsIntensity: 0.0126,
    limit2024: 0.0095,
    cap2024: 19750,
    limit2030: 0.00526,
    cap2030: 10935,
    limit2035: 0.00350,
  },
  {
    id: "stuyvesant-town",
    name: "Stuyvesant Town",
    address: "345 E 14th St, New York, NY 10003",
    type: "Multifamily",
    sqft: 8500000,
    yearBuilt: 1947,
    currentEmissions: 43500,
    emissionsIntensity: 0.00512,
    limit2024: 0.00675,
    cap2024: 57375,
    limit2030: 0.00336,
    cap2030: 28560,
    limit2035: 0.00220,
  },
  {
    id: "gateway-brooklyn",
    name: "Gateway Center Brooklyn",
    address: "625 Gateway Dr, Brooklyn, NY 11239",
    type: "Retail",
    sqft: 780000,
    yearBuilt: 2002,
    currentEmissions: 5000,
    emissionsIntensity: 0.00641,
    limit2024: 0.0105,
    cap2024: 8190,
    limit2030: 0.0042,
    cap2030: 3276,
    limit2035: 0.00280,
  },
  {
    id: "hudson-yards",
    name: "30 Hudson Yards",
    address: "30 Hudson Yards, New York, NY 10001",
    type: "Office",
    sqft: 2600000,
    yearBuilt: 2019,
    currentEmissions: 12400,
    emissionsIntensity: 0.00477,
    limit2024: 0.00846,
    cap2024: 21996,
    limit2030: 0.00453,
    cap2030: 11778,
    limit2035: 0.00300,
  },
];

export const FINE_PER_TON = 268;

export function getBuildingById(id) {
  return BUILDINGS.find((b) => b.id === id) || null;
}

export function searchBuildings(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase();
  return BUILDINGS.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q)
  );
}

export function calcCompliance(building, emissionsOverride = null) {
  const emissions = emissionsOverride ?? building.currentEmissions;

  const overage2024 = Math.max(0, emissions - building.cap2024);
  const fine2024 = overage2024 * FINE_PER_TON;

  const overage2030 = Math.max(0, emissions - building.cap2030);
  const fine2030 = overage2030 * FINE_PER_TON;

  // 2035 approximation: 2030 overage * 3
  const fine2035 = overage2030 * 3 * FINE_PER_TON;

  const compliant2024 = overage2024 === 0;

  return {
    emissions,
    overage2024,
    fine2024,
    overage2030,
    fine2030,
    fine2035,
    compliant2024,
    underBy2024: compliant2024 ? building.cap2024 - emissions : 0,
  };
}
