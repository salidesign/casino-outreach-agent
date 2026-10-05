import { PrismaClient } from "@prisma/client";
import type { SearchResult } from "./types.js";

export async function persistDiscovery(
  prisma: PrismaClient,
  projectId: string,
  results: SearchResult[]
) {
  let saved = 0;

  for (const result of results) {
    const parsed = new URL(result.url);
    const hostname = parsed.hostname.toLowerCase();

    const domain = await prisma.domain.upsert({
      where: { hostname },
      update: {},
      create: { hostname }
    });

    await prisma.page.upsert({
      where: { url: result.url },
      update: {
        title: result.title,
        contentText: result.snippet ?? undefined,
        crawledAt: new Date()
      },
      create: {
        domainId: domain.id,
        url: result.url,
        title: result.title,
        contentText: result.snippet ?? null,
        crawledAt: new Date()
      }
    });

    await prisma.opportunity.upsert({
      where: { id: `discovery-${projectId}-${Buffer.from(result.url).toString("base64url").slice(0, 40)}` },
      update: { title: result.title, reason: result.snippet ?? null },
      create: {
        id: `discovery-${projectId}-${Buffer.from(result.url).toString("base64url").slice(0, 40)}`,
        projectId,
        url: result.url,
        title: result.title,
        reason: result.snippet ?? null
      }
    });

    saved++;
  }

  return saved;
}
