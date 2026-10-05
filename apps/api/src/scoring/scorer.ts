import type { OpportunityScore } from "./types.js";

export function scoreOpportunity(input: {
  title?: string | null;
  url: string;
  reason?: string | null;
  policyScore: number;
  riskScore: number;
  contentText?: string | null;
}): OpportunityScore {
  const text = `${input.title ?? ""} ${input.reason ?? ""} ${input.contentText ?? ""}`.toLowerCase();

  const relevanceTerms = ["poker", "crypto", "usdt", "casino", "gambling", "tournament", "holdem"];
  const relevanceHits = relevanceTerms.filter((term) => text.includes(term)).length;
  const relevance = Math.min(100, relevanceHits * 15 + 25);

  const activitySignals = ["recent", "latest", "discussion", "reply", "comments", "2026"];
  const activityHits = activitySignals.filter((term) => text.includes(term)).length;
  const activity = Math.min(100, 30 + activityHits * 12);

  const audience = Math.min(
    100,
    (text.includes("forum") ? 30 : 10) +
    (text.includes("community") ? 25 : 0) +
    (text.includes("discussion") ? 20 : 0) +
    (text.includes("poker") ? 25 : 0)
  );

  const policy = input.policyScore;
  const riskPenalty = input.riskScore * 0.6;

  const total = Math.max(
    0,
    Math.round(
      relevance * 0.35 +
      policy * 0.30 +
      activity * 0.15 +
      audience * 0.20 -
      riskPenalty
    )
  );

  const reason = `relevance=${relevance}, policy=${policy}, activity=${activity}, audience=${audience}, risk=${input.riskScore}`;

  return { relevance, policy, activity, audience, risk: input.riskScore, total, reason };
}
