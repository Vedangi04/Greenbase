import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, DollarSign, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useCountUp(target, duration = 600) {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    prevRef.current = target;
    if (from === to) return;

    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function formatMoney(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function StatCard({ icon: Icon, label, rawValue, displayValue, valueColor, pulse }) {
  const [isPulsing, setIsPulsing] = useState(false);
  const prevVal = useRef(rawValue);

  useEffect(() => {
    if (prevVal.current !== rawValue) {
      prevVal.current = rawValue;
      if (pulse) {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 400);
      }
    }
  }, [rawValue, pulse]);

  return (
    <motion.div
      animate={isPulsing ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 12,
        padding: "16px 20px",
        backdropFilter: "blur(8px)",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon style={{ width: 13, height: 13, color: "rgba(255,255,255,0.7)" }} />
        <span style={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {label}
        </span>
      </div>
      <div style={{ color: valueColor, fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
        {displayValue}
      </div>
    </motion.div>
  );
}

export default function RetrofitSummaryBar({ currentFine, projectedFine, upfrontCost, payback }) {
  const animatedCurrent = useCountUp(Math.round(currentFine));
  const animatedProjected = useCountUp(Math.round(projectedFine));
  const animatedCost = useCountUp(Math.round(upfrontCost));

  const savings = currentFine - projectedFine;
  const reductionPct = currentFine > 0 ? (savings / currentFine) * 100 : 0;

  let projectedColor = "#fca5a5";
  if (reductionPct > 50) projectedColor = "#86efac";
  else if (reductionPct >= 20) projectedColor = "#fde68a";

  const projectedIcon = reductionPct > 20 ? CheckCircle2 : AlertTriangle;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #0d9488 100%)",
        borderRadius: 16,
        padding: "24px 32px",
        boxShadow: "0 4px 24px rgba(6, 78, 59, 0.25)",
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={AlertTriangle}
          label="Current fine"
          rawValue={animatedCurrent}
          displayValue={`$${animatedCurrent.toLocaleString()}/yr`}
          valueColor="#fca5a5"
        />
        <StatCard
          icon={projectedIcon}
          label="Fine with upgrades"
          rawValue={animatedProjected}
          displayValue={`$${animatedProjected.toLocaleString()}/yr`}
          valueColor={projectedColor}
          pulse
        />
        <StatCard
          icon={DollarSign}
          label="Total upfront cost"
          rawValue={animatedCost}
          displayValue={upfrontCost > 0 ? `$${animatedCost.toLocaleString()}` : "$0"}
          valueColor="#93c5fd"
        />
        <StatCard
          icon={Calendar}
          label="Payback period"
          rawValue={payback}
          displayValue={payback}
          valueColor="#c4b5fd"
        />
      </div>
      {savings > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.2)", fontSize: 13, color: "#86efac", fontWeight: 500 }}>
          ✓ Saving ${Math.round(savings).toLocaleString()}/yr in fines with selected upgrades
        </div>
      )}
    </div>
  );
}
