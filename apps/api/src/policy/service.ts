import { PrismaClient } from "@prisma/client";
import { PolicyCrawler } from "./crawler.js";
import { analyzePolicy } from "./analyzer.js";

export async function analyzeOpportunityPolicy(
  prisma: PrismaClient,
  opportunityId: string
) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId }
  });

  if (!opportunity) throw new Error("opportunity not found");

  const url = new URL(opportunity.url);
  const domain = await prisma.domain.upsert({
    where: { hostname: url.hostname.toLowerCase() },
    update: {},
    create: { hostname: url.hostname.toLowerCase() }
  });

  const crawler = new PolicyCrawler();
  const result = await crawler.crawl(opportunity.url);
  const policy = analyzePolicy(result.text);

  await prisma.sitePolicy.upsert({
    where: { domainId: domain.id },
    update: {
      allowsSelfPromotion: policy.allowsSelfPromotion,
      allowsExternalLinks: policy.allowsExternalLinks,
      requiresDisclosure: policy.requiresDisclosure,
      requiresModerator: policy.requiresModerator,
      notes: policy.notes,
      checkedAt: new Date()
    },
    create: {
      domainId: domain.id,
      allowsSelfPromotion: policy.allowsSelfPromotion,
      allowsExternalLinks: policy.allowsExternalLinks,
      requiresDisclosure: policy.requiresDisclosure,
      requiresModerator: policy.requiresModerator,
      notes: policy.notes
    }
  });

  return prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      policyScore: policy.policyScore,
      riskScore: policy.riskScore,
      status: policy.allowsSelfPromotion || policy.allowsExternalLinks ? "REVIEW" : "REJECTED",
      reason: policy.notes
    }
  });
}
