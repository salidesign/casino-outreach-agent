import type { PrismaClient } from "@prisma/client";
import type { Publisher, PublishResult } from "./types.js";

export async function publishApprovedContent(
  prisma: PrismaClient,
  opportunityId: string,
  contentId: string,
  publisher: Publisher
): Promise<PublishResult> {
  const content = await prisma.generatedContent.findFirst({
    where: { id: contentId, opportunityId }
  });

  if (!content) throw new Error("content not found");
  if (!content.approved) throw new Error("content requires human approval");

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId }
  });

  if (!opportunity) throw new Error("opportunity not found");
  if (!(await publisher.canPublish(opportunity.url))) {
    throw new Error("publisher is not enabled for this site");
  }

  const result = await publisher.publish(opportunity.url, content.body);

  await prisma.publication.create({
    data: {
      opportunityId,
      status: result.status,
      publishedUrl: result.publishedUrl,
      error: result.error
    }
  });

  if (result.status === "PUBLISHED") {
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { status: "PUBLISHED" }
    });
  }

  return result;
}
