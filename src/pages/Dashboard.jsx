import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Share2, FileDown, ArrowRight, Wrench, Lightbulb, Check } from "lucide-react";
import { motion } from "framer-motion";
import BuildingSummaryCard from "@/components/dashboard/BuildingSummaryCard";
import ComplianceStatusBanner from "@/components/dashboard/ComplianceStatusBanner";
import MetricCards from "@/components/dashboard/MetricCards";
import FineProjectionChart from "@/components/dashboard/FineProjectionChart";
import GreenBaseScore from "@/components/dashboard/GreenBaseScore";
import FinePaysWidget from "@/components/dashboard/FinePaysWidget";
import AIAdvisor from "@/components/dashboard/AIAdvisor";
import ComplianceAgent from "@/components/dashboard/ComplianceAgent";
import PayVsFixChart from "@/components/dashboard/PayVsFixChart";
import { calcGreenBaseScore } from "@/lib/nycOpenData";
import { INCENTIVES } from "@/lib/incentiveData";
import { useBuilding, enrichBuilding } from "@/lib/BuildingContext";

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

function buildingFromCompliance(b, c) {
  return { ...b, ...c };
}

/** Derive a unified compliance object from an enriched building */
function buildingCompliance(b) {
  if (!b) return null;
  return {
    emissions: b.currentEmissions,
    overage2024: b.overage2024 ?? 0,
    fine2024: b.fine2024 ?? 0,
    overage2030: b.overage2030 ?? 0,
    fine2030: b.fine2030 ?? 0,
    fine2035: b.fine2035 ?? 0,
    compliant2024: b.compliant2024 ?? true,
    underBy2024: b.underBy2024 ?? 0,
  };
}

export default function Dashboard() {
  const { building: ctxBuilding } = useBuilding();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  const buildingId = new URLSearchParams(window.location.search).get("building");

  // Resolve building: context first, then sessionStorage fallback, then localStorage
  const building = (() => {
    if (ctxBuilding) return ctxBuilding;
    try {
      // sessionStorage fallbacks for direct-URL navigation
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

  const compliance = buildingCompliance(building);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePDF = async () => {
    if (!building || !compliance) return;
    setExporting(true);

    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = pdf.internal.pageSize.getWidth();
    const green = [16, 185, 129];
    const dark = [30, 41, 59];
    const gray = [100, 116, 139];

    // Header
    pdf.setFillColor(...green);
    pdf.rect(0, 0, W, 18, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("GreenBase", 10, 11);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Building Compliance Report", 38, 11);
    pdf.setFontSize(8);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, W - 10, 11, { align: "right" });

    // Title
    let y = 28;
    pdf.setTextColor(...dark);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(building.name, 10, y);
    y += 7;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...gray);
    pdf.text(building.address, 10, y);
    y += 6;
    pdf.text(`${building.type} · ${building.sqft.toLocaleString()} sq ft · Built ${building.yearBuilt || "N/A"}`, 10, y);

    // Status badge
    y += 10;
    const isCompliant = compliance.compliant2024;
    pdf.setFillColor(...(isCompliant ? [220, 252, 231] : [254, 226, 226]));
    pdf.roundedRect(10, y, W - 20, 12, 3, 3, "F");
    pdf.setTextColor(...(isCompliant ? [21, 128, 61] : [185, 28, 28]));
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(isCompliant ? "✓  COMPLIANT for 2024–2029" : "⚠  OVER LIMIT — Fines Accruing", W / 2, y + 7.5, { align: "center" });

    // Metrics grid
    y += 20;
    const metrics = [
      ["Current Emissions", `${compliance.emissions.toLocaleString()} tCO₂e/yr`],
      ["2024 Limit", `${building.cap2024.toLocaleString()} tCO₂e/yr`],
      ["2024 Annual Fine", compliance.fine2024 === 0 ? "$0" : `$${compliance.fine2024.toLocaleString()}`],
      ["2030 Annual Fine", compliance.fine2030 === 0 ? "$0" : `$${compliance.fine2030.toLocaleString()}`],
    ];
    const colW = (W - 20) / 2;
    metrics.forEach(([label, value], i) => {
      const x = 10 + (i % 2) * (colW + 4);
      const rowY = y + Math.floor(i / 2) * 22;
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(x, rowY, colW - 2, 18, 2, 2, "F");
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...gray);
      pdf.text(label, x + 5, rowY + 5.5);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...dark);
      pdf.text(value, x + 5, rowY + 13);
    });

    // Plain English paragraph
    y += 52;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...dark);
    const para = `The ${building.name} at ${building.address} emits ${compliance.emissions.toLocaleString()} metric tons of CO2 per year. Under NYC Local Law 97, the 2024 emissions cap is ${building.cap2024.toLocaleString()} tons, meaning your building is currently ${compliance.compliant2024 ? `compliant (${compliance.underBy2024.toLocaleString()} tons under limit)` : `${compliance.overage2024.toLocaleString()} tons over the limit`}. If no action is taken, your annual fine will reach $${compliance.fine2030.toLocaleString()} by 2030.`;
    const lines = pdf.splitTextToSize(para, W - 20);
    pdf.text(lines, 10, y);
    y += lines.length * 5 + 8;

    // Incentives section (Page 3)
    pdf.setFillColor(...green);
    pdf.rect(0, y, W, 10, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Available Incentive Programs", 10, y + 6.5);
    y += 18;

    INCENTIVES.forEach((inc) => {
      if (y > 260) { pdf.addPage(); y = 20; }
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...dark);
      pdf.text(`• ${inc.name}`, 10, y);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(...gray);
      pdf.text(`  ${inc.amount} — ${inc.source} / ${inc.type}`, 10, y + 4.5);
      y += 11;
    });

    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7.5);
      pdf.setTextColor(...gray);
      pdf.text("Generated by GreenBase | greenbase.nyc | Data: NYC Open Data", W / 2, 290, { align: "center" });
    }

    pdf.save(`${building.name.replace(/\s+/g, "-")}-LL97-Report.pdf`);
    setExporting(false);
  };

  if (!building || !compliance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-2">No building selected</h2>
          <p className="text-muted-foreground mb-6">Search for a building to see its compliance dashboard.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
            Search Buildings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...PAGE_TRANSITION} className="min-h-screen bg-background pt-20 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Action bar */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to search
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all shadow-sm min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Copied!" : "Share"}
            </button>
            <button
              onClick={handlePDF}
              disabled={exporting}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-all shadow-sm min-h-[44px] disabled:opacity-60"
            >
              <FileDown className="w-4 h-4" />
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </div>

        <div ref={reportRef} className="space-y-5">
          <BuildingSummaryCard building={building} />

          {/* Status banner + score side by side */}
          <div className="flex items-stretch gap-4">
            <div className="flex-1">
              <ComplianceStatusBanner
                compliant={compliance.compliant2024}
                underBy={compliance.underBy2024}
                overage={compliance.overage2024}
              />
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm flex items-center justify-center px-5 py-4">
              <GreenBaseScore score={calcGreenBaseScore(compliance.emissions, building.sqft, building.type || "office")} />
            </div>
          </div>

          <MetricCards compliance={compliance} building={building} />
          <FineProjectionChart compliance={compliance} />
          <FinePaysWidget compliance={compliance} building={building} />
          <AIAdvisor building={building} />
          <ComplianceAgent building={building} />
          <PayVsFixChart building={building} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            to={`/retrofits?building=${buildingId}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-md min-h-[52px]"
          >
            <Wrench className="w-5 h-5" />
            See how to fix this →
          </Link>
          <Link
            to={`/incentives?building=${buildingId}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-border text-foreground rounded-xl font-bold text-base hover:border-primary hover:text-primary transition-all shadow-sm min-h-[52px]"
          >
            <Lightbulb className="w-5 h-5" />
            Find incentives →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
