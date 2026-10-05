import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { generateOpportunityContent } from "../content/service.js";

export async function contentRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.post("/api/opportunities/:id/generate-content", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      return await generateOpportunityContent(prisma, id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "content generation failed";
      if (message === "opportunity not found") return reply.notFound(message);
      return reply.badRequest(message);
    }
  });

  app.get("/api/opportunities/:id/content", async (request) => {
    const { id } = request.params as { id: string };
    return prisma.generatedContent.findMany({
      where: { opportunityId: id },
      orderBy: { createdAt: "desc" }
    });
  });

  app.patch("/api/content/:id/approval", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { approved?: boolean };

    if (typeof body.approved !== "boolean") {
      return reply.badRequest("approved must be boolean");
    }

    return prisma.generatedContent.update({
      where: { id },
      data: { approved: body.approved }
    });
  });
}
