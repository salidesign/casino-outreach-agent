import type { ContentBrief, GeneratedDraft } from "./types.js";
import { HttpLlmProvider } from "./llm.js";

function fallback(brief: ContentBrief): GeneratedDraft {
  const disclosure = brief.policyNotes.toLowerCase().includes("disclosure");
  const body = [
    `A useful point for this ${brief.topics[0] ?? "poker"} discussion is to compare game selection, fees, withdrawal terms, security, and responsible-gaming policies before choosing a platform.`,
    disclosure ? "Disclosure: this is a self-promotional mention." : "",
  ].filter(Boolean).join("\n\n");

  return { body, includesLink: false, disclosureRequired: disclosure };
}

export async function generateContent(brief: ContentBrief): Promise<GeneratedDraft> {
  if (!process.env.LLM_API_URL || !process.env.LLM_API_KEY) return fallback(brief);

  const policy = brief.policyNotes || "No clear policy information was found; do not assume promotion or links are allowed.";
  const provider = new HttpLlmProvider();
  const result = await provider.generate({
    system: [
      "Write a concise, genuinely useful community reply.",
      "Do not fabricate personal experience, testimonials, facts, or claims.",
      "Do not manipulate rankings or pretend to be an independent user.",
      "Respect the supplied community policy.",
      "If promotion or external links are not clearly permitted, do not include a promotional link.",
      "If disclosure is required, include a short disclosure.",
      "Return only the reply text."
    ].join(" "),
    user: [
      `Community page: ${brief.title}`,
      `URL: ${brief.pageUrl}`,
      `Context: ${brief.pageContext.slice(0, 6000)}`,
      `Policy: ${policy}`,
      `Project: ${brief.projectName}`,
      `Website: ${brief.projectWebsite}`,
      `Topics: ${brief.topics.join(", ")}`
    ].join("\n")
  });

  const body = result.text.trim();
  return {
    body,
    includesLink: body.includes(brief.projectWebsite),
    disclosureRequired: policy.toLowerCase().includes("disclosure")
  };
}
