import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { scoreOpportunityById } from "../scoring/service.js";

export async function scoringRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.post("/api/opportunities/:id/score", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      return await scoreOpportunityById(prisma, id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "scoring failed";
      if (message === "opportunity not found") return reply.notFound(message);
      return reply.badRequest(message);
    }
  });

  app.get("/api/opportunities/top", async (request) => {
    const query = request.query as { limit?: string };
    const limit = Math.min(Math.max(Number(query.limit ?? 20), 1), 100);

    return prisma.opportunity.findMany({
      where: { status: { in: ["NEW", "REVIEW"] } },
      orderBy: [{ relevanceScore: "desc" }, { policyScore: "desc" }],
      take: limit,
      include: { project: true }
    });
  });
}
