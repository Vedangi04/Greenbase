// Tool-using LL97 compliance agent.
//
// The LLM does not get the building's numbers up front. It decides which tool to
// call next, reads the observation, and repeats until it can commit to a plan
// ("final"). Every tool is a deterministic function over the app's own data, so
// the figures in the final answer come from tool output rather than from the model.
//
// `llm` is injected (see ComplianceAgent.jsx for the Base44 InvokeLLM adapter),
// which keeps this module free of network code and testable in plain Node.

import { calcFines, calcLimits, FINE_PER_TON } from "./nycOpenData.js";
import { RETROFITS, calcRetrofitEmissions, calcUpfrontCost } from "./retrofitData.js";
import { INCENTIVES } from "./incentiveData.js";
import { BUILDINGS } from "./staticData.js";

const MAX_STEPS_DEFAULT = 6;

const money = (n) => Math.round(n);

function typeKey(building) {
  return (building.type || "office").toLowerCase();
}

// ─── Tools ────────────────────────────────────────────────────────────────────

export const TOOLS = {
  get_compliance: {
    description:
      "Return the building's current emissions, its 2024/2030/2035 emission caps and the annual fines for each period. Takes no arguments.",
    run(building) {
      const type = typeKey(building);
      const limits = calcLimits(building.sqft, type);
      const fines = calcFines(building.currentEmissions, building.sqft, type);
      return {
        emissions_tCO2e: money(building.currentEmissions),
        cap_2024_tCO2e: money(limits.cap2024),
        cap_2030_tCO2e: money(limits.cap2030),
        cap_2035_tCO2e: money(limits.cap2035),
        annual_fine_2024_usd: money(fines.fine2024),
        annual_fine_2030_usd: money(fines.fine2030),
        annual_fine_2035_usd: money(fines.fine2035),
        fine_per_ton_usd: FINE_PER_TON,
        compliant_2024: fines.compliant2024,
      };
    },
  },

  list_retrofits: {
    description:
      "List the available retrofit options with id, cost range (USD) and emissions reduction. Takes no arguments.",
    run() {
      return RETROFITS.map((r) => ({
        id: r.id,
        name: r.name,
        cost_min_usd: r.costMin,
        cost_max_usd: r.costMax,
        emissions_reduction_pct: Math.round(r.emissionsReduction * 100),
        incentive_eligible: r.incentiveEligible,
        annual_cost: !!r.isAnnual,
      }));
    },
  },

  simulate_retrofits: {
    description:
      "Simulate a combination of retrofits. Args: retrofit_ids (array of ids from list_retrofits). Returns projected emissions, annual fines for 2024 and 2030, upfront cost and simple payback.",
    run(building, args) {
      const ids = Array.isArray(args?.retrofit_ids) ? args.retrofit_ids : [];
      const unknown = ids.filter((id) => !RETROFITS.some((r) => r.id === id));
      if (unknown.length) throw new Error(`Unknown retrofit ids: ${unknown.join(", ")}`);
      if (ids.length === 0) throw new Error("retrofit_ids must contain at least one id");

      const type = typeKey(building);
      const before = calcFines(building.currentEmissions, building.sqft, type);
      const projected = calcRetrofitEmissions(building.currentEmissions, ids);
      const after = calcFines(projected, building.sqft, type);
      const upfront = calcUpfrontCost(ids);
      const savings2030 = before.fine2030 - after.fine2030;
      return {
        retrofit_ids: ids,
        projected_emissions_tCO2e: money(projected),
        annual_fine_2024_usd: money(after.fine2024),
        annual_fine_2030_usd: money(after.fine2030),
        upfront_cost_usd: money(upfront),
        annual_fine_savings_2030_usd: money(savings2030),
        payback_years_vs_2030_fines: savings2030 > 0 ? +(upfront / savings2030).toFixed(1) : null,
        compliant_2030: after.fine2030 === 0,
      };
    },
  },

  find_incentives: {
    description:
      "Find incentive programs that apply to a set of retrofits. Args: retrofit_ids (array of ids). Returns program name, source, amount and application difficulty.",
    run(building, args) {
      const ids = Array.isArray(args?.retrofit_ids) ? args.retrofit_ids : [];
      if (ids.length === 0) throw new Error("retrofit_ids must contain at least one id");
      return INCENTIVES.filter((inc) => inc.retrofitIds.some((id) => ids.includes(id))).map((inc) => ({
        name: inc.name,
        source: inc.source,
        type: inc.type,
        amount: inc.amount,
        difficulty: inc.difficulty,
        covers: inc.retrofitIds.filter((id) => ids.includes(id)),
      }));
    },
  },

  peer_benchmark: {
    description:
      "Compare this building with the tracked NYC buildings of the same type: rank by GreenBase score, share non-compliant in 2024. Takes no arguments.",
    run(building) {
      const type = typeKey(building);
      const peers = BUILDINGS.filter((b) => b.type === type);
      if (peers.length === 0) return { peers: 0, note: "No tracked buildings of this type." };
      const ownIntensity = building.currentEmissions / building.sqft;
      const lowerIntensity = peers.filter((p) => p.emissions / p.sqft < ownIntensity).length;
      return {
        building_type: type,
        peers: peers.length,
        peers_non_compliant_2024: peers.filter((p) => !p.isCompliant2024).length,
        average_peer_score: Math.round(peers.reduce((s, p) => s + p.score, 0) / peers.length),
        emissions_intensity_better_than_pct_of_peers: Math.round((1 - lowerIntensity / peers.length) * 100),
      };
    },
  },
};

// ─── Prompt + loop ────────────────────────────────────────────────────────────

function toolManual() {
  return Object.entries(TOOLS)
    .map(([name, t]) => `- ${name}: ${t.description}`)
    .join("\n");
}

function buildPrompt(building, history, stepsLeft) {
  const log = history.length
    ? history
        .map(
          (h, i) =>
            `Step ${i + 1}\n  thought: ${h.thought}\n  action: ${h.action}${
              h.args ? ` ${JSON.stringify(h.args)}` : ""
            }\n  observation: ${JSON.stringify(h.observation)}`
        )
        .join("\n")
    : "(no steps taken yet)";

  return `You are an NYC Local Law 97 (LL97) compliance advisor agent for one building.

Building: ${building.name}, ${building.address}. Type: ${building.type}. ${building.sqft?.toLocaleString()} sq ft. Built ${building.yearBuilt || "unknown"}.

You can only learn facts about this building by calling tools. Never invent numbers; use numbers returned by tools.

Tools:
${toolManual()}
- final: Stop and give the recommendation. Put it in "answer".

Work step by step. A good run: check compliance, look at the retrofit options, simulate at least two combinations, check incentives for the best one, then finish. Do not repeat a tool call with identical arguments. You have ${stepsLeft} step(s) left; if it is 1, you must use "final".

Your final answer must be 3 short paragraphs, no headers or bullets: (1) how urgent the situation is and the dollars at stake, (2) the recommended retrofit combination with its cost, payback and resulting fines, (3) the top 2 incentives to apply for first and why. Quote figures exactly as the tools returned them.

History so far:
${log}

Reply with JSON: thought (one sentence on why), action (one of: ${[...Object.keys(TOOLS), "final"].join(", ")}), args (object, only retrofit_ids when needed), answer (string, only for final).`;
}

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    thought: { type: "string" },
    action: { type: "string" },
    args: {
      type: "object",
      properties: { retrofit_ids: { type: "array", items: { type: "string" } } },
    },
    answer: { type: "string" },
  },
  required: ["thought", "action"],
};

/**
 * Run the agent.
 * @param {object} opts
 * @param {object} opts.building  enriched building (needs sqft, type, currentEmissions)
 * @param {(req: {prompt: string, response_json_schema: object}) => Promise<object>} opts.llm
 * @param {(step: object) => void} [opts.onStep]  called after every tool call
 * @param {number} [opts.maxSteps]
 * @returns {Promise<{answer: string, steps: object[], stoppedEarly: boolean}>}
 */
export async function runComplianceAgent({ building, llm, onStep, maxSteps = MAX_STEPS_DEFAULT }) {
  const history = [];
  const seen = new Set();

  for (let i = 0; i < maxSteps; i++) {
    const stepsLeft = maxSteps - i;
    const decision = await llm({
      prompt: buildPrompt(building, history, stepsLeft),
      response_json_schema: RESPONSE_SCHEMA,
    });

    const action = decision?.action;
    const thought = decision?.thought || "";

    if (action === "final") {
      if (!decision.answer) throw new Error("Agent chose to finish without an answer.");
      return { answer: decision.answer, steps: history, stoppedEarly: false };
    }

    let observation;
    const key = `${action}:${JSON.stringify(decision?.args || {})}`;
    if (!TOOLS[action]) {
      observation = { error: `Unknown action "${action}". Use one of: ${Object.keys(TOOLS).join(", ")}, final.` };
    } else if (seen.has(key)) {
      observation = { error: "You already made this exact call. Use a different tool or arguments, or finish." };
    } else {
      seen.add(key);
      try {
        observation = TOOLS[action].run(building, decision.args);
      } catch (err) {
        observation = { error: err.message };
      }
    }

    const step = { thought, action, args: decision?.args, observation };
    history.push(step);
    onStep?.(step);
  }

  // Out of steps: force a final answer from what has been gathered.
  const forced = await llm({
    prompt:
      buildPrompt(building, history, 1) +
      '\n\nYou are out of steps. Respond now with action "final" and your answer.',
    response_json_schema: RESPONSE_SCHEMA,
  });
  if (!forced?.answer) throw new Error("Agent ran out of steps without producing an answer.");
  return { answer: forced.answer, steps: history, stoppedEarly: true };
}
