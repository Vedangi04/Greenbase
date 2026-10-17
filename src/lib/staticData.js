// ─── Static NYC Buildings Dataset ────────────────────────────────────────────

const NYC_BUILDINGS = [
  { id:"nyc-1",  name:"Empire State Building",            address:"350 5th Ave",                borough:"Manhattan",    type:"office",      sqft:2768591, yearBuilt:1931, emissions:21800,  intensity:7.88  },
  { id:"nyc-2",  name:"New York Hilton Midtown",           address:"1335 6th Ave",               borough:"Manhattan",    type:"hotel",       sqft:2079000, yearBuilt:1963, emissions:26200,  intensity:12.60 },
  { id:"nyc-3",  name:"Stuyvesant Town",                   address:"345 E 14th St",              borough:"Manhattan",    type:"multifamily", sqft:8500000, yearBuilt:1947, emissions:43500,  intensity:5.12  },
  { id:"nyc-4",  name:"30 Hudson Yards",                   address:"30 Hudson Yards",            borough:"Manhattan",    type:"office",      sqft:2600000, yearBuilt:2019, emissions:12400,  intensity:4.77  },
  { id:"nyc-5",  name:"Gateway Center Brooklyn",           address:"625 Gateway Dr",             borough:"Brooklyn",     type:"retail",      sqft:780000,  yearBuilt:2002, emissions:5000,   intensity:6.41  },
  { id:"nyc-6",  name:"One World Trade Center",            address:"285 Fulton St",              borough:"Manhattan",    type:"office",      sqft:3501274, yearBuilt:2014, emissions:28900,  intensity:8.25  },
  { id:"nyc-7",  name:"MetLife Building",                  address:"200 Park Ave",               borough:"Manhattan",    type:"office",      sqft:2360000, yearBuilt:1963, emissions:23100,  intensity:9.79  },
  { id:"nyc-8",  name:"Rockefeller Center (30 Rock)",      address:"30 Rockefeller Plaza",       borough:"Manhattan",    type:"office",      sqft:2170000, yearBuilt:1933, emissions:22400,  intensity:10.32 },
  { id:"nyc-9",  name:"Chrysler Building",                 address:"405 Lexington Ave",          borough:"Manhattan",    type:"office",      sqft:1195000, yearBuilt:1930, emissions:13900,  intensity:11.63 },
  { id:"nyc-10", name:"One Penn Plaza",                    address:"1 Penn Plaza",               borough:"Manhattan",    type:"office",      sqft:2000000, yearBuilt:1972, emissions:20600,  intensity:10.30 },
  { id:"nyc-11", name:"Marriott Marquis Times Square",     address:"1535 Broadway",              borough:"Manhattan",    type:"hotel",       sqft:870000,  yearBuilt:1985, emissions:14200,  intensity:16.32 },
  { id:"nyc-12", name:"Jacob Javits Convention Center",    address:"655 W 34th St",              borough:"Manhattan",    type:"office",      sqft:2100000, yearBuilt:1986, emissions:38000,  intensity:18.10 },
  { id:"nyc-13", name:"Chelsea Market",                    address:"75 9th Ave",                 borough:"Manhattan",    type:"retail",      sqft:1200000, yearBuilt:1898, emissions:11800,  intensity:9.83  },
  { id:"nyc-14", name:"Macy's Herald Square",              address:"151 W 34th St",              borough:"Manhattan",    type:"retail",      sqft:2200000, yearBuilt:1902, emissions:24100,  intensity:10.95 },
  { id:"nyc-15", name:"Trump Tower",                       address:"721 5th Ave",                borough:"Manhattan",    type:"office",      sqft:664000,  yearBuilt:1983, emissions:7200,   intensity:10.84 },
  { id:"nyc-16", name:"Time Warner Center",                address:"10 Columbus Circle",         borough:"Manhattan",    type:"office",      sqft:2800000, yearBuilt:2003, emissions:22900,  intensity:8.18  },
  { id:"nyc-17", name:"4 Times Square",                    address:"4 Times Square",             borough:"Manhattan",    type:"office",      sqft:1600000, yearBuilt:1999, emissions:13100,  intensity:8.19  },
  { id:"nyc-18", name:"7 World Trade Center",              address:"250 Greenwich St",           borough:"Manhattan",    type:"office",      sqft:1740000, yearBuilt:2006, emissions:10200,  intensity:5.86  },
  { id:"nyc-19", name:"55 Water Street",                   address:"55 Water St",                borough:"Manhattan",    type:"office",      sqft:3600000, yearBuilt:1972, emissions:34200,  intensity:9.50  },
  { id:"nyc-20", name:"One Liberty Plaza",                 address:"165 Broadway",               borough:"Manhattan",    type:"office",      sqft:2300000, yearBuilt:1972, emissions:21800,  intensity:9.48  },
  { id:"nyc-21", name:"Barclays Center",                   address:"620 Atlantic Ave",           borough:"Brooklyn",     type:"retail",      sqft:850000,  yearBuilt:2012, emissions:9800,   intensity:11.53 },
  { id:"nyc-22", name:"Kings Plaza Mall",                  address:"5100 Kings Plaza",           borough:"Brooklyn",     type:"retail",      sqft:1140000, yearBuilt:1970, emissions:13200,  intensity:11.58 },
  { id:"nyc-23", name:"MetroTech Center",                  address:"1 MetroTech Center",         borough:"Brooklyn",     type:"office",      sqft:3200000, yearBuilt:1991, emissions:28400,  intensity:8.88  },
  { id:"nyc-24", name:"Atlantic Terminal Mall",            address:"139 Flatbush Ave",           borough:"Brooklyn",     type:"retail",      sqft:430000,  yearBuilt:2004, emissions:4900,   intensity:11.40 },
  { id:"nyc-25", name:"Wyckoff Heights Medical Center",    address:"374 Stockholm St",           borough:"Brooklyn",     type:"hospital",    sqft:890000,  yearBuilt:1961, emissions:28600,  intensity:32.13 },
  { id:"nyc-26", name:"Flushing Mall",                     address:"133-31 39th Ave",            borough:"Queens",       type:"retail",      sqft:310000,  yearBuilt:1981, emissions:3800,   intensity:12.26 },
  { id:"nyc-27", name:"Queens Center Mall",                address:"90-15 Queens Blvd",          borough:"Queens",       type:"retail",      sqft:983000,  yearBuilt:1973, emissions:11400,  intensity:11.60 },
  { id:"nyc-28", name:"LaGuardia Airport Terminal B",      address:"LaGuardia Airport",          borough:"Queens",       type:"office",      sqft:1200000, yearBuilt:1964, emissions:18900,  intensity:15.75 },
  { id:"nyc-29", name:"JFK Terminal 4",                    address:"JFK International Airport",  borough:"Queens",       type:"office",      sqft:1800000, yearBuilt:2001, emissions:26700,  intensity:14.83 },
  { id:"nyc-30", name:"Elmhurst Hospital Center",          address:"79-01 Broadway",             borough:"Queens",       type:"hospital",    sqft:1100000, yearBuilt:1957, emissions:35200,  intensity:32.00 },
  { id:"nyc-31", name:"Staten Island Mall",                address:"2655 Richmond Ave",          borough:"Staten Island",type:"retail",      sqft:1360000, yearBuilt:1973, emissions:15700,  intensity:11.54 },
  { id:"nyc-32", name:"Staten Island University Hospital", address:"475 Seaview Ave",            borough:"Staten Island",type:"hospital",    sqft:760000,  yearBuilt:1861, emissions:24400,  intensity:32.11 },
  { id:"nyc-33", name:"Bronx Terminal Market",             address:"610 Exterior St",            borough:"Bronx",        type:"retail",      sqft:780000,  yearBuilt:2009, emissions:9000,   intensity:11.54 },
  { id:"nyc-34", name:"Lincoln Hospital",                  address:"234 E 149th St",             borough:"Bronx",        type:"hospital",    sqft:640000,  yearBuilt:1976, emissions:20500,  intensity:32.03 },
  { id:"nyc-35", name:"Yankee Stadium",                    address:"1 E 161st St",               borough:"Bronx",        type:"retail",      sqft:1200000, yearBuilt:2009, emissions:13900,  intensity:11.58 },
  { id:"nyc-36", name:"420 Kent Avenue",                   address:"420 Kent Ave",               borough:"Brooklyn",     type:"multifamily", sqft:820000,  yearBuilt:2017, emissions:2300,   intensity:2.80  },
  { id:"nyc-37", name:"The Standard High Line",            address:"848 Washington St",          borough:"Manhattan",    type:"hotel",       sqft:340000,  yearBuilt:2009, emissions:4800,   intensity:14.12 },
  { id:"nyc-38", name:"Hudson Yards 50",                   address:"50 Hudson Yards",            borough:"Manhattan",    type:"office",      sqft:2900000, yearBuilt:2022, emissions:14200,  intensity:4.90  },
  { id:"nyc-39", name:"One Vanderbilt",                    address:"1 Vanderbilt Ave",           borough:"Manhattan",    type:"office",      sqft:1657198, yearBuilt:2020, emissions:8100,   intensity:4.89  },
  { id:"nyc-40", name:"432 Park Avenue",                   address:"432 Park Ave",               borough:"Manhattan",    type:"multifamily", sqft:398058,  yearBuilt:2015, emissions:1900,   intensity:4.77  },
  { id:"nyc-41", name:"NYU Langone Medical Center",        address:"550 1st Ave",                borough:"Manhattan",    type:"hospital",    sqft:4200000, yearBuilt:1962, emissions:134700, intensity:32.07 },
  { id:"nyc-42", name:"NewYork-Presbyterian Hospital",     address:"525 E 68th St",              borough:"Manhattan",    type:"hospital",    sqft:3800000, yearBuilt:1877, emissions:121900, intensity:32.08 },
  { id:"nyc-43", name:"Mount Sinai Hospital",              address:"1 Gustave L Levy Pl",        borough:"Manhattan",    type:"hospital",    sqft:2900000, yearBuilt:1852, emissions:93000,  intensity:32.07 },
  { id:"nyc-44", name:"Columbia University (main)",        address:"116th St & Broadway",        borough:"Manhattan",    type:"education",   sqft:5800000, yearBuilt:1897, emissions:62900,  intensity:10.84 },
  { id:"nyc-45", name:"NYU Washington Square",             address:"70 Washington Square S",     borough:"Manhattan",    type:"education",   sqft:4100000, yearBuilt:1831, emissions:43100,  intensity:10.51 },
  { id:"nyc-46", name:"Related 15 Hudson Yards",           address:"15 Hudson Yards",            borough:"Manhattan",    type:"multifamily", sqft:947000,  yearBuilt:2019, emissions:4000,   intensity:4.22  },
  { id:"nyc-47", name:"Extell One57",                      address:"157 W 57th St",              borough:"Manhattan",    type:"multifamily", sqft:544000,  yearBuilt:2014, emissions:3200,   intensity:5.88  },
  { id:"nyc-48", name:"The Plaza Hotel",                   address:"768 5th Ave",                borough:"Manhattan",    type:"hotel",       sqft:592000,  yearBuilt:1907, emissions:9400,   intensity:15.88 },
  { id:"nyc-49", name:"Waldorf Astoria",                   address:"301 Park Ave",               borough:"Manhattan",    type:"hotel",       sqft:1410000, yearBuilt:1931, emissions:22400,  intensity:15.89 },
  { id:"nyc-50", name:"Brooklyn Navy Yard Bldg 77",        address:"141 Flushing Ave",           borough:"Brooklyn",     type:"office",      sqft:1000000, yearBuilt:1943, emissions:8900,   intensity:8.90  },
];

// ─── LL97 Limits ──────────────────────────────────────────────────────────────

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

export function calcFine(emissions, sqft, type, year) {
  const limits = LL97_LIMITS[type] || LL97_LIMITS.office;
  const period = year >= 2035 ? 2035 : year >= 2030 ? 2030 : 2024;
  const cap = limits[period] * sqft;
  return Math.max(0, emissions - cap) * FINE_PER_TON;
}

export function calcScore(emissions, sqft, type) {
  const limit2030 = (LL97_LIMITS[type] || LL97_LIMITS.office)[2030] * sqft;
  if (emissions <= 0) return 100;
  const ratio = emissions / limit2030;
  if (ratio >= 2) return 0;
  return Math.max(0, Math.round(100 - ratio * 50));
}

// ─── Enriched BUILDINGS array ─────────────────────────────────────────────────

export const BUILDINGS = NYC_BUILDINGS.map((b) => {
  const limits = LL97_LIMITS[b.type] || LL97_LIMITS.office;
  const cap2024 = limits[2024] * b.sqft;
  const cap2030 = limits[2030] * b.sqft;
  const cap2035 = limits[2035] * b.sqft;
  const fine2024 = calcFine(b.emissions, b.sqft, b.type, 2024);
  const fine2030 = calcFine(b.emissions, b.sqft, b.type, 2030);
  const fine2035 = calcFine(b.emissions, b.sqft, b.type, 2035);
  const score    = calcScore(b.emissions, b.sqft, b.type);
  const isCompliant2024 = fine2024 === 0;
  const overage2024 = Math.max(0, b.emissions - cap2024);
  const overage2030 = Math.max(0, b.emissions - cap2030);

  return {
    ...b,
    // Fields expected by Dashboard / Retrofits / BuildingContext
    currentEmissions: b.emissions,
    emissionsIntensity: b.intensity,
    cap2024: Math.round(cap2024),
    cap2030: Math.round(cap2030),
    cap2035: Math.round(cap2035),
    overage2024: Math.round(overage2024),
    overage2030: Math.round(overage2030),
    fine2024:  Math.round(fine2024),
    fine2030:  Math.round(fine2030),
    fine2035:  Math.round(fine2035),
    score,
    isCompliant2024,
    compliant2024: isCompliant2024,
    underBy2024: isCompliant2024 ? Math.round(cap2024 - b.emissions) : 0,
  };
});

// ─── Search ───────────────────────────────────────────────────────────────────

export function searchBuildings(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  return BUILDINGS.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.borough.toLowerCase().includes(q)
  ).slice(0, 8);
}

// ─── Leaderboards ─────────────────────────────────────────────────────────────

export const WORST_OFFENDERS = [...BUILDINGS]
  .sort((a, b) => b.fine2030 - a.fine2030)
  .slice(0, 20);

export const TOP_PERFORMERS = [...BUILDINGS]
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);

export const BOROUGHS = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

export function getBuildingsByBorough(borough) {
  return BUILDINGS.filter((b) => b.borough === borough).sort((a, b) => b.fine2030 - a.fine2030);
}

// ─── Summary Stats ────────────────────────────────────────────────────────────

export const STATS = {
  totalFines2030:    BUILDINGS.reduce((s, b) => s + b.fine2030, 0),
  nonCompliant2024:  BUILDINGS.filter((b) => !b.isCompliant2024).length,
  avgScore:          Math.round(BUILDINGS.reduce((s, b) => s + b.score, 0) / BUILDINGS.length),
};
