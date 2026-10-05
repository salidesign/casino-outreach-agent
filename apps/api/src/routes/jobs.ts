import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { enqueuePipeline } from "../jobs/bull.js";

export async function jobRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.post("/api/jobs", async (request, reply) => {
    const body = request.body as { type?: "DISCOVERY"|"POLICY"|"SCORING"|"CONTENT"; projectId?: string; opportunityId?: string; topics?: string[] };
    if (!body.type) return reply.badRequest("type is required");
    const job = await enqueuePipeline(body.type, {
      projectId: body.projectId,
      opportunityId: body.opportunityId,
      topics: body.topics
    });
    return reply.code(202).send({ id: job.id, type: body.type });
  });

  app.post("/api/projects/:id/run-pipeline", async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return reply.notFound("project not found");
    const job = await enqueuePipeline("DISCOVERY", { projectId: id });
    return reply.code(202).send({ message: "pipeline queued", jobId: job.id });
  });
}
