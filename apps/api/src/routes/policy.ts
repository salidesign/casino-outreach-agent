import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { analyzeOpportunityPolicy } from "../policy/service.js";

export async function policyRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.post("/api/opportunities/:id/analyze-policy", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      return await analyzeOpportunityPolicy(prisma, id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "policy analysis failed";
      if (message === "opportunity not found") return reply.notFound(message);
      return reply.badRequest(message);
    }
  });
}
