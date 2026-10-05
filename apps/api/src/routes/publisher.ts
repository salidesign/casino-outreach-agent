import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { ManualPublisher } from "../publisher/manual-publisher.js";
import { publishApprovedContent } from "../publisher/safe-publisher.js";

export async function publisherRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();
  const publisher = new ManualPublisher();

  app.post("/api/opportunities/:id/publish/:contentId", async (request, reply) => {
    const { id, contentId } = request.params as { id: string; contentId: string };

    try {
      return await publishApprovedContent(prisma, id, contentId, publisher);
    } catch (error) {
      const message = error instanceof Error ? error.message : "publish failed";
      if (message === "content not found" || message === "opportunity not found") {
        return reply.notFound(message);
      }
      return reply.badRequest(message);
    }
  });

  app.get("/api/opportunities/:id/publications", async (request) => {
    const { id } = request.params as { id: string };
    return prisma.publication.findMany({
      where: { opportunityId: id },
      orderBy: { createdAt: "desc" }
    });
  });
}
