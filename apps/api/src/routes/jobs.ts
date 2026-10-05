import type { FastifyInstance } from "fastify";
import { enqueue, listJobs } from "../jobs/queue.js";
import { PrismaClient } from "@prisma/client";

export async function jobRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient();

  app.post("/api/jobs", async (request, reply) => {
    const body = request.body as { type?: "DISCOVERY"|"POLICY"|"SCORING"|"CONTENT"; projectId?: string; opportunityId?: string; topics?: string[] };
    if (!body.type) return reply.badRequest("type is required");
    return reply.code(202).send(enqueue(body.type, {
      projectId: body.projectId,
      opportunityId: body.opportunityId,
      topics: body.topics
    }));
  });

  app.post("/api/projects/:id/run-pipeline", async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return reply.notFound("project not found");

    const job = enqueue("DISCOVERY", { projectId: id });
    return reply.code(202).send({ message: "pipeline queued", job });
  });

  app.get("/api/jobs", async () => listJobs());
}
