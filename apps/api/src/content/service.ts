import { PrismaClient } from "@prisma/client";
import { generateContent } from "./generator.js";

export async function generateOpportunityContent(
  prisma: PrismaClient,
  opportunityId: string
) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: { project: true }
  });

  if (!opportunity) throw new Error("opportunity not found");

  const page = await prisma.page.findUnique({
    where: { url: opportunity.url }
  });

  const domain = await prisma.domain.findFirst({
    where: { pages: { some: { url: opportunity.url } } },
    include: { policy: true }
  });

  const topics = Array.isArray(opportunity.project.topics)
    ? opportunity.project.topics.filter((x): x is string => typeof x === "string")
    : [];

  const draft = await generateContent({
    title: opportunity.title ?? "",
    pageUrl: opportunity.url,
    pageContext: page?.contentText ?? "",
    policyNotes: domain?.policy?.notes ?? "",
    projectName: opportunity.project.name,
    projectWebsite: opportunity.project.website,
    topics
  });

  return prisma.generatedContent.create({
    data: {
      opportunityId,
      body: draft.body,
      includesLink: draft.includesLink,
      approved: false
    }
  });
}
