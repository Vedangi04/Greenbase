import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Leaf, ArrowRight, Database, GitCompare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchBuildings, BUILDINGS, STATS } from "@/lib/staticData";
import ManualEntryForm from "@/components/search/ManualEntryForm";
import { useBuilding } from "@/lib/BuildingContext";

const TYPE_ICONS = { office: "🏢", hotel: "🏨", multifamily: "🏘", retail: "🏪", warehouse: "🏭", education: "🎓", hospital: "🏥" };

function fmtBig(n) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

const LIVE_STATS = [
  { value: fmtBig(STATS.totalFines2030),      label: "total 2030 fines (tracked buildings)" },
  { value: `${STATS.nonCompliant2024} of 50`, label: "buildings already non-compliant in 2024" },
  { value: `${STATS.avgScore}/100`,            label: "average GreenBase Score" },
];


function formatSqft(n) {
  if (!n) return "";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M sqft`;
  if (n >= 1000) return `${Math.round(n / 1000)}K sqft`;
  return `${n} sqft`;
}

const FALLBACK_CHIPS = ["Empire State Building", "One World Trade Center", "Stuyvesant Town", "NYU Langone", "Yankee Stadium"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const { selectBuilding } = useBuilding();

  const loadBuilding = (b) => {
    selectBuilding(b);
    navigate(`/dashboard?building=${b.id}`);
  };

  const runSearch = (val) => {
    if (val.length < 2) {
      setResults([]);setIsSearching(false);setNotFound(false);
      return;
    }
    setIsSearching(false);
    const found = searchBuildings(val);
    setResults(found);
    if (found.length === 0) setNotFound(true);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setNotFound(false);
    setShowManual(false);
    clearTimeout(debounceRef.current);
    if (val.length < 2) { setResults([]); setIsSearching(false); return; }
    debounceRef.current = setTimeout(() => runSearch(val), 150);
  };

  const handleChipClick = (name) => {
    setQuery(name);
    setNotFound(false);
    setShowManual(false);
    runSearch(name);
  };

  const showDropdown = results.length > 0 && !isSearching;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
    className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-3xl w-full mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-8 border border-primary/20">
            <Leaf className="w-3.5 h-3.5" />
            NYC Local Law 97 Compliance Tool
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
            Find out if your building is{" "}
            <span className="text-primary">LL97 compliant</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            NYC's LL97 compliance command center for building owners
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-3">
            <div className="relative transition-all duration-300">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Enter building name or NYC address..."
                className="w-full pl-12 pr-44 py-4 text-base rounded-xl border border-border bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />

              <button
                type="button"
                disabled={isSearching}
                onClick={() => runSearch(query)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60">
                Check My Building <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Loading state — instant search, no spinner needed */}

            {/* Results dropdown */}
            <AnimatePresence>
              {showDropdown &&
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-20 overflow-hidden">
                  {results.map((b) =>
                <button key={b.id} type="button" onClick={() => loadBuilding(b)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border last:border-0">
                      <span className="text-xl flex-shrink-0">{TYPE_ICONS[b.type] || "🏢"}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {b.address}{b.type ? ` · ${b.type}` : ""}{b.sqft ? ` · ${formatSqft(b.sqft)}` : ""}
                        </div>
                      </div>
                    </button>
                )}
                </motion.div>
              }
            </AnimatePresence>

            {/* Not found */}
            <AnimatePresence>
              {notFound && !isSearching && query.length >= 2 &&
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute top-full left-0 right-0 mt-2 z-20">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                    <div className="font-semibold text-amber-800 text-sm mb-1">No buildings found</div>
                    <div className="text-xs text-amber-700 mb-3">
                      Try a building name like "World Trade" or "Hilton", or a street address like "350 5th Ave". Buildings under 25,000 sq ft are exempt from LL97 and won't appear here.
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {FALLBACK_CHIPS.map((chip) =>
                    <button key={chip} type="button" onClick={() => handleChipClick(chip)}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors">
                          {chip}
                        </button>
                    )}
                    </div>
                    <button type="button" onClick={() => setShowManual(true)}
                  className="text-xs font-semibold text-primary hover:underline">
                      Enter building details manually →
                    </button>
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {/* Manual entry form */}
          <AnimatePresence>
            {showManual &&
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto mb-4">
                <ManualEntryForm address={query} onClose={() => setShowManual(false)} />
              </motion.div>
            }
          </AnimatePresence>

          {/* Demo chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 mt-6">
            <span className="text-sm text-muted-foreground">Try a demo:</span>
            {FALLBACK_CHIPS.map((name) =>
            <button key={name} onClick={() => handleChipClick(name)}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-white hover:border-primary hover:text-primary hover:bg-primary/5 transition-all font-medium text-foreground shadow-sm">
                {name}
              </button>
            )}
          </div>

          {/* Compare button */}
          <div className="mb-12">
            <Link to="/compare"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm">
              <GitCompare className="w-4 h-4" />
              Compare Buildings
            </Link>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {LIVE_STATS.map((stat) =>
            <div key={stat.label} className="bg-white rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-primary font-heading mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Database className="w-4 h-4" />
          Built with NYC Open Data
        </div>
      </footer>
    </motion.div>);

}
