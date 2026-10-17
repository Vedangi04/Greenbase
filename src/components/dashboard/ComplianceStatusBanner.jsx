import { CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const BOUNCE = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
};

export default function ComplianceStatusBanner({ compliant, underBy, overage }) {
  if (compliant) {
    return (
      <motion.div {...BOUNCE}
        className="flex items-center gap-4 rounded-2xl p-5"
        style={{
          background: "rgba(74,222,128,0.08)",
          border: "1px solid rgba(74,222,128,0.25)",
        }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(74,222,128,0.15)" }}>
          <CheckCircle2 className="w-6 h-6" style={{ color: "#4ade80" }} />
        </div>
        <div>
          <div className="font-bold text-lg" style={{ color: "#86efac" }}>✅ Compliant for 2024–2029</div>
          <div className="text-sm mt-0.5" style={{ color: "#6ee7b7" }}>
            Your building is{" "}
            <span className="font-semibold">{underBy.toLocaleString()} tons</span> under the 2024 limit.
            You're safe — for now. The 2030 limits tighten significantly.
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...BOUNCE}
      className="flex items-center gap-4 rounded-2xl p-5"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        animation: "bannerPulse 3s ease-in-out infinite",
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(239,68,68,0.15)" }}>
        <AlertTriangle className="w-6 h-6" style={{ color: "#f87171" }} />
      </div>
      <div>
        <div className="font-bold text-lg" style={{ color: "#fca5a5" }}>⚠️ Over Limit — Fines Accruing Now</div>
        <div className="text-sm mt-0.5" style={{ color: "#fca5a5", opacity: 0.8 }}>
          Your building exceeds the 2024 LL97 limit by{" "}
          <span className="font-semibold">{overage.toLocaleString()} tons</span>. Fines are
          calculated annually and must be paid by May 1st each year.
        </div>
      </div>
    </motion.div>
  );
}
