export const INCENTIVES = [
  {
    id: "ira-179d",
    name: "IRA Section 179D Tax Deduction",
    source: "Federal",
    type: "Tax Credit",
    amount: "Up to $5.00 per sq ft",
    maxValue: 5,
    perSqft: true,
    description:
      "Deduction for energy-efficient commercial buildings. Enhanced by the Inflation Reduction Act — deduction increases with performance improvement beyond baseline.",
    difficulty: "Medium",
    url: "https://www.irs.gov/credits-deductions/energy-efficient-commercial-buildings-deduction",
    retrofitIds: ["led", "windows", "bms", "heat-pump"],
  },
  {
    id: "ira-itc",
    name: "IRA Investment Tax Credit",
    source: "Federal",
    type: "Tax Credit",
    amount: "30% of project cost",
    maxValue: null,
    description:
      "30% federal tax credit for solar installations and heat pump systems. Combined with bonus credits for prevailing wage and domestic content requirements.",
    difficulty: "Medium",
    url: "https://www.energy.gov/eere/solar/federal-solar-tax-credit-basics",
    retrofitIds: ["solar", "heat-pump"],
  },
  {
    id: "nyserda",
    name: "NYSERDA Commercial Efficiency Program",
    source: "State",
    type: "Rebate",
    amount: "$0.16 per kWh saved",
    maxValue: 2000000,
    description:
      "New York State Energy Research and Development Authority offers incentives based on measured energy savings. Available for HVAC, lighting, controls, and envelope improvements.",
    difficulty: "Medium",
    url: "https://www.nyserda.ny.gov/All-Programs/Commercial-Efficiency-Program",
    retrofitIds: ["heat-pump", "led", "bms", "windows"],
  },
  {
    id: "coned",
    name: "Con Edison Commercial Rebates",
    source: "Utility",
    type: "Rebate",
    amount: "Up to $400 per kW",
    maxValue: 400000,
    description:
      "Con Edison's commercial and industrial rebate program for demand reduction through lighting, HVAC, and building controls upgrades.",
    difficulty: "Easy",
    url: "https://www.coned.com/en/save-money/rebates-incentives-tax-credits/rebates-incentives-tax-credits-for-businesses-buildings-and-institutions",
    retrofitIds: ["led", "bms", "heat-pump"],
  },
  {
    id: "nyc-accelerator",
    name: "NYC Accelerator Free Advisory",
    source: "City",
    type: "Free Service",
    amount: "Free (≈$15,000 value)",
    maxValue: 15000,
    description:
      "NYC's free LL97 compliance advisory service for building owners. Includes energy audit, compliance roadmap, and contractor referrals — no cost to you.",
    difficulty: "Easy",
    url: "https://www.nyc.gov/site/sustainability/buildings/nyc-accelerator.page",
    retrofitIds: ["heat-pump", "solar", "led", "windows", "bms", "recs"],
  },
  {
    id: "ny-green-bank",
    name: "NY Green Bank Financing",
    source: "State",
    type: "Loan",
    amount: "Loans from 3.5% APR",
    maxValue: 5000000,
    description:
      "State-backed green financing at below-market rates for clean energy and energy efficiency projects. Flexible terms up to 20 years.",
    difficulty: "Medium",
    url: "https://greenbank.ny.gov/",
    retrofitIds: ["heat-pump", "solar", "bms", "windows"],
  },
  {
    id: "green-roof",
    name: "NYC Green Roof Tax Abatement",
    source: "City",
    type: "Tax Credit",
    amount: "$15 per sq ft of green roof",
    maxValue: null,
    perSqft: true,
    description:
      "NYC property tax abatement for installing green (vegetated) roofs. Reduces stormwater runoff and provides insulation benefit alongside LL97 compliance.",
    difficulty: "Easy",
    url: "https://www.nyc.gov/site/finance/benefits/landlords-green-roof.page",
    retrofitIds: ["windows"],
  },
];

export const SOURCE_COLORS = {
  Federal: "bg-blue-100 text-blue-700",
  State: "bg-purple-100 text-purple-700",
  City: "bg-emerald-100 text-emerald-700",
  Utility: "bg-orange-100 text-orange-700",
};

export const TYPE_COLORS = {
  "Tax Credit": "bg-indigo-100 text-indigo-700",
  Rebate: "bg-teal-100 text-teal-700",
  Loan: "bg-sky-100 text-sky-700",
  "Free Service": "bg-green-100 text-green-700",
};

export const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};
