import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";
import { discoveryRoutes } from "./routes/discovery.js";
import { policyRoutes } from "./routes/policy.js";
import { scoringRoutes } from "./routes/scoring.js";
import { contentRoutes } from "./routes/content.js";
import { publisherRoutes } from "./routes/publisher.js";
import { jobRoutes } from "./routes/jobs.js";
import { startWorker } from "./jobs/worker.js";

const app = Fastify({ logger: true });
const prisma = new PrismaClient();

await app.register(cors, { origin: true });
await app.register(sensible);
await app.register(discoveryRoutes);
await app.register(policyRoutes);
await app.register(scoringRoutes);
await app.register(contentRoutes);
await app.register(publisherRoutes);
await app.register(jobRoutes);

app.get("/health", async () => ({ ok: true, service: "casino-outreach-agent" }));

app.get("/api/projects", async () => prisma.project.findMany({ orderBy: { createdAt: "desc" } }));

app.post("/api/projects", async (request, reply) => {
  const body = request.body as { name?: string; website?: string; topics?: string[] };
  if (!body.name || !body.website) return reply.badRequest("name and website are required");
  const project = await prisma.project.create({
    data: { name: body.name, website: body.website, topics: body.topics ?? [] }
  });
  return reply.code(201).send(project);
});

const port = Number(process.env.PORT ?? 4000);
await app.listen({ port, host: "0.0.0.0" });
startWorker();
