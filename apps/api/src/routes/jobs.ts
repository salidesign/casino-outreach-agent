import type { FastifyInstance } from "fastify";
import { enqueue, listJobs } from "../jobs/queue.js";

export async function jobRoutes(app: FastifyInstance) {
  app.post("/api/jobs", async (request, reply) => {
    const body = request.body as { type?: "DISCOVERY"|"POLICY"|"SCORING"|"CONTENT"; projectId?: string; opportunityId?: string; topics?: string[] };
    if (!body.type) return reply.badRequest("type is required");
    return reply.code(202).send(enqueue(body.type, {
      projectId: body.projectId,
      opportunityId: body.opportunityId,
      topics: body.topics
    }));
  });

  app.get("/api/jobs", async () => listJobs());
}
