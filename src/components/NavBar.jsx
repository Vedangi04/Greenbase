import { Link, useLocation } from "react-router-dom";
import { Leaf, ChevronRight, Search, LayoutDashboard, Wrench, Lightbulb, Trophy } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Retrofits", path: "/retrofits" },
  { label: "Incentives", path: "/incentives" },
  { label: "NYC Rankings", path: "/rankings" },
];

const MOBILE_TABS = [
  { label: "Search", path: "/", icon: Search },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Retrofits", path: "/retrofits", icon: Wrench },
  { label: "Incentives", path: "/incentives", icon: Lightbulb },
  { label: "Rankings", path: "/rankings", icon: Trophy },
];

const STEPS = ["Address", "Compliance", "Fix it", "Funding"];
const STEP_PATHS = ["/", "/dashboard", "/retrofits", "/incentives"];

export default function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentStep = STEP_PATHS.findIndex((p) => p === currentPath);

  return (
    <>
      {/* Desktop top nav */}
      <header className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "rgba(17,24,39,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 text-primary" />
              </div>
              <span className="font-heading font-bold text-lg">
                <span style={{ color: "#4ade80" }}>Green</span>
                <span className="text-white">Base</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={isActive
                      ? { color: "#4ade80", background: "rgba(74,222,128,0.1)", fontWeight: 500 }
                      : { color: "#9ca3af" }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#f9fafb"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = ""; } }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {currentStep > 0 && (
              <div className="hidden lg:flex items-center gap-1 text-xs" style={{ color: "#6b7280" }}>
                {STEPS.map((step, i) => (
                  <span key={step} className="flex items-center gap-1">
                    <span style={{ color: i <= currentStep ? "#4ade80" : "#6b7280", fontWeight: i <= currentStep ? 600 : 400 }}>
                      {step}
                    </span>
                    {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3" style={{ color: "#374151" }} />}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-pb"
        style={{ background: "rgba(17,24,39,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
        <div className="flex">
          {MOBILE_TABS.map((tab) => {
            const isActive = currentPath === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-all min-h-[56px]"
                style={{ color: isActive ? "#4ade80" : "#6b7280" }}
              >
                <div className="p-1.5 rounded-lg transition-all"
                  style={{ background: isActive ? "rgba(74,222,128,0.12)" : "transparent" }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
