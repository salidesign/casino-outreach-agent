import type { PolicyAnalysis } from "./types.js";

const positive = [
  "self promotion allowed",
  "self-promotion allowed",
  "promotional posts allowed",
  "advertising allowed",
  "external links allowed",
  "links are allowed"
];

const negative = [
  "no self promotion",
  "no self-promotion",
  "no advertising",
  "advertising is prohibited",
  "promotional posts prohibited",
  "affiliate links prohibited",
  "spam is prohibited"
];

export function analyzePolicy(text: string): PolicyAnalysis {
  const normalized = text.toLowerCase();

  const positives = positive.filter((x) => normalized.includes(x)).length;
  const negatives = negative.filter((x) => normalized.includes(x)).length;

  const allowsSelfPromotion = positives > 0 && negatives === 0;
  const allowsExternalLinks =
    normalized.includes("external links allowed") ||
    normalized.includes("links are allowed");

  const requiresModerator =
    /moderator approval|admin approval|approval required|contact (a )?moderator/i.test(normalized);

  const requiresDisclosure =
    /disclose.*affiliate|affiliate.*disclosure|advertising disclosure|sponsored/i.test(normalized);

  const policyScore = Math.max(
    0,
    Math.min(
      100,
      50 + positives * 20 - negatives * 35 - (requiresModerator ? 10 : 0)
    )
  );

  const riskScore = Math.max(
    0,
    Math.min(100, negatives * 30 + (requiresModerator ? 10 : 0))
  );

  const notes = [
    positives ? `positive policy signals: ${positives}` : "",
    negatives ? `negative policy signals: ${negatives}` : "",
    requiresModerator ? "moderator approval appears required" : "",
    requiresDisclosure ? "affiliate/sponsored disclosure appears required" : ""
  ].filter(Boolean).join("; ");

  return {
    allowsSelfPromotion,
    allowsExternalLinks,
    requiresDisclosure,
    requiresModerator,
    policyScore,
    riskScore,
    notes: notes || "No explicit promotion policy detected; manual review required."
  };
}
