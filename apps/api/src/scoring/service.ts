import { PrismaClient } from "@prisma/client";
import { scoreOpportunity } from "./scorer.js";

export async function scoreOpportunityById(prisma: PrismaClient, id: string) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { project: true }
  });

  if (!opportunity) throw new Error("opportunity not found");

  const page = await prisma.page.findUnique({
    where: { url: opportunity.url }
  });

  const score = scoreOpportunity({
    title: opportunity.title,
    url: opportunity.url,
    reason: opportunity.reason,
    policyScore: opportunity.policyScore,
    riskScore: opportunity.riskScore,
    contentText: page?.contentText
  });

  const status = score.total >= 70 && score.policy >= 50 && score.risk < 50
    ? "REVIEW"
    : score.total >= 45
      ? "NEW"
      : "REJECTED";

  return prisma.opportunity.update({
    where: { id },
    data: {
      relevanceScore: score.total,
      status,
      reason: score.reason
    }
  });
}
