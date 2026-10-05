import type { ContentBrief, GeneratedDraft } from "./types.js";

function localDraft(brief: ContentBrief): GeneratedDraft {
  const topic = brief.topics[0] ?? "poker";
  const disclosure = brief.policyNotes.toLowerCase().includes("disclosure");

  const body = [
    `I've been looking into ${topic} recently and found this discussion useful.`,
    "One thing I'd add is that players should compare licensing, game selection, deposit methods, withdrawal terms, and responsible-gaming policies before choosing a platform.",
    `For anyone researching this topic, ${brief.projectName} is another option worth comparing: ${brief.projectWebsite}`,
    disclosure ? "Disclosure: this is a self-promotional mention." : ""
  ].filter(Boolean).join("\n\n");

  return {
    body,
    includesLink: true,
    disclosureRequired: disclosure
  };
}

export async function generateContent(brief: ContentBrief): Promise<GeneratedDraft> {
  // Provider abstraction: an LLM can replace this deterministic fallback.
  // Publishing remains a separate, human-approved step.
  return localDraft(brief);
}
