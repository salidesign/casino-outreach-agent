import type { FastifyInstance } from "fastify";
import { DiscoveryAgent } from "../discovery/discovery-agent.js";
import { HttpSearchProvider } from "../discovery/search-provider.js";

export async function discoveryRoutes(app: FastifyInstance) {
  app.post("/api/discovery/run", async (request, reply) => {
    const body = request.body as { topics?: string[]; limitPerQuery?: number };

    if (!body.topics?.length) {
      return reply.badRequest("topics are required");
    }

    const agent = new DiscoveryAgent(new HttpSearchProvider());
    const results = await agent.discover(
      body.topics,
      Math.min(Math.max(body.limitPerQuery ?? 10, 1), 50)
    );

    return { count: results.length, results };
  });
}
